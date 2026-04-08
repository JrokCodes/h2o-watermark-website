#!/usr/bin/env python3
"""Scrape unit numbers, MLS, sqft, beds, baths, parking from listing_detail pages."""
import json
import os
import re
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0)"}
BASE = "https://h2owatermark.com/listing_detail.php?idx_list="

DETAILS = os.path.join(os.path.dirname(__file__), "property-details.json")
OUT = os.path.join(os.path.dirname(__file__), "property-extras.json")


def fetch(idx: int) -> dict:
    url = BASE + str(idx)
    req = urllib.request.Request(url, headers=UA)
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")

    def find_field(label: str) -> str | None:
        m = re.search(rf"{re.escape(label)}</td>\s*<td>([^<]+)</td>", html)
        return m.group(1).strip() if m else None

    def parse_int(s: str | None) -> int | None:
        if not s:
            return None
        m = re.search(r"\d[\d,]*", s)
        return int(m.group(0).replace(",", "")) if m else None

    unit = find_field("Unit Number")
    mls = find_field("MLS No.")
    sqft = find_field("Sq.ft Total")
    beds_raw = find_field("Beds")
    baths_raw = find_field("Baths")
    parking_raw = find_field("Parking")
    year_raw = find_field("Year Built")

    beds = parse_int(beds_raw) if beds_raw else None
    parking = parse_int(parking_raw) if parking_raw else None
    sqft_int = parse_int(sqft)

    # Baths: "Full( 2 ) / half( 1 )" → 2.5
    baths = None
    if baths_raw:
        full = re.search(r"Full\(\s*(\d+)\s*\)", baths_raw)
        half = re.search(r"half\(\s*(\d+)\s*\)", baths_raw)
        f = int(full.group(1)) if full else 0
        h = int(half.group(1)) if half else 0
        baths = f + h * 0.5
        if baths == 0:
            baths = None

    return {
        "unit": unit if unit and unit != "0" else None,
        "mls": mls,
        "sqft": sqft_int,
        "beds": beds,
        "baths": baths,
        "parking": parking,
        "yearBuilt": parse_int(year_raw),
    }


def main():
    with open(DETAILS) as f:
        data = json.load(f)

    extras = {}
    for group_name in ["rentals", "sales"]:
        for p in data[group_name]:
            pid = p["id"]
            idx = p.get("idx")
            if not idx:
                continue
            try:
                info = fetch(idx)
                extras[str(pid)] = info
                print(f"  {pid} ({p.get('label')}): unit={info['unit']} sqft={info['sqft']} beds={info['beds']} baths={info['baths']} pk={info['parking']}")
            except Exception as e:
                print(f"  FAIL {pid}: {e}")

    with open(OUT, "w") as f:
        json.dump(extras, f, indent=2)
    print(f"\nWrote {OUT} ({len(extras)} entries)")


if __name__ == "__main__":
    main()
