#!/usr/bin/env python3
"""Compose the Open Graph / share image: the logo on maroon.

1200 x 630 (the size every network crops to). A maroon-950 field with the
candle glow behind the centre, a double gold hairline frame, and the logo
whole in its ivory plaque with a gold ring — the logo file has an opaque white
ground, so, as on the site (Docs/UI_UX_V2.md 6.8), it is never set bare on
maroon, recoloured or cropped.

Colours are read from the :root block of src/app/globals.css, so the image
follows the tokens; no colour is typed here.

Output: public/images/brand/og-image.png
Run:    python3 scripts/make-og-image.py      (needs Pillow)
"""
import colorsys
import os
import re

from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS = f"{ROOT}/src/app/globals.css"
LOGO = f"{ROOT}/public/logo.jpg"
DEST = f"{ROOT}/public/images/brand/og-image.png"

W, H = 1200, 630
FRAME_INSET = 28      # px from the edge to the outer hairline
RULE_GAP = 4          # px between the two hairlines (the site's rule-double)
PLAQUE = 470          # px, the logo plaque's side
RING = 3              # px of gold around the plaque
GLOW_ALPHA = 0.18     # candle glow peak, as in --glow-candle


def token(name: str) -> tuple:
    """RGB of a `--name: H S% L%;` triplet in globals.css."""
    css = open(CSS, encoding="utf-8").read()
    match = re.search(rf"--{name}:\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%", css)
    if match is None:
        raise SystemExit(f"token --{name} not found in {CSS}")
    h, s, l = (float(v) for v in match.groups())
    r, g, b = colorsys.hls_to_rgb(h / 360, l / 100, s / 100)
    return tuple(round(c * 255) for c in (r, g, b))


def main() -> None:
    maroon = token("maroon-950")
    gold = token("gold-500")
    ivory = token("ivory-50")

    canvas = Image.new("RGB", (W, H), maroon)

    # Candle glow: gold at 18% fading to nothing, centred behind the plaque.
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse(
        (W / 2 - 420, H / 2 - 300, W / 2 + 420, H / 2 + 300), fill=round(255 * GLOW_ALPHA)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    canvas = Image.composite(Image.new("RGB", (W, H), gold), canvas, glow)

    draw = ImageDraw.Draw(canvas)
    for inset in (FRAME_INSET, FRAME_INSET + RULE_GAP):
        draw.rectangle((inset, inset, W - 1 - inset, H - 1 - inset), outline=gold, width=1)

    # Plaque: gold ring, ivory ground, the logo whole inside it.
    left, top = (W - PLAQUE) // 2, (H - PLAQUE) // 2
    draw.rectangle((left - RING, top - RING, left + PLAQUE + RING - 1, top + PLAQUE + RING - 1), fill=gold)
    draw.rectangle((left, top, left + PLAQUE - 1, top + PLAQUE - 1), fill=ivory)
    logo = Image.open(LOGO).convert("RGB").resize((PLAQUE, PLAQUE), Image.LANCZOS)
    canvas.paste(logo, (left, top))

    os.makedirs(os.path.dirname(DEST), exist_ok=True)
    canvas.save(DEST, optimize=True)
    print(f"wrote {os.path.relpath(DEST, ROOT)} ({W}x{H}, {os.path.getsize(DEST) // 1024} kB)")


if __name__ == "__main__":
    main()
