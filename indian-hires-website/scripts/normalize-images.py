#!/usr/bin/env python3
"""Normalize curated catalogue photography into /public/images/products/**.

Square 1200x1200 WebP tiles + tiny base64 blur placeholders, plus a JSON
manifest consumed when generating src/content/products.ts.
"""
import base64, io, json, os, shutil

from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
SRC = f"{ROOT}/public/images/Photos"
OUT = f"{ROOT}/public/images/products"
MANIFEST = f"{ROOT}/scripts/.image-manifest.json"
SIZE = 1200
QUALITY = 82

# category -> (source folder, [(source file, slug, name, alt)])
KEEP = {
    "bone-china": ("Crockery", [
        ("Gold Chain C..png", "golden-rim", "Golden Rim Bone China",
         "Bone china dinner plate, side plate and bowls with a woven gold rim"),
        ("Green Golden C..png", "emerald-gold", "Emerald & Gold Bone China",
         "Bone china place setting with emerald green and gold patterned borders"),
        ("Haldi Ivory C..png", "haldi-ivory", "Haldi Ivory Bone China",
         "Warm ivory bone china plates, cup and bowls edged with a fine gold line"),
        ("Plain White C..png", "classic-white", "Classic White Bone China",
         "Plain white bone china dinner plate, side plate and serving bowls"),
        ("Spiral  C..png", "spiral-motif", "Spiral Motif Bone China",
         "White bone china set decorated with black spiral motifs"),
        ("Elegant Porcelain Dinnerware Still Life.png", "black-scallop",
         "Black Scallop Bone China",
         "Bone china dinner plate, side plate, cup and saucer and bowl with a black scallop lattice border and a fine gold rim"),
    ]),
    "melamine": ("Malemine", [
        ("Black Matt M..png", "matt-black", "Matt Black Melamine",
         "Matt black melamine charger, dinner plate and two bowls"),
        ("Blue Matt M..png", "blue-matt", "Blue Matt Melamine Set",
         "Blue matt melamine plates and bowls"),
        ("White Matt M..png", "white-matt", "White Matt Melamine Set",
         "White matt melamine plates and bowls"),
        ("Bluerim.png", "blue-rim", "Blue Rim Melamine Set",
         "Melamine place setting with a fine blue rim, cutlery, bowls and cups"),
    ]),
    "glassware": ("GlassWare", [
        ("WhatsApp Image 2026-07-20 at 00.09.12 (2).jpeg", "highball",
         "Highball Tumbler", "Tall plain glass highball tumbler"),
        ("WhatsApp Image 2026-07-20 at 00.09.13 (1).jpeg", "wine-glass",
         "Wine Glass", "Stemmed clear glass wine glass"),
        ("WhatsApp Image 2026-07-20 at 00.09.13 (2).jpeg", "rocks-tumbler",
         "Rocks Tumbler", "Short wide-bowled clear glass rocks tumbler"),
        ("WhatsApp Image 2026-07-20 at 00.09.13.jpeg", "water-tumbler",
         "Straight Water Tumbler", "Straight-sided clear glass water tumbler"),
    ]),
    # Backdrop for the Vintage collection, not a product: its cover only.
    "vintage": ("Silverware", []),
    "wooden": ("Wooden", [
        ("Warm Wooden Tableware Collection.png", "wooden-plates",
         "Wooden Plates",
         "Round natural wooden plates and small bowls on a dark backdrop"),
        ("Warm Wooden Kitchenware Display.png", "wooden-platters-display",
         "Wooden Plates Display",
         "Scalloped wooden platters and a wooden bowl beside a gold tiered stand"),
    ]),
    "chafing-dishes": ("Chrafering-dish", [
        ("Ornate Antique Bronze Vessel.png", "antique-bronze-vessel",
         "Ornate Antique Bronze Vessel",
         "Ornate antique bronze vessel"),
        ("Ornate Golden Ribbed Serving Pot.png", "golden-ribbed-serving-pot",
         "Ornate Golden Ribbed Serving Pot",
         "Ornate golden ribbed serving pot"),
        ("Ornate Golden Urn on Pedestal.png", "golden-urn-pedestal",
         "Ornate Golden Urn on Pedestal",
         "Ornate golden urn on pedestal"),
        ("Ornate Hammered Brass Chafing Dish.png", "hammered-brass-chafing-dish",
         "Ornate Hammered Brass Chafing Dish",
         "Ornate hammered brass chafing dish"),
        ("Golden Brass Canister on Dark Stone.png", "golden-brass-canister",
         "Golden Brass Canister",
         "Golden brass canister on dark stone"),
    ]),
}

