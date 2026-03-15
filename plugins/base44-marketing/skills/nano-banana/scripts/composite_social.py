#!/usr/bin/env python3
"""
Base44 Branded Social Creative Compositor.

Takes a photo (or generates a branded background) and composites it with
Base44 brand elements: logo, typography (STK Miso), colors, and grain texture.

Usage:
    python3 composite_social.py linkedin-post photo.png --headline "Text" -o output.png
    python3 composite_social.py text-card --headline "Text" --bg warm-grain -o output.png
"""

import argparse
import math
import os
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
except ImportError:
    print("Error: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

# ── Brand Colors (from Figma Brand Guidelines) ──────────────────────────────

COLORS = {
    "brand_orange": (255, 99, 31),      # #FF631F - logo, strong accents
    "accent_orange": (255, 152, 59),     # #FF983B - highlights
    "peach": (255, 190, 141),            # #FFBE8D - soft accents
    "green_accent": (230, 252, 136),     # #E6FC88 - CTA buttons
    "light_green": (235, 250, 213),      # #EBFAD5 - soft backgrounds
    "cream": (250, 243, 233),            # #FAF3E9 - warm backgrounds
    "sky_blue": (124, 191, 213),         # #7CBFD5 - professional accents
    "light_blue": (191, 215, 224),       # #BFD7E0 - subtle backgrounds
    "black": (15, 15, 15),              # #0F0F0F - text
    "white": (255, 255, 255),           # #FFFFFF
    "text_body": (35, 37, 41),          # #232529
    "text_secondary": (105, 111, 123),  # #696F7B
}

# ── Template Sizes ───────────────────────────────────────────────────────────

TEMPLATES = {
    "linkedin-post":    (1200, 627),
    "linkedin-square":  (1080, 1080),
    "x-card":           (1200, 675),
    "x-square":         (1080, 1080),
    "story":            (1080, 1920),
    "ad-square":        (1080, 1080),
    "ad-landscape":     (1200, 628),
    "text-card":        (1080, 1080),
    "discord-banner":   (960, 540),
    "hero":             (1920, 1080),
}

# ── Render scale for crisp text ──────────────────────────────────────────────

RENDER_SCALE = 2

# ── Font paths ───────────────────────────────────────────────────────────────

FONT_PATHS = {
    "regular": [
        Path(__file__).parent.parent.parent.parent / "assets" / "fonts" / "STKMiso-Regular.ttf",
        Path.home() / "Library/Fonts/STKMiso-Regular.ttf",
    ],
    "light": [
        Path(__file__).parent.parent.parent.parent / "assets" / "fonts" / "STKMiso-Light.ttf",
        Path.home() / "Library/Fonts/STKMiso-Light.ttf",
    ],
}

# ── Logo SVG (Base44 colored logo - orange mark + black text) ────────────────

LOGO_SVG_COLORED = '''<svg height="{h}" viewBox="0 0 995 238" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M191.288 212.878C191.603 212.878 191.742 213.279 191.49 213.471C171.439 228.855 146.348 238 119.121 238C91.8942 238 66.8029 228.857 46.7514 213.471C46.5002 213.279 46.639 212.878 46.9542 212.878H191.288ZM222.329 178.28C218.173 185.501 213.278 192.245 207.754 198.408C207.544 198.642 207.245 198.774 206.932 198.774H31.3123C30.9994 198.774 30.6997 198.642 30.4903 198.408C24.9634 192.245 20.0712 185.501 15.915 178.28C15.7454 177.987 15.9591 177.619 16.2985 177.619H221.945C222.285 177.619 222.499 177.987 222.329 178.28ZM235.767 142.668C234.352 149.674 232.323 156.456 229.738 162.96C229.603 163.295 229.277 163.515 228.916 163.515H9.32599C8.96459 163.515 8.63844 163.295 8.50401 162.96C5.91907 156.459 3.88947 149.676 2.47469 142.668C2.4196 142.395 2.62895 142.139 2.90882 142.139H235.333C235.611 142.139 235.822 142.395 235.767 142.668ZM118.317 0.00265287C184.408 -0.43368 238.121 53.0104 238.121 119C238.121 121.9 238.017 124.776 237.814 127.625C237.799 127.857 237.605 128.035 237.374 128.035H0.870397C0.639009 128.035 0.445084 127.857 0.429658 127.625C0.226917 124.814 0.123343 121.973 0.12114 119.108C0.0638435 54.3613 53.5719 0.432374 118.317 0.00265287Z" fill="#FF631F"/>
<path d="M309.165 47.0674H374.508C405.556 47.0674 420.464 61.3951 420.464 84.1342C420.464 99.0797 412.287 109.938 400.863 115.047C414.965 119.134 426.389 130.206 426.389 148.407C426.389 174.401 408.424 189.157 374.508 189.157H309.165V47.0674ZM367.161 70.6143H338.364V105.828H367.161C382.874 105.828 390.648 101.123 390.648 88.221C390.648 75.3189 382.898 70.6143 367.161 70.6143ZM371.664 128.139H338.388V165.61H371.664C387.804 165.61 396.573 160.501 396.573 146.981C396.573 133.461 387.78 128.139 371.664 128.139Z" fill="black"/>
<path d="M504.105 188.906V173.067C496.706 185.04 482.72 190.933 466.873 190.933C447.135 190.933 431.717 180.374 431.717 161.282C431.717 143.416 445.297 133.258 465.226 129.793L502.243 123.5V121.072C502.243 110.112 494.009 105.233 482.291 105.233C469.951 105.233 463.985 110.725 463.173 119.257H435.416C436.443 97.7382 453.722 86.1419 482.314 86.1419C513.771 86.1419 529.403 98.9403 529.403 125.739V188.906H504.105ZM502.267 147.07V142.403L474.51 147.282C463.412 149.12 458.257 152.349 458.257 160.08C458.257 166.774 464.223 171.04 474.51 171.04C487.875 171.04 502.267 162.508 502.267 147.07Z" fill="black"/>
<path d="M584.748 86.1419C609.198 86.1419 630.195 96.4867 630.597 118.637H603.286C602.672 111.12 595.956 105.229 583.921 105.229C574.131 105.229 567.203 109.282 567.203 115.385C567.203 121.489 571.885 123.303 580.657 124.929L603.688 129.406C622.038 132.847 632.418 142.202 632.418 158.438C632.418 178.137 616.315 190.933 586.569 190.933C556.822 190.933 539.301 177.737 538.284 156.411H566.801C567.605 164.941 574.131 171.846 587.586 171.846C600.023 171.846 605.911 167.18 605.911 161.289C605.911 155.398 601.229 152.971 592.457 151.345L569.426 147.079C551.1 143.639 540.696 134.095 540.696 117.836C540.696 98.3483 558.43 86.1655 584.701 86.1655L584.748 86.1419Z" fill="black"/>
<path d="M688.897 86.1419C721.451 86.1419 740.761 105.441 740.761 137.913V146.655H663.874C664.488 159.05 673.836 170.62 688.685 170.62C699.473 170.62 708.42 165.342 710.851 156.411H739.321C734.86 178.75 714.699 190.933 688.661 190.933C658.562 190.933 635.97 172.246 635.97 138.549C635.97 107.067 656.508 86.1655 688.85 86.1655L688.897 86.1419ZM712.882 127.969C712.268 114.985 702.093 105.63 689.487 105.63C675.654 105.63 665.691 115.974 664.063 127.969H712.882Z" fill="black"/>
<path d="M841.036 189.157V159.67H770.955V135.909L835.534 47.0674H868.642V189.157H841.036ZM841.036 77.5762L798.94 136.55H841.036V77.5762Z" fill="black"/>
<path d="M949.638 159.651H879.298V135.894L944.092 47.0674H977.322V136.535H994.746V159.675H977.322V189.157H949.638V159.651ZM949.638 77.5711L907.387 136.535H949.638V77.5711Z" fill="black"/>
</svg>'''

LOGO_SVG_WHITE = LOGO_SVG_COLORED.replace('fill="black"', 'fill="white"').replace('fill="#FF631F"', 'fill="white"')


def get_font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    """Load STK Miso font at scaled size."""
    scaled = size * RENDER_SCALE
    for path in FONT_PATHS.get(weight, FONT_PATHS["regular"]):
        if path.exists():
            try:
                return ImageFont.truetype(str(path), scaled)
            except Exception:
                continue
    # No fallback — STK Miso is the ONLY allowed font (Principle 6: STK Miso only)
    raise FileNotFoundError("STK Miso font not found. Install STKMiso-Light.ttf and STKMiso-Regular.ttf to assets/fonts/ or ~/Library/Fonts/. No other fonts are allowed (Principle 6: STK Miso only).")


def render_logo(variant: str = "colored", height: int = 40) -> Image.Image:
    """Render Base44 logo SVG to PIL Image."""
    scaled_h = height * RENDER_SCALE
    svg = LOGO_SVG_COLORED if variant == "colored" else LOGO_SVG_WHITE
    svg_data = svg.format(h=scaled_h).encode("utf-8")

    try:
        import cairosvg
        import io
        png_data = cairosvg.svg2png(bytestring=svg_data)
        return Image.open(io.BytesIO(png_data)).convert("RGBA")
    except ImportError:
        # Fallback: try loading pre-rendered logo PNG
        logo_path = Path(__file__).parent.parent.parent.parent / "assets" / "images" / "logo.png"
        if logo_path.exists():
            logo = Image.open(logo_path).convert("RGBA")
            aspect = logo.width / logo.height
            return logo.resize((int(scaled_h * aspect), scaled_h), Image.Resampling.LANCZOS)
        print("Warning: cairosvg not installed and no logo.png found. Logo will be skipped.")
        return None


def generate_gradient_bg(width: int, height: int, style: str = "cream") -> Image.Image:
    """Generate a brand-colored gradient background."""
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img)

    if style == "cream":
        # Solid cream
        img = Image.new("RGB", (width, height), COLORS["cream"])

    elif style == "white":
        img = Image.new("RGB", (width, height), COLORS["white"])

    elif style == "black":
        # Principle 6: no black backgrounds: No black backgrounds. Fallback to cream.
        print("WARNING: Black backgrounds are banned (Principle 6: no black backgrounds). Using cream instead.")
        img = Image.new("RGB", (width, height), COLORS["cream"])

    elif style == "warm-grain":
        # Warm gradient: cream to light peach
        for y in range(height):
            ratio = y / height
            r = int(250 + (255 - 250) * ratio)
            g = int(243 - (243 - 190) * ratio * 0.3)
            b = int(233 - (233 - 141) * ratio * 0.5)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

    elif style == "orange-sunset":
        # Orange gradient: top cream, bottom deep orange
        for y in range(height):
            ratio = y / height
            r = int(255)
            g = int(245 - (245 - 99) * ratio)
            b = int(244 - (244 - 31) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

    elif style == "plan-mode":
        # Peach to lavender
        for y in range(height):
            ratio = y / height
            if ratio < 0.5:
                # Top: warm peach
                t = ratio * 2
                r = int(255 - (255 - 220) * t)
                g = int(196 - (196 - 170) * t)
                b = int(148 + (200 - 148) * t)
            else:
                # Bottom: lavender to orange
                t = (ratio - 0.5) * 2
                r = int(220 + (255 - 220) * t)
                g = int(170 - (170 - 120) * t)
                b = int(200 - (200 - 60) * t)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

    elif style == "bold-orange":
        # Deep warm orange
        for y in range(height):
            ratio = y / height
            r = 255
            g = int(140 + (180 - 140) * math.sin(ratio * math.pi))
            b = int(50 + (90 - 50) * math.sin(ratio * math.pi))
            draw.line([(0, y), (width, y)], fill=(r, g, b))

    elif style == "pastel":
        # Soft pastel: pink/purple to light
        for y in range(height):
            ratio = y / height
            r = int(240 - (240 - 220) * ratio)
            g = int(200 + (240 - 200) * ratio)
            b = int(230 + (245 - 230) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

    elif style == "blue-waves":
        # Cool blue gradient
        for y in range(height):
            ratio = y / height
            r = int(124 + (191 - 124) * ratio)
            g = int(191 + (215 - 191) * ratio)
            b = int(213 + (224 - 213) * ratio)
            draw.line([(0, y), (width, y)], fill=(r, g, b))

    else:
        # Default: white
        img = Image.new("RGB", (width, height), COLORS["white"])

    return img


def add_grain(img: Image.Image, opacity: float = 0.08) -> Image.Image:
    """Add subtle grain texture overlay."""
    import random
    grain = Image.new("L", img.size)
    pixels = grain.load()
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            pixels[x, y] = random.randint(0, 255)

    grain = grain.filter(ImageFilter.GaussianBlur(radius=0.5))
    grain_rgba = Image.new("RGBA", img.size, (128, 128, 128, int(255 * opacity)))

    img_rgba = img.convert("RGBA")
    result = Image.alpha_composite(img_rgba, grain_rgba)
    return result.convert("RGB")


def wrap_text(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list:
    """Word-wrap text to fit within max_width."""
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = font.getbbox(test)
        if bbox[2] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def composite_social(
    template: str,
    image_path: str = None,
    headline: str = "",
    subtext: str = "",
    cta: str = "",
    bg_style: str = "cream",
    logo_variant: str = "colored",
    logo_position: str = "top-left",
    bg_tint: str = None,
    output_path: str = None,
    grain: bool = False,
) -> str:
    """
    Composite a branded social creative.

    Args:
        template: Template name (linkedin-post, x-card, text-card, etc.)
        image_path: Path to base photo (optional for text-card)
        headline: Main headline text
        subtext: Supporting text
        cta: Call-to-action text (optional)
        bg_style: Background style name
        logo_variant: "colored" or "white"
        logo_position: "top-left", "top-right", "bottom-left", "bottom-right"
        bg_tint: Optional color tint ("orange", "blue", "cream")
        output_path: Where to save
        grain: Add grain texture overlay
    """
    if template not in TEMPLATES:
        raise ValueError(f"Unknown template: {template}. Available: {', '.join(TEMPLATES.keys())}")

    orig_w, orig_h = TEMPLATES[template]
    w = orig_w * RENDER_SCALE
    h = orig_h * RENDER_SCALE

    # ── Layer 1: Background ──────────────────────────────────────────────
    if image_path and Path(image_path).exists():
        bg = Image.open(image_path).convert("RGB")
        bg = bg.resize((w, h), Image.Resampling.LANCZOS)
    else:
        bg = generate_gradient_bg(w, h, bg_style)

    canvas = bg.copy()

    # ── Layer 2: Background tint ─────────────────────────────────────────
    if bg_tint:
        tint_colors = {
            "orange": (*COLORS["brand_orange"], 60),
            "blue": (*COLORS["sky_blue"], 60),
            "cream": (*COLORS["cream"], 80),
            "peach": (*COLORS["peach"], 70),
        }
        if bg_tint in tint_colors:
            tint = Image.new("RGBA", (w, h), tint_colors[bg_tint])
            canvas = Image.alpha_composite(canvas.convert("RGBA"), tint).convert("RGB")

    # ── Layer 3: Gradient fade for text readability ──────────────────────
    if image_path and (headline or subtext):
        fade = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        fade_draw = ImageDraw.Draw(fade)
        # Bottom gradient: dark fade for text
        for y in range(h // 2, h):
            alpha = int(180 * ((y - h // 2) / (h // 2)))
            fade_draw.line([(0, y), (w, y)], fill=(0, 0, 0, alpha))
        canvas = Image.alpha_composite(canvas.convert("RGBA"), fade).convert("RGB")

    # ── Layer 4: Grain texture ───────────────────────────────────────────
    if grain:
        canvas = add_grain(canvas, opacity=0.06)

    # Convert to RGBA for compositing
    canvas = canvas.convert("RGBA")

    # ── Layer 5: Logo ────────────────────────────────────────────────────
    logo_img = render_logo(logo_variant, height=36)
    if logo_img:
        margin = 48 * RENDER_SCALE
        lw, lh = logo_img.size
        positions = {
            "top-left": (margin, margin),
            "top-right": (w - lw - margin, margin),
            "bottom-left": (margin, h - lh - margin),
            "bottom-right": (w - lw - margin, h - lh - margin),
        }
        pos = positions.get(logo_position, positions["top-left"])
        canvas.paste(logo_img, pos, logo_img)

    # ── Layer 6: Text ────────────────────────────────────────────────────
    draw = ImageDraw.Draw(canvas)
    text_margin = 60 * RENDER_SCALE
    max_text_width = w - (text_margin * 2)

    # Determine text color based on background
    dark_bgs = ["bold-orange", "orange-sunset"]  # "black" removed per Principle 6: no black backgrounds
    has_photo = image_path and Path(image_path).exists()
    text_color = COLORS["white"] if (bg_style in dark_bgs or has_photo) else COLORS["black"]
    subtext_color = (*text_color[:3], 200) if has_photo else (*COLORS["text_body"], 255)

    if headline:
        # Size headlines based on template
        headline_size = 48 if template in ["text-card", "linkedin-square", "ad-square", "x-square"] else 40
        font_headline = get_font("regular", headline_size)
        lines = wrap_text(headline, font_headline, max_text_width)

        # Position: bottom area if photo, center if text-card
        if template == "text-card" and not has_photo:
            y_start = h // 2 - (len(lines) * headline_size * RENDER_SCALE) // 2
        else:
            y_start = h - text_margin - (len(lines) + 1) * (headline_size + 8) * RENDER_SCALE
            if subtext:
                y_start -= 40 * RENDER_SCALE
            if cta:
                y_start -= 60 * RENDER_SCALE

        for i, line in enumerate(lines):
            y = y_start + i * (headline_size + 8) * RENDER_SCALE
            # Shadow for readability
            if has_photo:
                draw.text((text_margin + 3, y + 3), line, font=font_headline, fill=(0, 0, 0, 120))
            draw.text((text_margin, y), line, font=font_headline, fill=text_color + (255,))

        # Subtext below headline
        if subtext:
            font_sub = get_font("light", 24)
            sub_lines = wrap_text(subtext, font_sub, max_text_width)
            sub_y = y_start + len(lines) * (headline_size + 8) * RENDER_SCALE + 16 * RENDER_SCALE
            for i, line in enumerate(sub_lines):
                sy = sub_y + i * 32 * RENDER_SCALE
                if has_photo:
                    draw.text((text_margin + 2, sy + 2), line, font=font_sub, fill=(0, 0, 0, 100))
                draw.text((text_margin, sy), line, font=font_sub, fill=subtext_color)

    # ── Layer 7: CTA button ──────────────────────────────────────────────
    if cta:
        font_cta = get_font("regular", 20)
        cta_bbox = font_cta.getbbox(cta)
        cta_w = cta_bbox[2] + 48 * RENDER_SCALE
        cta_h = 52 * RENDER_SCALE
        cta_x = text_margin
        cta_y = h - text_margin - cta_h

        # Black pill button
        draw.rounded_rectangle(
            [cta_x, cta_y, cta_x + cta_w, cta_y + cta_h],
            radius=300,
            fill=COLORS["black"] + (255,),
        )
        draw.text(
            (cta_x + 24 * RENDER_SCALE, cta_y + cta_h // 2),
            cta,
            font=font_cta,
            fill=COLORS["white"] + (255,),
            anchor="lm",
        )

    # ── Downscale and save ───────────────────────────────────────────────
    result = canvas.resize((orig_w, orig_h), Image.Resampling.LANCZOS)
    result = result.convert("RGB")

    if not output_path:
        output_path = f"creative-{template}.png"

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    result.save(str(output_path), quality=95)
    print(f"Saved: {output_path} ({orig_w}x{orig_h})")
    return str(output_path)


def main():
    parser = argparse.ArgumentParser(description="Base44 Branded Social Creative Compositor")
    parser.add_argument("template", choices=list(TEMPLATES.keys()), help="Template name")
    parser.add_argument("image", nargs="?", default=None, help="Source image path (optional for text-card)")
    parser.add_argument("--headline", default="", help="Main headline text")
    parser.add_argument("--subtext", default="", help="Supporting text")
    parser.add_argument("--cta", default="", help="Call-to-action button text")
    parser.add_argument("--bg", default="cream", help="Background style",
                        choices=["warm-grain", "orange-sunset", "plan-mode", "bold-orange",
                                 "pastel", "blue-waves", "white", "black", "cream"])
    parser.add_argument("--logo", default="colored", choices=["colored", "white"], help="Logo variant")
    parser.add_argument("--logo-position", default="top-left",
                        choices=["top-left", "top-right", "bottom-left", "bottom-right"])
    parser.add_argument("--bg-tint", choices=["orange", "blue", "cream", "peach"], help="Color tint overlay")
    parser.add_argument("--grain", action="store_true", help="Add grain texture")
    parser.add_argument("-o", "--output", help="Output path")

    args = parser.parse_args()

    composite_social(
        template=args.template,
        image_path=args.image,
        headline=args.headline,
        subtext=args.subtext,
        cta=args.cta,
        bg_style=args.bg,
        logo_variant=args.logo,
        logo_position=args.logo_position,
        bg_tint=args.bg_tint,
        output_path=args.output,
        grain=args.grain,
    )


if __name__ == "__main__":
    main()
