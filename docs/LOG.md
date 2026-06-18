# LOG.md — Juicy Changelog

---

## Phase 12 — Editorial Motion Integration (`motion` package)

> Replaced static CSS transitions and GSAP stubs with the new `motion` (v12) package. All animations use spring physics, scroll-linked parallax, and `AnimatePresence`. All GSAP-ready classes (`.gsap-reveal`, `.gsap-stagger-item`, etc.) preserved for backward compatibility — motion hooks now drive the actual behaviour.

### Changes

| File | Action | Description |
|---|---|---|
| `client/package.json` | Updated | Added `"motion"` dependency (v12, React 19 compatible) |
| `client/src/lib/animations.ts` | **Created** | Centralised animation tokens: `editorialSpring`, `tactileBounce`, `parallaxSpring`, `staggerContainer`, `fadeInUp`, `fadeIn`, `slideDown`, `heroSlideUp` |
| `client/src/components/layout/Navbar.tsx` | Refactored | Mobile menu uses `<AnimatePresence>` + `slideDown` variant; nav links use `staggerContainer` + `fadeInUp` for sequential reveal |
| `client/src/features/home/components/HeroSection.tsx` | Refactored | Slide transition uses `AnimatePresence` + `popLayout` + Ken Burns zoom (`scale: 1.05→1.15`); title uses per-word `heroSlideUp` mask reveal; tag/description/CTA staggered with spring delays |
| `client/src/features/home/components/EditorialSection.tsx` | Refactored | Background image driven by `useScroll`/`useTransform`/`useSpring` parallax (`-15%` to `15%`); content uses `whileInView` + `fadeInUp` staggered reveal; frame border transitions to gold on scroll |
| `client/src/features/home/components/FeaturedSection.tsx` | Refactored | Hero image driven by `useScroll` parallax (`-12%` to `12%`); thumbnail rail staggered with `fadeInUp`; content + bottom bar use `whileInView` reveals |
| `client/src/features/shop/components/ProductCard.tsx` | Refactored | Card hover uses `tactileBounce` spring (`scale: 1.02`); image zoom on hover (`scale: 1.06`); "View Silhouette" panel slides up via spring; frame border transitions to gold tint |
| `client/src/features/shop/components/ProductFilters.tsx` | Refactored | Subcategory expand/collapse uses `AnimatePresence` + spring-based height transition; chevron rotation animated via `motion.span` + spring |

### Animation Design Dials

| Dial | Value | Notes |
|---|---|---|
| `DESIGN_VARIANCE` | 8 | Asymmetric offsets, staggered entries, editorial spacing |
| `MOTION_INTENSITY` | 8 | Pronounced parallax, cinematic slide transitions, spring physics |
| `VISUAL_DENSITY` | 3 | Generous viewport breathing room; no element crowding |

### Key Technical Decisions

- Used `"motion"` (the rebranded standalone package, formerly Framer Motion) — imports from `"motion/react"`.
- Scroll parallax uses `useSpring(rawY, parallaxSpring)` to eliminate micro-stutter on high-refresh-rate displays.
- `useReducedMotion()` respected in all scroll-parallax components — collapses offsets when `prefers-reduced-motion` is active.
- All `type: "spring"` objects use `as const` assertion to satisfy TypeScript without importing `SpringOptions`.

---

## Phase 13 — High-End Scrolltelling & Smooth Scroll

> Integrated **Lenis** smooth scroll engine and upgraded all homepage sections to scroll-driven cinematic storytelling: hero image scale-down with ghost brand mark, word-by-word text color scrub, and a horizontal pinned lookbook runway.

### Changes

| File | Action | Description |
|---|---|---|
| `client/package.json` | Updated | Added `"lenis"` dependency (v1.3.23) |
| `client/src/components/layout/SmoothScroll.tsx` | **Created** | `ReactLenis` wrapper with `lerp: 0.08`, `duration: 1.2`, `smoothWheel: true` — wraps all public storefront routes |
| `client/src/App.tsx` | Refactored | `AppContent` wrapped in `<SmoothScroll>` for non-admin routes; imports `SmoothScroll` |
| `client/src/lib/animations.ts` | Extended | Added `scrollSpring`, `ghostReveal` spring configs for scrolltelling |
| `client/src/features/home/components/HeroSection.tsx` | Refactored | **Cinematic scroll scale-down**: section uses `h-[200dvh]` + sticky inner `h-screen`; `useScroll` drives `imageScale` (1.05→0.7), `imageX` (0%→-20%), `imageBorderRadius` (0→16px), `titleOpacity` (1→0), `titleX` (0%→-15%); giant ghost `JUICY` text emerges via `ghostOpacity` (0→0.07) and `ghostScale` (0.8→1.1); overlay fades with scroll |
| `client/src/features/home/components/EditorialSection.tsx` | Refactored | **Word-by-word text scrub**: `<WordScrub>` sub-component splits headline into individual `<motion.span>` elements; each word transitions from `opacity: 0.2` + `blur(4px)` to `opacity: 1` + `blur(0px)` based on its index/total position in the `scrollSpring`-smoothed progress |
| `client/src/features/home/components/NewArrivals.tsx` | Rewritten | **Horizontal pinned lookbook runway**: section has `h={N*120}dvh` scroll mount with sticky `h-screen` container; `motion.div` track pans horizontally via `useTransform(progress, 0→1, 0%→-(N-1)*100%)`; each slide has per-slide `opacity`/`scale` driven by its segment of progress; right-side `ProductInfoPanel` crossfades product name/price/category as progress advances |

### Scrolltelling Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Lenis Smooth Scroll                    │
│  lerp: 0.08 | duration: 1.2 | smoothWheel: true          │
└────────────────────────┬─────────────────────────────────┘
                         │ drives
                         ▼
┌──────────────────────────────────────────────────────────┐
│        useScroll(sectionRef) → spring → useTransform     │
│                                                          │
│  HeroSection (h-[200dvh]):                                │
│    sticky h-screen → scale, x, borderRadius, opacity     │
│                                                          │
│  EditorialSection:                                        │
│    word-by-word opacity + blur scrub                     │
│                                                          │
│  NewArrivals (h-[N*120dvh]):                              │
│    sticky h-screen → horizontal x translation            │
│    per-slide opacity/scale fade                          │
└──────────────────────────────────────────────────────────┘
```

### Key Technical Decisions

- **Lenis over CSS `scroll-behavior`**: Lenis provides physics-based wheel interpolation with configurable `lerp` and `duration`, making `useScroll` scrubbing feel cinematic rather than janky.
- **200dvh / N*120dvh scroll mounts**: Each scrolltelling section creates its own scroll "well" via `ref` + `useScroll` offset. The section wrapper is taller than viewport, while the inner container is `sticky top-0 h-screen` — this pins the content in place while the browser scrolls through the wrapper's height.
- **Word scrub via segmented progress**: Each word's activation window is `[index/total, (index+1)/total]` of the section's scroll progress. Words transition from blurred/muted to sharp/opaque as they cross the viewport.
- **Horizontal track from vertical scroll**: The NewArrivals runway maps `scrollYProgress` (0→1) to `x` translation (0%→-500%), creating a horizontal pan effect from vertical scrolling — a staple of luxury editorial sites.
