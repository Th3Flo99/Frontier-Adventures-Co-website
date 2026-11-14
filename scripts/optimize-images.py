"""Regenerate responsive WebP copies: python scripts/optimize-images.py (Pillow)."""
import json
from pathlib import Path
from PIL import Image, ImageOps

public = Path(__file__).resolve().parents[1] / 'public'
metadata = {}
for source in [public / 'group-photo.jpg', *sorted((public / 'photos').rglob('*.jpg'))]:
    relative = source.relative_to(public)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        widths = sorted({min(w, image.width) for w in (480, 800, 1100, 1600)})
        # Busy, detailed shots compress poorly; a lower quality is not visible on them
        quality = 65 if source.stem == 'pooh' else 80
        variants = []
        for width in widths:
            height = round(image.height * width / image.width)
            output = Path('optimized') / relative.parent / f'{source.stem}-{width}.webp'
            (public / output).parent.mkdir(parents=True, exist_ok=True)
            image.resize((width, height), Image.Resampling.LANCZOS).save(public / output, 'WEBP', quality=quality, method=6)
            variants.append({'src': output.as_posix(), 'width': width})
        metadata[relative.as_posix()] = {'width': image.width, 'height': image.height, 'variants': variants}
Path('src/data/image-sizes.json').write_text(json.dumps(metadata, indent=2) + '\n')
