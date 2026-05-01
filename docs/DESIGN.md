# Juicy — Frontend Design System

> **Aesthetic direction**: Editorial Luxury Fashion — inspired by Net-a-Porter, SSENSE, and Zara editorial.
> Every section, page, and component MUST follow these conventions to keep the storefront visually cohesive.

---

## 1. Design Tokens

### 1.1 Color Palette

Three layers: **champagne gold** (primary), **zinc neutrals** (secondary/muted), and **semantic aliases**. All defined in `client/src/index.css` using OKLCH.

**Core palette:**

| Role              | Light mode                       | Dark mode                        | Tailwind class        |
| ----------------- | -------------------------------- | -------------------------------- | --------------------- |
| **Primary (gold)**| `oklch(0.75 0.07 85)`           | `oklch(0.78 0.08 85)`           | `text-primary`, `bg-primary` |
| Primary fg        | `oklch(0.16 0.02 85)`           | `oklch(0.16 0.02 85)`           | `text-primary-foreground` |
| Background        | `oklch(0.995 0 0)` (near-white) | `oklch(0.141 0.005 286)` (zinc-950) | `bg-background`       |
| Foreground        | `oklch(0.141 0.005 286)` (zinc-950) | `oklch(0.985 0 0)` (near-white)  | `text-foreground`     |
| Muted             | `oklch(0.967 0.001 286)` (zinc-100) | `oklch(0.274 0.006 286)` (zinc-800) | `bg-muted`, `text-muted-foreground` |
| Border            | `oklch(0.92 0.004 286)` (zinc-200) | `oklch(1 0 0 / 10%)`            | `border-border`       |
| Ring (focus)      | gold at 40% alpha                | gold at 40% alpha                | `ring-ring`           |

**Gold convenience tokens** (alias to `--primary` for legacy/custom usage):

| Token                | Resolves to              | Usage                                          |
| -------------------- | ------------------------ | ---------------------------------------------- |
| `--color-gold`       | `var(--primary)`         | Same as `text-primary` — use sparingly         |
| `--color-gold-muted` | primary at 20% alpha     | Borders, hover states, diamond decorations     |
| `--color-gold-subtle`| primary at 8% alpha      | Radial glow backgrounds, icon container fills  |

**Rules:**
- **Prefer semantic Tailwind classes**: `text-primary` over `text-[var(--color-gold)]`. They're the same color now.
- Use `--color-gold-muted` and `--color-gold-subtle` only when you need specific alpha variants not covered by Tailwind's opacity modifier (e.g. `bg-primary/20` works too).
- For all neutral colors, use shadcn semantic tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, etc.
- NEVER use manual `dark:` overrides — the semantic tokens handle dark mode automatically.
- NEVER use raw hex/rgb values. Always use a token or Tailwind class.

### 1.2 Typography

| Font                      | Tailwind class   | Usage                                          |
| ------------------------- | ---------------- | ---------------------------------------------- |
| Geist Variable            | `font-sans`      | Body text, descriptions, UI copy               |
| Space Grotesk Variable    | `font-heading`   | Headlines, section titles, oversized indices    |

**Rules:**
- Section headings always use `font-heading` with tight tracking (`tracking-tight`).
- Micro-labels (category tags, counters) use `font-mono` at `text-[9px]` or `text-[10px]` with `tracking-[0.3em]` to `tracking-[0.4em]`.
- NEVER use system fonts, Arial, Roboto, or Inter.

### 1.3 Spacing & Layout

- Sections use generous vertical padding: `py-20 md:py-24` minimum, up to `py-28 md:py-40` for dramatic sections.
- Content is constrained to `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.
- Prefer `gap-*` over manual margins between siblings. NEVER use `space-x-*` or `space-y-*`.

---

## 2. Design Patterns

### 2.1 Section Anatomy

Every major storefront section follows this structural pattern:

```tsx
<section
  data-section="section-name"          // GSAP ScrollTrigger targeting
  className="relative ... overflow-hidden"
>
  {/* Optional: background layer (image, gradient, grain) */}
  {/* Optional: decorative overlays */}
  
  <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Section header */}
    <div className="gsap-reveal">
      {/* Diamond marker + micro-label + heading */}
    </div>
    
    {/* Section content */}
    <div className="gsap-stagger-item">
      {/* Cards, grids, product lists */}
    </div>
  </div>
