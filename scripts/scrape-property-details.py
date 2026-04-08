#!/usr/bin/env python3
"""
Scrape ALL photo galleries + property details from h2owatermark.com
for every active rental + sale listing.

Outputs JSON to scripts/property-details.json that can be consumed by the TS data file.
"""
import re
import json
import sys
import urllib.request
import os

BASE = "https://h2owatermark.com"
OUT = os.path.join(os.path.dirname(__file__), "property-details.json")

# Active rentals — slug + idx_list (already known from prior exploration)
ACTIVE_RENTALS = [
    {"id": 1, "slug": "watermark-3104", "idx": 575, "rent": 5750, "label": "Watermark #3104"},
    {"id": 2, "slug": "watermark-1604", "idx": 241, "rent": 5250, "label": "Watermark #1604"},
    {"id": 3, "slug": "watermark-1905", "idx": 537, "rent": 8500, "label": "Watermark #1905"},
    {"id": 4, "slug": "eaton-2614",     "idx": 654, "rent": 2798, "label": "Eaton Square #2614"},
    {"id": 5, "slug": "ohua-1905",      "idx": 529, "rent": 2900, "label": "201 Ohua #1905"},
    {"id": 6, "slug": "kahului",        "idx": 753, "rent": 13800,"label": "1090 Kahului"},
    {"id": 7, "slug": "poipu",          "idx": 239, "rent": 6950, "label": "Poipu Drive"},
    {"id": 8, "slug": "canterbury-36e", "idx": 745, "rent": 3350, "label": "Canterbury #36E"},
]

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36"}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", errors="ignore")


def find_active_sales_idx_ids() -> list:
    """Scrape h2o_listing.php and extract (price, idx_list) for active listings."""
    html = fetch(f"{BASE}/h2o_listing.php")
    results = []

    # Sales page uses goto_listing_detail('mls','idx') JS calls instead of hrefs
    # Match all of them
    matches = list(re.finditer(r"goto_listing_detail\('(\d+)',\s*'(\d+)'\)", html))
    seen = set()
    for m in matches:
        # group(1) is MLS, group(2) is idx_list
        idx = m.group(2)
        if idx in seen:
            continue
        seen.add(idx)
        # Window around the match (300 chars before, 1500 after)
        start = max(0, m.start() - 300)
        end = min(len(html), m.end() + 1500)
        chunk = html[start:end]
        text = re.sub(r'<[^>]+>', ' ', chunk)
        text = re.sub(r'\s+', ' ', text).strip()
        # Skip if it's marked SOLD
        sold = bool(re.search(r'sold_banner|class="sold"|>SOLD<', chunk, re.IGNORECASE))
        # Find price (format: $1,234,567)
        price_m = re.search(r'\$\s*([\d,]+)', text)
        # Find address keywords
        addr_kw = None
        for kw in ['Watermark', '1551 Ala Wai', 'Eaton', 'Hobron', 'Mawaena Kai',
                   'Hawaii Kai Dr', 'Nauru Tower', '1330 Ala Moana', 'Kaluanui',
                   'Ritz-Carlton', '383 Kalaimoku', '6651 Hawaii Kai', '251 Kalalau']:
            if kw.lower() in text.lower():
                addr_kw = kw
                break
        if not sold and price_m:
            try:
                price = int(price_m.group(1).replace(',', ''))
                results.append({
                    "idx": int(idx),
                    "price": price,
                    "keyword": addr_kw or "?",
                })
            except ValueError:
                pass
    return results


