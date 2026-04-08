#!/usr/bin/env python3
"""Download development photos from h2owatermark.com/new_dev/."""
import os
import urllib.request
import urllib.parse

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "developments")
os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}

# Mapping: our slug → source filename on h2owatermark.com
DEVS = [
    ("alia-condo",            "Alia Condo in Honolulu.jpg"),
    ("launiu-ward-village",   "The Launiu Ward Village.jpg"),
    ("kahuina-kakaako",       "Kahuina Kakaako.jpg"),
    ("park-ward-village",     "The_Park_Ward_Village.jpg"),
    ("park-on-keeaumoku",     "The_Park_On_Keeaumoku.jpg"),
    ("ulana-ward-village",    "Ulana_Ward_Village.jpg"),
    ("victoria-place",        "Victoria_Place.jpg"),
    ("sky-ala-moana",         "18.jpg"),
    ("azure-ala-moana",       "Azure_Ala_Moana.jpg"),
    ("central-ala-moana",     "15.jpg"),
    ("aaliii",                "AAliii.jpg"),
    ("koula",                 "13.jpg"),
    ("anaha",                 "10.jpg"),
    ("aeo",                   "3.jpg"),
    ("keauhou-place",         "4.jpg"),
    ("park-lane-ala-moana",   "6.jpg"),
    ("400-keawe",             "7.jpg"),
    ("collection",            "9.jpg"),
    ("symphony-honolulu",     "10.jpg"),
    ("ritz-carlton",          "11.jpg"),
    ("waiea",                 "12.jpg"),
    ("404-ward",              "5.jpg"),
]

for slug, src in DEVS:
    url = "https://h2owatermark.com/new_dev/" + urllib.parse.quote(src)
    out = os.path.join(OUT, slug + ".jpg")
    if os.path.exists(out) and os.path.getsize(out) > 1000:
        print(f"  skip {slug}")
        continue
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(out, "wb") as f:
            f.write(data)
        print(f"  OK {slug} ({len(data)//1024} KB)")
    except Exception as e:
        print(f"  FAIL {slug}: {e}")

print(f"\nDone. Saved to {OUT}")