# Dedicated category cover shots that are NOT product tiles.
COVERS = {
    "vintage": ("Silverware", "Ornate Silverware Still Life.png",
                "Ornate silverware: engraved trays, a covered vessel and hammered bowls on a dark backdrop"),
    "bone-china": ("Crockery", "WhatsApp Image 2026-07-20 at 00.12.22.jpeg",
                   "Close detail of an emerald and gold bone china place setting"),
}
# Categories whose cover reuses an existing tile.
COVER_FROM_TILE = {
    "melamine": "blue-rim",
    "glassware": "wine-glass",
    "wooden": "wooden-plates",
    "chafing-dishes": "golden-urn-pedestal",
}

REJECTED = [
    ("Malemine/WhatsApp Image 2026-07-20 at 00.10.37.jpeg",
     "Wooden platters and bowls — not melamine. Miscategorised."),
    ("Chrafering-dish/WhatsApp Image 2026-07-20 at 00.09.55 (1).jpeg",
     "Domestic wall and electrical switchboard dominate the frame."),
    ("Chrafering-dish/WhatsApp Image 2026-07-20 at 00.09.56 (2).jpeg",
     "A hand and open street are visible in frame."),
    ("Chrafering-dish/WhatsApp Image 2026-07-20 at 00.09.56.jpeg",
     "398x445 source — too low resolution to publish."),
    ("Chrafering-dish/WhatsApp Image 2026-07-20 at 00.09.57.jpeg",
     "Product is sitting on a cardboard shipping box."),
]


# Tall shots where the product fills the full frame height: a centre crop would
# cut the rim or the base off, so these get letterboxed onto a blurred fill of
# their own backdrop instead.
PAD = {
    "glassware/highball", "glassware/wine-glass", "glassware/water-tumbler",
}


def square(im: Image.Image, bias: float = 0.5) -> Image.Image:
    """Centre-weighted square crop; bias shifts the window vertically."""
    w, h = im.size
    s = min(w, h)
    left = (w - s) // 2
    top = int((h - s) * bias)
    return im.crop((left, top, left + s, top + s))


def square_pad(im: Image.Image) -> Image.Image:
    """Fit the whole product on a square canvas backed by its own blurred backdrop."""
    w, h = im.size
    s = max(w, h)
    bg = im.resize((s, s), Image.LANCZOS).filter(ImageFilter.GaussianBlur(s // 24))
    bg = ImageEnhance.Brightness(bg).enhance(0.82)
    bg.paste(im, ((s - w) // 2, (s - h) // 2))
    return bg


def blur_uri(im: Image.Image) -> str:
    t = im.copy()
    t.thumbnail((16, 16))
    buf = io.BytesIO()
    t.save(buf, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def emit(src_path: str, dest_path: str, key: str = "") -> dict:
    im = Image.open(src_path).convert("RGB")
    im = square_pad(im) if key in PAD else square(im)
    if im.width > SIZE:
        im = im.resize((SIZE, SIZE), Image.LANCZOS)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    im.save(dest_path, "WEBP", quality=QUALITY, method=6)
    return {"width": im.width, "height": im.height, "blurDataURL": blur_uri(im)}


def main():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    manifest = {"categories": {}, "rejected": REJECTED}

    for cat, (folder, items) in KEEP.items():
        entries = []
        for fname, slug, name, alt in items:
            src = os.path.join(SRC, folder, fname)
            dest = f"{OUT}/{cat}/{slug}.webp"
            meta = emit(src, dest, f"{cat}/{slug}")
            entries.append({
                "slug": slug, "name": name, "alt": alt,
                "src": f"/images/products/{cat}/{slug}.webp",
                "source": f"{folder}/{fname}", **meta,
            })
            print(f"  {cat}/{slug}.webp  <- {folder}/{fname}")

        if cat in COVERS:
            folder_c, fname_c, alt_c = COVERS[cat]
            dest = f"{OUT}/{cat}/cover.webp"
            meta = emit(os.path.join(SRC, folder_c, fname_c), dest)
            cover = {"src": f"/images/products/{cat}/cover.webp", "alt": alt_c, **meta}
        else:
            tile = next(e for e in entries if e["slug"] == COVER_FROM_TILE[cat])
            cover = {"src": tile["src"], "alt": tile["alt"],
                     "width": tile["width"], "height": tile["height"],
                     "blurDataURL": tile["blurDataURL"]}

        manifest["categories"][cat] = {"products": entries, "cover": cover}

    # Brand mark
    logo_src = f"{REPO}/Docs/LOGO (TM).jpg"
    logo = Image.open(logo_src).convert("RGB")
    logo.thumbnail((512, 512), Image.LANCZOS)
    os.makedirs(f"{ROOT}/public/images/brand", exist_ok=True)
    logo.save(f"{ROOT}/public/images/brand/logo.webp", "WEBP", quality=90, method=6)
    manifest["brand"] = {"src": "/images/brand/logo.webp",
                         "width": logo.width, "height": logo.height}
    print(f"  brand/logo.webp {logo.width}x{logo.height}")

    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2)

    kept = sum(len(v["products"]) for v in manifest["categories"].values())
    print(f"\nkept {kept} tiles, rejected {len(REJECTED)}")


if __name__ == "__main__":
    main()