def fetch_property_details(idx: int) -> dict:
    """Fetch a single listing detail page and extract everything."""
    url = f"{BASE}/listing_detail.php?idx_list={idx}"
    print(f"  fetching {url}")
    try:
        html = fetch(url)
    except Exception as e:
        print(f"    ERROR: {e}")
        return {}

    # Photos — find ALL photo/X.jpg in the entire HTML (gallery + JS arrays)
    photos = list(dict.fromkeys(
        re.findall(r'photo/[a-zA-Z0-9_.()-]+\.(?:jpg|png|jpeg|JPG|PNG|JPEG)', html)
    ))

    # Strip HTML for text extraction
    text = re.sub(r'<[^>]+>', ' ', html)
    text = re.sub(r'\s+', ' ', text).strip()

    # Description — usually after "Property Description"
    desc = None
    desc_m = re.search(r'Property Description\s*[:\.]?\s*([^.]+(?:\.[^.]+){0,8})', text)
    if desc_m:
        desc = desc_m.group(1).strip()[:600]

    # Inclusions — comma-separated list
    inc_m = re.search(r'Inclusions\s*[:\.]?\s*([A-Z][^A-Z]{2,200}?)(?:\s*Amenities|\s*Elementary|\s*Lot Size|\s*View|$)', text)
    inclusions = []
    if inc_m:
        inclusions = [s.strip() for s in inc_m.group(1).split(',') if s.strip() and len(s.strip()) < 60]

    # Amenities
    am_m = re.search(r'Amenities\s*[:\.]?\s*([A-Z][^A-Z]{2,300}?)(?:\s*Elementary|\s*Lot Size|\s*View|\s*Year|$)', text)
    amenities = []
    if am_m:
        amenities = [s.strip() for s in am_m.group(1).split(',') if s.strip() and len(s.strip()) < 60]

    # Schools
    elem_m = re.search(r'Elementary School\s+([A-Za-z][A-Za-z\s]+?)(?:\s+Middle|\s+High|\s+Lot|$)', text)
    mid_m = re.search(r'Middle School\s+([A-Za-z][A-Za-z\s]+?)(?:\s+High|\s+Lot|$)', text)
    high_m = re.search(r'High School\s+([A-Za-z][A-Za-z\s]+?)(?:\s+Lot|$)', text)

    # Year built
    year_m = re.search(r'Year Built\s+(\d{4})', text)
    year_remod_m = re.search(r'Year Remodeled\s+(\d{4})', text)

    # View
    view_m = re.search(r'View\s+([A-Za-z][A-Za-z, ]+?)(?:\s*Year|\s*Lot|$)', text)
    views = []
    if view_m:
        views = [v.strip() for v in view_m.group(1).split(',') if v.strip() and len(v.strip()) < 30]

    # Sqft
    bldg_m = re.search(r'Sq\.?ft Building\s+(\d+)', text)
    lot_m = re.search(r'Lot Size Area\s+(\d+)', text)

    return {
        "idx": idx,
        "url": url,
        "description": desc,
        "inclusions": inclusions,
        "amenities": amenities,
        "schools": {
            "elementary": elem_m.group(1).strip() if elem_m else None,
            "middle": mid_m.group(1).strip() if mid_m else None,
            "high": high_m.group(1).strip() if high_m else None,
        },
        "yearBuilt": int(year_m.group(1)) if year_m else None,
        "yearRemodeled": int(year_remod_m.group(1)) if year_remod_m else None,
        "view": views,
        "buildingSqft": int(bldg_m.group(1)) if bldg_m else None,
        "lotSizeSqft": int(lot_m.group(1)) if lot_m else None,
        "photos": photos,
        "photoCount": len(photos),
    }


def main():
    output = {"rentals": [], "sales": []}

    print("Scraping rentals...")
    for r in ACTIVE_RENTALS:
        details = fetch_property_details(r["idx"])
        details.update({"slug": r["slug"], "id": r["id"], "label": r["label"], "rentPrice": r["rent"]})
        output["rentals"].append(details)
        print(f"  {r['label']}: {details.get('photoCount', 0)} photos")

    print("\nFinding active sales idx IDs...")
    sales = find_active_sales_idx_ids()
    print(f"  Found {len(sales)} active sale listings")

    # Map our existing sales (id 1001-1012) to scraped idx IDs by price match
    KNOWN_SALES = [
        (1001, 1350000, "watermark-sale-1350k", "Watermark #1350k"),
        (1002, 1580000, "watermark-sale-1580k", "Watermark #1580k"),
        (1003, 1480000, "watermark-sale-1480k", "Watermark #2802 #1480k"),
        (1004, 1488000, "watermark-sale-1488k", "Watermark #1488k"),
        (1005, 1298000, "watermark-sale-1298k", "Watermark #1298k"),
        (1006, 298888,  "eaton-sale-298k",      "Eaton #298k"),
        (1007, 379000,  "mawaena-kai-379k",     "Mawaena Kai $379k"),
        (1008, 950000,  "nauru-tower-950k",     "Nauru Tower $950k"),
        (1009, 888888,  "kaluanui-888k",        "Kaluanui $888k"),
        (1010, 888000,  "ritz-studio-888k",     "Ritz-Carlton studio"),
        (1011, 1588000, "hawaii-kai-6651",      "6651 Hawaii Kai"),
        (1012, 1599000, "kalalau-251-sale",     "251 Kalalau"),
    ]

    print("\nScraping sales detail pages...")
    for our_id, our_price, slug, label in KNOWN_SALES:
        # Find matching idx by price
        match = next((s for s in sales if s["price"] == our_price), None)
        if not match:
            print(f"  {label}: price ${our_price} not found in scraped sales — SKIPPING")
            continue
        details = fetch_property_details(match["idx"])
        details.update({"slug": slug, "id": our_id, "label": label, "salePrice": our_price})
        output["sales"].append(details)
        print(f"  {label}: idx={match['idx']}, {details.get('photoCount', 0)} photos")

    with open(OUT, "w") as f:
        json.dump(output, f, indent=2)

    total_photos = sum(p.get('photoCount', 0) for p in output['rentals'] + output['sales'])
    print(f"\nDone. Total photos: {total_photos}")
    print(f"Output: {OUT}")


if __name__ == "__main__":
    main()
