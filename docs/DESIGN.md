# Juicy — Style Reference
> Warm Editorial Canvas

**Theme:** light

Juicy evokes a warm, editorial luxury fashion experience through a cream and sand palette with terracotta accents. Sun-soaked neutrals define the background; bold display typography creates editorial tension. Components are open and airy, allowing product photography to dominate. The overall feel is Jacquemus-inspired: premium but playful, minimal but expressive, never cold.

---

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Chalk | `#faf7f2` | `--color-chalk` | Primary page background — warm off-white, never pure white |
| Cream | `#f5efe6` | `--color-cream` | Section backgrounds, card fills — slightly deeper warm tone |
| Sand | `#c9b99a` | `--color-sand` | Borders, dividers, secondary text, muted UI elements |
| Dust | `#8c7b6b` | `--color-dust` | Body text, caption text, placeholder text |
| Soil | `#3d2e22` | `--color-soil` | Primary text, headlines, dark accents — deep warm brown |
| Terracotta | `#b5633a` | `--color-terracotta` | Primary accent — CTAs, badges, active states, hover highlights |
| Terracotta Light | `#e8c4b0` | `--color-terracotta-light` | Soft accent fills, tag backgrounds |

---

## Tokens — Typography

### Playfair Display — Display and section headlines · `--font-playfair`
- **Substitute:** Georgia (serif fallback)
- **Weights:** 400, 700
- **Sizes:** 14px, 32px, 48px, 72px, 96px, 140px
- **Line height:** 0.85 at 140px, 0.90 at 96px, 1.00 at 72px, 1.10 at 48px, 1.20 at 32px
- **Letter spacing:** -0.04em at 140px, -0.03em at 96px, -0.02em at 72px, -0.01em at 48px, 0em at 32px
- **Role:** Editorial headlines, hero text, section titles. The mix of weight 400 (elegant) and 700 (impact) creates tonal range.

### DM Sans — Body text, UI, navigation, buttons · `--font-dm-sans`
- **Substitute:** Inter
- **Weights:** 400, 500, 600
- **Sizes:** 11px, 12px, 13px, 14px, 15px, 16px
- **Line height:** 1.30, 1.40, 1.50
- **Letter spacing:** 0.02em at 11px (uppercase labels), 0em at 12–16px, -0.01em at 15–16px
- **Role:** All UI text. 500 weight for navigation and buttons; 400 for body; 600 for emphasis.

### Type Scale

| Role | Font | Size | Weight | Line Height | Letter Spacing | Token |
|------|------|------|--------|-------------|----------------|-------|
| label-xs | DM Sans | 11px | 600 | 1.3 | 0.08em | `--text-label-xs` |
| caption | DM Sans | 12px | 400 | 1.3 | 0em | `--text-caption` |
| body-sm | DM Sans | 13px | 400 | 1.4 | 0em | `--text-body-sm` |
| body | DM Sans | 14px | 400 | 1.5 | 0em | `--text-body` |
| body-lg | DM Sans | 15px | 500 | 1.4 | -0.01em | `--text-body-lg` |
| ui | DM Sans | 14px | 500 | 1.3 | 0em | `--text-ui` |
| heading-xs | Playfair | 32px | 400 | 1.2 | 0em | `--text-heading-xs` |
| heading-sm | Playfair | 48px | 400 | 1.1 | -0.01em | `--text-heading-sm` |
| heading | Playfair | 72px | 400 | 1.0 | -0.02em | `--text-heading` |
| display | Playfair | 96px | 700 | 0.9 | -0.03em | `--text-display` |
| hero | Playfair | 140px | 700 | 0.85 | -0.04em | `--text-hero` |

---

## Tokens — Spacing & Shapes

**Density:** open / airy

### Border Radius

| Element | Value |
|---------|-------|
| cards, images | 0px — sharp, editorial |
| buttons | 2px — almost sharp |
| badges, tags | 2px |
| inputs | 4px |

### Layout

- **Section gap:** 80–120px (generous vertical breathing room)
- **Content max-width:** 1400px
- **Card padding:** 20–32px
- **Element gap:** 8–24px
- **Grid gutter:** 16–24px

---

## Components

### Primary Button (Filled Terracotta)
**Role:** Main CTA — Add to Cart, Checkout, Submit.

Background Terracotta `#b5633a`, text Chalk `#faf7f2`, 2px border-radius. DM Sans weight 500, 14px, letter-spacing 0em. Padding 14px vertical, 28px horizontal. On hover: background darkens to `#9a5230`. No shadow.

