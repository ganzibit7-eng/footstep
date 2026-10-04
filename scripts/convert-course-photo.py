"""Prepare a reviewed, resize-permitted photograph for the existing card format."""
import sys
from PIL import Image, ImageOps
source, destination, width, height = sys.argv[1:]
with Image.open(source) as image:
    image = ImageOps.exif_transpose(image)
    image.thumbnail((1200, 1200))
    if image.size != (int(width), int(height)):
        raise ValueError('Unexpected reviewed photograph dimensions')
    image.convert('RGB').save(destination, 'WEBP', quality=85, method=6)
