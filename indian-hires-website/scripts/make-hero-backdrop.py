#!/usr/bin/env python3
"""Compose the wide hero backdrop.

The catalogue sources are all near-square, so cropping one to a cinematic
ratio just yields a thin band across the middle of a plate — no rim, no
composition, no subject. Instead this *composes*: a wide near-black maroon
field with the bone china set whole and intact on the right, its left edge
feathered into the dark so the headline lockup has genuine negative space to
sit in rather than fighting the photograph.

Output: public/images/brand/hero-backdrop.webp
"""
import os

from PIL import Image, ImageDraw, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = f"{ROOT}/public/images/Photos/Crockery/Haldi.jpeg"
DEST = f"{ROOT}/public/images/brand/hero-backdrop.webp"

W, H = 2200, 940
FIELD = (74, 21, 9)      # #4A1509 deep oxblood — the logo's own hue, so the
                         # photo dissolves into the brand red, not into black
RIGHT_MARGIN = 40        # px of field left at the far right edge
FEATHER = 520            # px over which the photo dissolves into the field


def main():
    photo = Image.open(SRC).convert("RGB")

    # Scale to fill the canvas height, keeping the set whole.
    scale = H / photo.height
    pw, ph = int(photo.width * scale), H
    photo = photo.resize((pw, ph), Image.LANCZOS)
    photo = ImageEnhance.Brightness(photo).enhance(0.88)

    canvas = Image.new("RGB", (W, H), FIELD)
    x = W - pw - RIGHT_MARGIN

    # Horizontal alpha ramp: transparent at the photo's left edge, opaque once
    # past the feather. Keeps the china readable while the left third goes dark.
    mask = Image.new("L", (pw, ph), 255)
    ramp = Image.new("L", (pw, 1))
    for px in range(pw):
        ramp.putpixel((px, 0), int(255 * min(1.0, px / FEATHER) ** 1.4))
    mask = ramp.resize((pw, ph))

    canvas.paste(photo, (x, 0), mask)

    # Soft vignette so the corners settle and the eye lands mid-frame.
    vig = Image.new("L", (W, H), 0)
    ImageDraw.Draw(vig).ellipse((-W * 0.25, -H * 0.55, W * 1.25, H * 1.55), fill=255)
    canvas = Image.composite(canvas, Image.new("RGB", (W, H), FIELD), vig)

    os.makedirs(os.path.dirname(DEST), exist_ok=True)
    canvas.save(DEST, "WEBP", quality=88, method=6)
    print(f"wrote {DEST} ({W}x{H})")


if __name__ == "__main__":
    main()