### Ghost Button (Outlined)
**Role:** Secondary action — View Details, Back, Cancel.

Border 1.5px Soil `#3d2e22`, text Soil `#3d2e22`, transparent background, 2px border-radius. Same type spec as Primary. On hover: background Cream `#f5efe6`.

### Sand Button (Muted)
**Role:** Tertiary action — Filter, Sort, breadcrumb actions.

Background Sand `#c9b99a`, text Soil `#3d2e22`, 2px border-radius. Lighter visual weight.

### Product Card
**Role:** Grid display of product with image, name, price.

No border, no shadow, 0px border-radius on image. Card background transparent. Image full-width, aspect-ratio 3/4 (portrait). Below image: product name in DM Sans 500 14px Soil, price in DM Sans 400 13px Dust, compare_at_price in DM Sans 400 12px Sand with strikethrough. On hover: image scales subtly `scale(1.03)` over 400ms.

### Variant Selector (Size)
**Role:** Size picker on PDP.

Outlined square pills — 40×40px, border 1px Sand, 2px radius. Selected state: border Terracotta, background Terracotta Light. Out-of-stock: Sand text, Sand border, diagonal strikethrough line overlay.

### Variant Selector (Color)
**Role:** Color swatch picker on PDP.

Circular swatches 24px diameter using `color_hex` value. Selected: 2px Soil ring offset 2px. On hover: ring offset.

### Review Card
**Role:** Customer review display on PDP.

No border, no shadow, 0px radius. Background transparent on Chalk page. Star rating in Terracotta. Reviewer name DM Sans 500 13px Soil. Review body DM Sans 400 14px Dust. Date DM Sans 400 12px Sand.

### Badge / Tag
**Role:** Product tags (new-arrival, bestseller, sale).

DM Sans 600 11px uppercase, letter-spacing 0.08em. 2px radius. Background Terracotta Light `#e8c4b0`, text Terracotta `#b5633a`. For Sale badge: background Terracotta `#b5633a`, text Chalk.

---

## Centralized Motion System (GSAP & Lenis)

Juicy uses GSAP and Lenis for a fluid editorial scroll experience. All scroll-linked animations are centralized in `JuicyMotion` (located in `src/lib/animations.ts`).

### Key Motion Guidelines

- **Smooth Scroll:** Lenis synced with GSAP ticker (`gsap.ticker.add`).
- **Scrub Inertia:** All scroll-linked animations use `scrub: 1.2` — fluid but snappier than Elysium; fashion sites move with intention.
- **Hero Reveal (`JuicyMotion.heroReveal`):** Full-bleed image fades in with headline words staggered upward `y: 60 → 0`, `opacity: 0 → 1`, stagger 0.08s, ease `power3.out`.
- **Editorial Image Drift (`JuicyMotion.imageDrift`):** Large editorial images drift slowly on scroll (`yPercent: -8` parallax) — `will-change: transform` on these elements.
- **Section Fade-Up (`JuicyMotion.fadeUp`):** Standard section entry — `y: 40 → 0`, `opacity: 0 → 1`, `duration: 0.8`, `ease: power2.out`, triggered when element enters viewport.
- **Product Grid Stagger (`JuicyMotion.gridStagger`):** Product cards reveal with stagger 0.06s — feels like items dropping into place.
- **prefers-reduced-motion:** All animations wrap a `window.matchMedia('(prefers-reduced-motion: reduce)')` check — if true, skip transforms, only opacity.

---

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Chalk | `#faf7f2` | Primary page background |
| 1 | Cream | `#f5efe6` | Card fills, alternate section backgrounds |
| 2 | Terracotta Light | `#e8c4b0` | Highlight fills, tag backgrounds |

---

## Imagery

Photography is editorial and sun-drenched — warm tones, natural light, outdoor or studio settings with soft shadows. Product shots are clean: 3/4 portrait ratio on Chalk or Cream background. Campaign imagery is full-bleed and asymmetric. No dark, moody photography — this is warm, aspirational, and airy.

---

## Layout

Full-bleed hero sections with large typographic headlines overlaying imagery. Product grids use 2-col (mobile), 3-col (tablet), 4-col (desktop). Generous section padding (80–120px). Asymmetric editorial compositions for non-product sections (text left, image right at irregular scale). Navigation is fixed-top: logo centered, links left, cart/auth icons right. Footer is minimal — links only, no heavy graphical treatment.

