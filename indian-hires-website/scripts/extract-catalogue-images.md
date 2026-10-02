# Exporting photographs from the catalogue PDFs

How to get the product photographs out of the owner's four-page catalogue and into
the site. Nothing here is automated: it is a short manual job, done once per
catalogue.

**The PDFs carry wholesale rates. They never go into this repository, and neither
does any image that shows a rate.** Work in a folder outside the repo.

## What you need

```bash
brew install poppler webp     # pdfimages, pdftoppm · cwebp
```

`cwebp` is already installed on the build machine; `pdfimages` is not.

## 1. Export the embedded photographs

```bash
mkdir -p ~/ih-catalogue/raw && cd ~/ih-catalogue
pdfimages -list catalogue.pdf          # page, size and type of every embedded image
pdfimages -png catalogue.pdf raw/img   # writes raw/img-000.png, raw/img-001.png, …
```

`pdfimages` pulls out the original rasters at their stored resolution, without the
page's text. Use `-list` first: a photograph under about 900px wide is too small for a
catalogue tile and needs the original file from the owner instead.

If a page turns out to be one flattened image (a scan, or an export from a design
tool), `pdfimages` returns the whole page. Render it and crop each photograph by hand:

```bash
pdftoppm -r 300 -png -f 2 -l 2 catalogue.pdf raw/page   # page 2 at 300 dpi
```

## 2. Check every image before it leaves the folder

Open each file and reject it, or crop it, if it shows:

- a rate, a "/-" figure, a rupee amount or a rate table — including in a corner;
- a design name set in type over the photograph;
- more than one design, unless it is meant as a group photograph.

Cropped page renders are where rates slip through. Look at the edges.

## 3. Name it

```
public/images/catalogue/<collection>/<slug>-1.webp
```

- `<collection>` is a `CollectionSlug` from `src/content/collections.ts`
  (`bone-china`, `premium-melamine`, `regular-melamine`, `chat-and-snack-plates`,
  `heritage-silver`, `chafing-dishes`, `cutlery-and-serveware`, `glassware`).
- `<slug>` is the item's `slug` in `collectionSeeds` (`rose-gold`, `24kt-blue`, …).
- `-1` is the lead photograph; further views of the same design are `-2`, `-3`.

`cataloguePhotoPath(collection, slug, index)` in `collections.ts` returns this path.

Match a photograph to a design only when the catalogue page itself names it. A guess
goes to the owner through `docs/COPY_TO_CONFIRM.md`, not onto the site.

## 4. Convert to WebP, at most 1200px wide

```bash
cwebp -q 82 -resize 1200 0 raw/img-004.png \
  -o public/images/catalogue/bone-china/rose-gold-1.webp
```

`-resize 1200 0` sets the width and keeps the aspect ratio. Do not enlarge: for a
source narrower than 1200px, leave `-resize` out. Quality 82 matches the existing
tiles (`scripts/normalize-images.py`).

## 5. Put it on the site

Every image entry needs `src`, `alt`, `width`, `height` and `blurDataURL`
(`.claude/rules/content.md`), and today the catalogue reads photographs only through
the generated manifest `src/content/products.ts`. So until a pipeline reads
`public/images/catalogue/` directly (OPEN_ISSUES E10), a new photograph reaches the
site the way the existing ones did — `Docs/Phase3_Assets.md` §6:

1. Put the checked source image in `public/images/Photos/<Category>/`.
2. Add a row to the `KEEP` table in `scripts/normalize-images.py`: source file, slug,
   name and alt text.
3. Run `python3 scripts/normalize-images.py` and then
   `python3 scripts/generate-products-content.py`.
4. Point the item at it: `photo: { category, slug }` on its seed in `collectionSeeds`.

Alt text describes what is in the frame — material, colour, pattern, piece — for
example "Bone china Rose Gold dinner set with copper-toned rim". Write it from the
photograph, not from the design name, and never "image of".

## When there is no photograph

Do nothing. An item with no photograph has `image: null` and the site draws the
branded crown placeholder with "Photograph to follow — ask us for a picture". No stock
or generated image stands in for a design.
