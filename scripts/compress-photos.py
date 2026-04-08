#!/usr/bin/env python3
"""Compress all property photos to max 1280px wide, JPEG quality 80."""
import os
import sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "images", "properties")
MAX_WIDTH = 1280
QUALITY = 82

processed = 0
saved_bytes = 0

for dirpath, _, files in os.walk(ROOT):
    for f in files:
        if not f.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        path = os.path.join(dirpath, f)
        try:
            orig_size = os.path.getsize(path)
            img = Image.open(path)
            # Convert PNG to RGB for JPEG output
            if img.mode in ("RGBA", "P", "LA"):
                bg = Image.new("RGB", img.size, (255, 255, 255))
                bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
                img = bg
            elif img.mode != "RGB":
                img = img.convert("RGB")

            if img.width > MAX_WIDTH:
                ratio = MAX_WIDTH / img.width
                new_size = (MAX_WIDTH, int(img.height * ratio))
                img = img.resize(new_size, Image.LANCZOS)

            # Save as JPEG (replace .png with .jpg)
            if path.lower().endswith(".png"):
                new_path = path[:-4] + ".jpg"
                img.save(new_path, "JPEG", quality=QUALITY, optimize=True)
                os.remove(path)
                path = new_path
            else:
                img.save(path, "JPEG", quality=QUALITY, optimize=True)

            new_size = os.path.getsize(path)
            saved_bytes += (orig_size - new_size)
            processed += 1
            if processed % 50 == 0:
                print(f"  Processed {processed} files, saved {saved_bytes // 1024 // 1024} MB so far")
        except Exception as e:
            print(f"  ERROR {path}: {e}")

print(f"\nDone. Processed {processed} files. Saved {saved_bytes // 1024 // 1024} MB total.")
