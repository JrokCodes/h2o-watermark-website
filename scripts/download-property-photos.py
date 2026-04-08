#!/usr/bin/env python3
"""
Download all property photos from h2owatermark.com using property-details.json.

Outputs: public/images/properties/{rentals|sales}/{slug}/01.jpg, 02.jpg, ...

Skips existing files. Safe to re-run.
"""
import json
import os
import urllib.request
import urllib.parse
import sys

BASE = "https://h2owatermark.com"
DETAILS = os.path.join(os.path.dirname(__file__), "property-details.json")
OUT_ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "properties")

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36"}


def download(url: str, out_path: str) -> bool:
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000:
        return True  # already downloaded
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(out_path, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print(f"    FAIL: {url} ({e})")
        return False


def process_group(properties: list, group_name: str):
    total_ok = 0
    total_fail = 0
    for p in properties:
        slug = p["slug"]
        photos = p.get("photos", [])
        if not photos:
            continue
        out_dir = os.path.join(OUT_ROOT, group_name, slug)
        os.makedirs(out_dir, exist_ok=True)
        ok = 0
        for i, photo_path in enumerate(photos, start=1):
            ext = photo_path.rsplit(".", 1)[-1].lower()
            out_file = os.path.join(out_dir, f"{i:02d}.{ext}")
            # URL encode the photo path (it may contain spaces or parens)
            url = BASE + "/" + urllib.parse.quote(photo_path, safe="/")
            if download(url, out_file):
                ok += 1
        print(f"  {p['label']}: {ok}/{len(photos)} downloaded")
        total_ok += ok
        total_fail += (len(photos) - ok)
    return total_ok, total_fail


def main():
    with open(DETAILS) as f:
        data = json.load(f)

    print("Downloading rental photos...")
    r_ok, r_fail = process_group(data["rentals"], "rentals")

    print("\nDownloading sales photos...")
    s_ok, s_fail = process_group(data["sales"], "sales")

    print(f"\nDone. Rentals: {r_ok} OK / {r_fail} fail. Sales: {s_ok} OK / {s_fail} fail.")
    print(f"Total: {r_ok + s_ok} downloaded")


if __name__ == "__main__":
    main()
