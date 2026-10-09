"""Import verified public photos from the reviewed October 9 manifest.

Provide a directory containing the downloaded JPEGs. Never enlarge a source.
Run sync-course-photos.cjs after updating the registry.
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
inputs = Path(sys.argv[1])
registry_path = root / "assets/course-photos/credits.json"
registry = json.loads(registry_path.read_text())
existing = {i for p in registry for i in p["courses"]}
manifest = Path(sys.argv[2]) if len(sys.argv) > 2 else root / "docs/photo-expansion-20261009/batch.json"
batch = json.loads(manifest.read_text())
for entry in batch:
    if all(i in existing for i in entry["courses"]):
        continue
    assert not any(i in existing for i in entry["courses"]), "Partial duplicate"
    record = dict(entry)
    local = record.pop("local")
    file = inputs / (local + ".jpg")
    data = file.read_bytes()
    picture = ImageOps.exif_transpose(Image.open(file)).convert("RGB")
    picture.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
    course_id = next(iter(record["courses"]))
    asset = root / "assets/course-photos" / (course_id + ".webp")
    picture.save(asset, "WEBP", quality=85, method=6)
    record.update(src="/assets/course-photos/" + asset.name,
                  width=picture.width, height=picture.height,
                  sourceSha256=hashlib.sha256(data).hexdigest(),
                  assetSha256=hashlib.sha256(asset.read_bytes()).hexdigest(),
                  changes="웹용 축소·WebP 변환, 화면 비율에 따라 가장자리 잘림",
                  checked="2026-10-09")
    registry.append(record)
    existing.update(record["courses"])
registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n")
print(f"Registered photos for {len(existing)} courses")
