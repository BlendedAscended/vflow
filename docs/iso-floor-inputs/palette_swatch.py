#!/usr/bin/env python3
"""Generate palette-swatch.png for iso-floor Stage 1 (Stitch Kinetic Obsidian dark palette)."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

SWATCHES = [
    ("#0f131e", "navy",  "base bg"),
    ("#171b27", "floor", "card / floor"),
    ("#4fdbc8", "teal",  "primary"),
    ("#71f8e4", "glow",  "hot accent"),
    ("#A5D6A7", "mint",  "brand"),
    ("#dfe2f2", "line",  "text / stroke"),
]
W, H = 1024, 256
BLOCK_W = W // len(SWATCHES)
OUT = Path(__file__).parent / "palette-swatch.png"


def luminance(h: str) -> float:
    r, g, b = (int(h[i:i + 2], 16) for i in (1, 3, 5))
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255


def label_color(h: str) -> str:
    return "#000000" if luminance(h) > 0.5 else "#ffffff"


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for p in (
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ):
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main() -> None:
    img = Image.new("RGB", (W, H), "#000000")
    draw = ImageDraw.Draw(img)
    font_hex, font_name, font_role = load_font(22), load_font(16), load_font(13)
    for i, (hex_code, name, role) in enumerate(SWATCHES):
        x0, x1 = i * BLOCK_W, (i + 1) * BLOCK_W
        draw.rectangle([x0, 0, x1, H], fill=hex_code)
        c = label_color(hex_code)
        draw.text((x0 + 16, H - 86), hex_code, fill=c, font=font_hex)
        draw.text((x0 + 16, H - 56), name.upper(), fill=c, font=font_name)
        draw.text((x0 + 16, H - 32), role, fill=c, font=font_role)
    img.save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