</section>
```

### 2.2 Section Headers — Editorial Style

Every section header follows a consistent editorial pattern:

```tsx
{/* Option A: With oversized index number */}
<div className="flex items-start gap-6">
  <span className="text-7xl md:text-[6.5rem] font-heading font-extralight text-foreground/[0.06] leading-none select-none hidden md:block">
    01
  </span>
  <div className="flex flex-col gap-2 md:pt-4">
    <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono flex items-center gap-2.5">
      <span className="size-1 rotate-45 bg-[var(--color-gold)]" />
      Section Label
    </span>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-heading leading-none">
      Section Title
    </h2>
  </div>
</div>

{/* Option B: Minimal with line accent */}
<div className="flex items-center gap-4 mb-8">
  <Separator className="w-10 bg-[var(--color-gold)] h-px" />
  <span className="text-[9px] font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase font-mono">
    Label Text
  </span>
</div>
```

**Key conventions:**
- Use `◆` diamond markers (as rotated squares: `size-1 rotate-45 bg-[var(--color-gold)]`) before labels.
- Oversized ghost index numbers (`01`, `02`...) at `text-foreground/[0.06]` provide editorial depth.
- Headings with dramatic scale contrast (e.g. `9px` label next to `text-8xl` heading).

### 2.3 Decorative Gold Accent Lines

Use the shadcn `<Separator />` component for ALL decorative lines — never raw `<div>` or `<hr>` elements.

```tsx
// Gold gradient separator (most common — used between sections)
<Separator className="bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />

// Solid gold line (used inside content areas)
<Separator className="w-10 bg-[var(--color-gold)] h-px" />

// Muted line (used as subtle dividers)
<Separator className="bg-white/[0.06] h-px" />
```

### 2.4 Dark Sections (Inverted)

For high-contrast visual breaks, use the foreground color as background:

```tsx
<section className="relative bg-foreground overflow-hidden">
  <div className="absolute inset-0 bg-grain" />    {/* Noise texture overlay */}
  
  {/* Gold accent borders top/bottom */}
  <Separator className="absolute top-0 left-0 right-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
  <Separator className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent h-px" />
  
  <div className="relative z-10">
    <p className="text-background">Inverted text</p>
    <p className="text-background/40">Muted inverted text</p>
  </div>
