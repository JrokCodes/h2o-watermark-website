#!/usr/bin/env python3
"""Build src/data/property-details.ts from scraped property-details.json."""
import json
import os

DETAILS = os.path.join(os.path.dirname(__file__), "property-details.json")
EXTRAS = os.path.join(os.path.dirname(__file__), "property-extras.json")
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "property-details.ts")

with open(DETAILS) as f:
    data = json.load(f)

extras = {}
if os.path.exists(EXTRAS):
    with open(EXTRAS) as f:
        extras = json.load(f)


def to_ts_string(s):
    if s is None:
        return "undefined"
    s = s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ").strip()
    return f'"{s}"'


def to_ts_array(items):
    if not items:
        return "[]"
    quoted = [f'"{i.replace(chr(92), chr(92)*2).replace(chr(34), chr(92)+chr(34))}"' for i in items]
    return "[" + ", ".join(quoted) + "]"


def build_photos_array(slug, group, photos):
    if not photos:
        return "[]"
    paths = []
    for i in range(1, len(photos) + 1):
        paths.append(f'"/images/properties/{group}/{slug}/{i:02d}.jpg"')
    return "[\n      " + ",\n      ".join(paths) + "\n    ]"


def build_entry(p, group):
    schools = p.get("schools") or {}
    photos_str = build_photos_array(p["slug"], group, p.get("photos", []))
    ex = extras.get(str(p["id"])) or {}
    # Fill year/sqft from extras if not in details
    if ex.get("yearBuilt") and not p.get("yearBuilt"):
        p["yearBuilt"] = ex["yearBuilt"]
    if ex.get("sqft") and not p.get("buildingSqft"):
        p["buildingSqft"] = ex["sqft"]

    lines = [f"  {p['id']}: {{"]
    lines.append(f"    id: {p['id']},")
    lines.append(f"    slug: {to_ts_string(p['slug'])},")
    lines.append(f"    idxList: {p.get('idx', 'undefined')},")
    if p.get("description"):
        lines.append(f"    description: {to_ts_string(p['description'])},")
    if p.get("yearBuilt"):
        lines.append(f"    yearBuilt: {p['yearBuilt']},")
    if p.get("yearRemodeled"):
        lines.append(f"    yearRemodeled: {p['yearRemodeled']},")
    if p.get("buildingSqft"):
        lines.append(f"    buildingSqft: {p['buildingSqft']},")
    if p.get("lotSizeSqft"):
        lines.append(f"    lotSizeSqft: {p['lotSizeSqft']},")
    if p.get("view"):
        lines.append(f"    view: {to_ts_array(p['view'])},")
    if p.get("amenities"):
        lines.append(f"    amenities: {to_ts_array(p['amenities'])},")
    if p.get("inclusions"):
        lines.append(f"    inclusions: {to_ts_array(p['inclusions'])},")
    if any(schools.values()):
        sl = ["    schools: {"]
        if schools.get("elementary"): sl.append(f"      elementary: {to_ts_string(schools['elementary'])},")
        if schools.get("middle"): sl.append(f"      middle: {to_ts_string(schools['middle'])},")
        if schools.get("high"): sl.append(f"      high: {to_ts_string(schools['high'])},")
        sl.append("    },")
        lines.append("\n".join(sl))
    lines.append(f"    photos: {photos_str},")
    lines.append("  },")
    return "\n".join(lines)


entries = []
for r in data["rentals"]:
    entries.append(build_entry(r, "rentals"))
for s in data["sales"]:
    entries.append(build_entry(s, "sales"))

ts = '''/**
 * Property Detail Data — auto-generated from scripts/build-property-details-ts.py
 * Source: scripts/property-details.json (scraped from h2owatermark.com)
 */

export interface PropertyDetailData {
  id: number;
  slug: string;
  idxList?: number;
  description?: string;
  yearBuilt?: number;
  yearRemodeled?: number;
  buildingSqft?: number;
  lotSizeSqft?: number;
  view?: string[];
  amenities?: string[];
  inclusions?: string[];
  schools?: {
    elementary?: string;
    middle?: string;
    high?: string;
  };
  photos: string[];
}

export const propertyDetails: Record<number, PropertyDetailData> = {
''' + "\n".join(entries) + '''
};

export function getPropertyDetail(id: number): PropertyDetailData | null {
  return propertyDetails[id] || null;
}
'''

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(ts)

print(f"Wrote {OUT}")
print(f"Total entries: {len(entries)}")
