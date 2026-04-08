#!/usr/bin/env python3
"""Stitch OpenStreetMap tiles into per-area static maps for the website."""
import math
import os
import time
import urllib.request
from io import BytesIO

from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "areas")
os.makedirs(OUT, exist_ok=True)

UA = {"User-Agent": "h2owatermark-website/1.0 (rixon@intelleq.com)"}
TILE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
TILE_SIZE = 256

# (slug, lat, lon, zoom)
AREAS = [
    ("waikiki",      21.2769, -157.8275, 14),
    ("hawaii-kai",   21.2900, -157.7064, 13),
    ("ala-moana",    21.2900, -157.8434, 14),
    ("kailua",       21.4022, -157.7394, 13),
    ("kaneohe",      21.4180, -157.8033, 13),
    ("diamond-head", 21.2620, -157.8053, 14),
    ("kapolei",      21.3358, -158.0581, 13),
    ("aiea",         21.3792, -157.9333, 14),
]


def deg2num(lat, lon, zoom):
    """Lat/lon → fractional tile (x, y)."""
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom
    xt = (lon + 180.0) / 360.0 * n
    yt = (1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n
    return xt, yt


def fetch_tile(z, x, y):
    url = TILE.format(z=z, x=x, y=y)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return Image.open(BytesIO(r.read())).convert("RGB")


def stitch(lat, lon, zoom, tiles_wide=3, tiles_tall=3):
    xt, yt = deg2num(lat, lon, zoom)
    cx, cy = int(math.floor(xt)), int(math.floor(yt))
    half_w, half_h = tiles_wide // 2, tiles_tall // 2

    canvas = Image.new("RGB", (TILE_SIZE * tiles_wide, TILE_SIZE * tiles_tall))
    for dx in range(-half_w, half_w + 1):
        for dy in range(-half_h, half_h + 1):
            tile = fetch_tile(zoom, cx + dx, cy + dy)
            canvas.paste(tile, ((dx + half_w) * TILE_SIZE, (dy + half_h) * TILE_SIZE))
            time.sleep(0.1)  # be polite
    # Crop to a square centered on the actual lat/lon
    px = int((xt - cx + half_w) * TILE_SIZE)
    py = int((yt - cy + half_h) * TILE_SIZE)
    side = TILE_SIZE * min(tiles_wide, tiles_tall)
    left = max(0, px - side // 2)
    top = max(0, py - side // 2)
    right = min(canvas.width, left + side)
    bottom = min(canvas.height, top + side)
    return canvas.crop((left, top, right, bottom))


for slug, lat, lon, zoom in AREAS:
    out = os.path.join(OUT, f"{slug}.jpg")
    try:
        img = stitch(lat, lon, zoom, tiles_wide=3, tiles_tall=3)
        img = img.resize((600, 600), Image.LANCZOS)
        img.save(out, "JPEG", quality=85, optimize=True)
        print(f"  OK {slug} ({os.path.getsize(out)//1024} KB)")
    except Exception as e:
        print(f"  FAIL {slug}: {e}")

print(f"\nDone. Saved to {OUT}")