---

## Do's and Don'ts

### Do
- Use Playfair Display weight 400 for editorial headlines — it reads as refined, not loud.
- Use Terracotta sparingly — primary CTAs and active states only.
- Allow white (Chalk) space to breathe — padding is generous by design.
- Stack product image and info with 0px gap — image and text belong together as a single editorial unit.
- Use Sand `#c9b99a` for all muted/secondary elements (borders, disabled states, secondary text).

### Don't
- Never use pure white `#ffffff` or pure black `#000000` — always use Chalk and Soil.
- Avoid rounded corners > 4px — sharpness is the brand.
- Do not add box shadows to product cards — flat is the intent.
- Avoid more than 2 weights of Playfair Display on the same page section.
- Do not use Terracotta as a background color for large areas — accent only.

---

## Agent Prompt Guide

Quick Color Reference: text: #3d2e22, background: #faf7f2, border: #c9b99a, accent: #b5633a, secondary-bg: #f5efe6

Example Component Prompts:
Create a hero section: full-bleed background image with Chalk `#faf7f2` text overlay. Headline 'NEW ARRIVALS' using Playfair Display weight 700, 140px, letter-spacing -0.04em, color `#faf7f2`, line-height 0.85.
Create a Primary Button: background `#b5633a`, text `#faf7f2`, 2px border-radius, DM Sans 500 14px, padding 14px 28px. Hover: background `#9a5230`.
Create a Product Card: transparent background, 0px border-radius image, aspect-ratio 3/4, name DM Sans 500 14px `#3d2e22`, price DM Sans 400 13px `#8c7b6b`.
Create a Section Headline: 'THIS SEASON' using Playfair Display weight 400, 72px, letter-spacing -0.02em, color `#3d2e22`.
Create a Badge: DM Sans 600, 11px, uppercase, letter-spacing 0.08em, 2px radius, background `#e8c4b0`, text `#b5633a`.

---

## Similar Brands

- **Jacquemus** — Warm beige palette, oversized editorial typography, asymmetric layouts, sun-soaked photography.
- **Nanushka** — Clean editorial grids, warm neutrals, strong product-focused imagery.
- **Sézane** — Warm off-white backgrounds, Parisian editorial energy, mix of serif headlines and clean body type.
- **Staud** — Bold serif headlines on light backgrounds, clean product grids, terracotta and sand palette.

---

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-chalk: #faf7f2;
  --color-cream: #f5efe6;
  --color-sand: #c9b99a;
  --color-dust: #8c7b6b;
  --color-soil: #3d2e22;
  --color-terracotta: #b5633a;
  --color-terracotta-light: #e8c4b0;

  /* Typography */
  --font-playfair: 'Playfair Display', Georgia, serif;
  --font-dm-sans: 'DM Sans', Inter, ui-sans-serif, system-ui, sans-serif;

  /* Type Scale */
  --text-label-xs: 11px;
  --text-caption: 12px;
  --text-body-sm: 13px;
  --text-body: 14px;
  --text-body-lg: 15px;
  --text-ui: 14px;
  --text-heading-xs: 32px;
  --text-heading-sm: 48px;
  --text-heading: 72px;
  --text-display: 96px;
  --text-hero: 140px;

  /* Layout */
  --section-gap: 100px;
  --content-max-width: 1400px;

  /* Border Radius */
  --radius-btn: 2px;
  --radius-input: 4px;
  --radius-badge: 2px;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-chalk: #faf7f2;
  --color-cream: #f5efe6;
  --color-sand: #c9b99a;
  --color-dust: #8c7b6b;
  --color-soil: #3d2e22;
  --color-terracotta: #b5633a;
  --color-terracotta-light: #e8c4b0;

  /* Typography */
  --font-playfair: 'Playfair Display', Georgia, serif;
  --font-dm-sans: 'DM Sans', Inter, ui-sans-serif, system-ui, sans-serif;

  /* Type Scale */
  --text-label-xs: 11px;
  --text-caption: 12px;
  --text-body-sm: 13px;
  --text-body: 14px;
  --text-body-lg: 15px;
  --text-heading-xs: 32px;
  --text-heading-sm: 48px;
  --text-heading: 72px;
  --text-display: 96px;
  --text-hero: 140px;

  /* Border Radius */
  --radius-btn: 2px;
  --radius-input: 4px;
  --radius-badge: 2px;
}
```