</section>
```

### 2.5 Cinematic Image Sections

For full-bleed image backgrounds (Featured, New Arrivals, Newsletter):

```tsx
<section className="relative min-h-[700px] md:min-h-[850px] overflow-hidden bg-black">
  {/* Background image */}
  <div className="absolute inset-0">
    <img src={imageUrl} className="size-full object-cover" />
    {/* Dual gradient overlay for depth */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/60" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
  </div>
  
  {/* Content at z-10 */}
  <div className="relative z-10 container ...">
    {/* Gold text on dark: text-[var(--color-gold)] */}
    {/* Body text on dark: text-white/40 */}
    {/* Muted text on dark: text-white/20 to text-white/30 */}
  </div>
</section>
```

### 2.6 Frosted Glass Panels

Used for bottom bars, floating elements on image backgrounds:

```tsx
<div className="backdrop-blur-md bg-white/[0.04]">
  {/* Content */}
</div>
```

### 2.7 Product Card Grid Patterns

**Desktop — Editorial stagger (for Trending/Featured grids):**

```tsx
const STAGGER_OFFSETS = ["mt-0", "mt-12", "mt-4", "mt-16"]

<div className="hidden md:grid grid-cols-4 gap-6 lg:gap-8">
  {products.map((product, i) => (
    <div className={`gsap-stagger-item will-change-transform ${STAGGER_OFFSETS[i] ?? "mt-0"}`}>
      <ProductCard product={product} />
    </div>
  ))}
</div>
```

**Mobile — Horizontal scroll rail:**

```tsx
<div
  className="flex md:hidden gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4"
  style={{ scrollbarWidth: "none" }}
>
  {products.map((product) => (
    <div className="snap-start shrink-0 w-[260px] gsap-stagger-item">
      <ProductCard product={product} />
    </div>
  ))}
</div>
```

### 2.8 Interactive CTA Links

For editorial "Discover →" style links with expanding line micro-interaction:

```tsx
<Link to={url} className="inline-flex items-center gap-3 group">
  <span className="text-[10px] font-bold tracking-[0.3em] text-[var(--color-gold)] uppercase">
    Discover
  </span>
  <Separator className="w-8 bg-[var(--color-gold)] h-px group-hover:w-14 transition-all duration-500" />
  <span className="text-[10px] text-[var(--color-gold)]">→</span>
</Link>
```

### 2.9 Luxury Buttons

The `Button` component has a dedicated `variant="luxury"` for gold-accented CTAs. This is defined in `components/ui/button.tsx` — **never hardcode gold button styles inline**.

```tsx
{/* Standard luxury CTA */}
<Button asChild variant="luxury" size="lg" className="px-10 py-6">
  <Link to="/shop">Shop the Launch</Link>
</Button>

{/* Compact luxury CTA */}
<Button variant="luxury" className="px-6">
  Subscribe
</Button>
```

The `luxury` variant provides: `rounded-none`, champagne-gold border/text, gold fill on hover, letterspaced uppercase tracking, and smooth 500ms transition — all baked in. Use `className` only for **layout** overrides (`px`, `py`, `shrink-0`).

**Available button variants reference:**

| Variant        | Use case                                         |
| -------------- | ------------------------------------------------ |
| `default`      | Primary actions (solid bg-primary)               |
| `outline`      | Standard outlined buttons                        |
| `secondary`    | Secondary actions (muted bg)                     |
| `ghost`        | Subtle/text-only actions, nav links              |
| `destructive`  | Dangerous actions (delete, remove)               |
| `link`         | Inline text links                                |
| `luxury`       | Gold-accented editorial CTAs on storefront pages |

**Rules:**
- NEVER create custom button markup — always use `<Button>`.
- Use `variant="luxury"` for gold storefront CTAs. NEVER hardcode `border-[var(--color-gold-muted)]` on a Button — that's what the variant is for.
- Use `variant="ghost"` for secondary navigation actions.
- Icons inside buttons MUST use `data-icon="inline-start"` or `data-icon="inline-end"`. No `size-*` or `ml-*` on icons inside buttons — the Button component handles sizing via CSS.

### 2.10 Form Inputs (Newsletter Style)

For underline-only inputs on dark backgrounds:

```tsx
<Input
  type="email"
  placeholder="Alamat email Anda"
  className="rounded-none bg-transparent border-0 border-b border-white/20 focus:border-[var(--color-gold)] text-white placeholder:text-white/25 px-0 text-sm tracking-wide transition-colors duration-300 shadow-none"
/>
```

---

## 3. CSS Utilities

Defined in `client/src/index.css`:

| Utility              | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `.bg-grain`          | Adds a subtle SVG noise texture overlay via `::after` pseudo   |
| `.accent-line-gold`  | 1px gradient line (legacy — prefer `<Separator>` in components)|
| `.animate-marquee`   | Infinite horizontal scroll (for promo strips)                  |

---

## 4. GSAP Animation Preparation

All sections are prepared for GSAP ScrollTrigger but **GSAP is NOT implemented yet**. Elements render in their final visible state. The following hooks exist for future integration:

### 4.1 Data Attributes

Each section has `data-section="name"` for GSAP timeline labeling:

| Section              | `data-section`     |
| -------------------- | ------------------ |
| HeroSection          | `hero`             |
| EditorialSection     | `editorial`        |
| FeaturedSection      | `featured`         |
| TrendingNow          | `trending`         |
| NewArrivals          | `new-arrivals`     |
| WhyJuicy             | `why-juicy`        |
| RecentlyViewedSection| `recently-viewed`  |
| NewsletterSection    | `newsletter`       |
| CtaSection           | `cta`              |

### 4.2 CSS Classes for GSAP Targeting

| Class                | Intent                                              |
| -------------------- | --------------------------------------------------- |
| `.gsap-reveal`       | Section header / hero content — fade + slide up     |
| `.gsap-stagger-item` | Individual cards/items in a list — staggered entry   |
| `.gsap-slide-up`     | Headline text — slide up from below                  |
| `.gsap-fade`         | Subtle opacity-only entrance                         |

### 4.3 Performance

- Elements that will animate have `will-change-transform` applied.
- All IntersectionObserver-based visibility animations have been removed (GSAP will replace them).
- Prefer animating `transform` and `opacity` only — never `width`, `height`, `top`, `left`.

---

## 5. Mandatory shadcn/ui Rules

Every component MUST comply with these shadcn rules. They are non-negotiable.

### 5.1 Use Components, Not Custom Markup

| Need               | Use                              | NEVER do                                |
| ------------------- | -------------------------------- | --------------------------------------- |
| Horizontal line     | `<Separator />`                  | `<div className="border-t">`, `<hr>`   |
| Loading placeholder | `<Skeleton />`                   | `<div className="animate-pulse">`       |
| Status label        | `<Badge variant="...">`         | `<span className="text-green-500">`     |
| Callout/alert       | `<Alert />`                      | Custom styled div                       |
| Empty state         | `<Empty />`                      | Custom empty markup                     |
| Toast               | `toast()` from sonner            | Custom toast component                  |

### 5.2 Styling Rules

- Use `className` for **layout only** (padding, margin, flex, grid). NEVER override component colors or typography inline — modify the source in `components/ui/*` instead.
- Use `size-*` when width equals height. Write `size-10` not `w-10 h-10`.
- Use `truncate` shorthand. Not `overflow-hidden text-ellipsis whitespace-nowrap`.
- Use `cn()` from `@/lib/utils` for conditional classes. NEVER use manual template literal ternaries for merging class strings (plain ternaries for switching between two classes are fine).
- NEVER use `space-x-*` or `space-y-*`. Use `flex` with `gap-*`.
- NEVER hardcode `z-index` on overlay components (Dialog, Sheet, Popover handle their own stacking).

### 5.3 Icons in Buttons

```tsx
// ✅ Correct — data-icon attribute, no sizing
<Button>
  <SearchIcon data-icon="inline-start" />
  Search
</Button>

// ❌ Wrong — manual sizing and spacing
<Button>
  <SearchIcon className="size-4 mr-2" />
  Search
</Button>
```

### 5.4 Component Composition

- Items always inside their Group: `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`.
- Card always uses full composition: `CardHeader` / `CardTitle` / `CardDescription` / `CardContent` / `CardFooter`.
- Dialog, Sheet, Drawer always need a `Title` (use `className="sr-only"` if visually hidden).
- `Avatar` always needs `AvatarFallback`.
- `TabsTrigger` must be inside `TabsList`.

### 5.5 Imports

- Always use absolute imports: `@/components/ui/button`, `@/lib/utils`, etc.
- NEVER use relative imports that go up more than one level (`../../`).
- Components use PascalCase filenames, utilities/hooks use camelCase, folders use kebab-case.

---

## 6. Typography Scale Reference

For quick reference, here's the scale used across the storefront:

| Element                     | Classes                                                                |
| --------------------------- | ---------------------------------------------------------------------- |
| Hero / section headline     | `text-5xl sm:text-6xl md:text-8xl font-heading font-bold tracking-tight leading-[0.88]` |
| Sub-section headline        | `text-3xl md:text-4xl font-heading font-bold tracking-tight leading-none` |
| Product name (large)        | `text-4xl sm:text-5xl md:text-6xl font-heading font-bold leading-[0.92]`  |
| Product name (card)         | `text-xs font-semibold tracking-wide`                                  |
| Category micro-label        | `text-[9px] font-bold tracking-[0.4em] uppercase font-mono`           |
| Price                       | `text-2xl md:text-3xl font-heading font-bold` (feature) or `font-mono text-xs font-semibold` (card) |
| Body copy                   | `text-sm` or `text-base` with `leading-relaxed tracking-wide`         |
| Ghost index number          | `text-7xl md:text-[6.5rem] font-heading font-extralight text-foreground/[0.06]` |
| Monospaced counter          | `text-[10px] font-mono text-white/20`                                  |

---

## 7. Opacity Scale for Text on Dark Backgrounds

| Opacity          | Usage                         |
| ---------------- | ----------------------------- |
| `text-white`     | Primary heading               |
| `text-white/60`  | Secondary text (product name) |
| `text-white/40`  | Body copy, descriptions       |
| `text-white/30`  | Muted / line-through prices   |
| `text-white/20`  | Counters, very subtle info    |
| `text-white/15`  | Inactive tab text             |
| `text-white/[0.06]` | Borders, lines            |
| `text-white/[0.04]` | Ultra-subtle glass fills  |
| `text-white/[0.02]` | Hover background tints    |

---

## 8. Checklist for New Sections

When creating a new storefront section, verify:

- [ ] Uses `data-section="..."` attribute on root `<section>`
- [ ] Has `.gsap-reveal` on the header block
- [ ] Has `.gsap-stagger-item` on repeating list items
- [ ] Has `.gsap-slide-up` on the main headline
- [ ] Uses `<Separator />` for ALL decorative lines (not raw divs)
- [ ] Uses `<Button>` for ALL clickable actions (not raw `<a>` or styled divs)
- [ ] Icons inside buttons use `data-icon`, no manual sizing
- [ ] Uses gold tokens (`--color-gold`, `--color-gold-muted`, `--color-gold-subtle`) — no raw colors
- [ ] Uses `font-heading` for headings and `font-mono` for micro-labels
- [ ] Uses semantic color tokens (`text-foreground`, `bg-background`, etc.)
- [ ] No `space-x-*` / `space-y-*` — uses `gap-*` instead
- [ ] Uses `size-*` for equal width/height (not `w-* h-*`)
- [ ] Content constrained to `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`
- [ ] Responsive: desktop grid + mobile horizontal scroll where applicable
- [ ] Elements render fully visible (no IntersectionObserver CSS animations — GSAP handles entrance)
