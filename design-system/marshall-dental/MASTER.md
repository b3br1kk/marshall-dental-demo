# Design System Master File — MARSHALL Dental Studio (v2.0)

**Project:** MARSHALL Dental Studio (г. Нефтеюганск, 13 мкр, 34)
**Archetypes:**
- **Primary Macro-Choreography**: **Archetype B (`Clearmed`)** — Warm Editorial Luxury, Preloader Curtain Reveal, Scroll-Pinned `100vw` Image Morph, Sticky `50/50` Split, and **3D Curved Arc Card Fan**.
- **Signature Interaction**: **Archetype D (`OFFLINE`)** — Interactive Studio Podium with Camera Zoom Isolation and Slide-Over **Monospace Clinical Receipt Drawer**.

---

## 1. Color Tokens (Warm Sunlit Travertine & Espresso)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#FAF6F0` | Primary warm alabaster / sunlit ivory canvas |
| `--surface` | `#F2ECE1` | Warm travertine stone surface |
| `--surface-card` | `#FFFFFF` | Pure crisp card surface |
| `--obsidian` | `#161412` | Deep espresso charcoal (dark contrast section & footer) |
| `--ink` | `#181512` | Primary editorial typography |
| `--ink-muted` | `#6D645B` | Secondary body copy |
| `--ink-faint` | `#9C9288` | Metadata & coordinates |
| `--accent` | `#C86D44` | Warm terracotta amber (Primary pill CTAs & active indicators) |
| `--accent-hover` | `#B35B34` | Terracotta hover state |
| `--titanium` | `#B89660` | Brushed champagne titanium highlight |
| `--hairline` | `rgba(24, 21, 18, 0.11)` | Subtle `1px` architectural borders |
| `--glass` | `rgba(250, 246, 240, 0.78)` | Floating glassmorphic UI widgets (`backdrop-filter: blur(18px)`) |

---

## 2. Typography Pairings

- **Display / Editorial Headings (`--font-display`)**: `'Cormorant Garamond'`, Georgia, serif (`weight: 500, 600`, italic accents, `line-height: 1.04`, `letter-spacing: -0.02em`)
- **UI & Body Copy (`--font-sans`)**: `'Manrope'`, system-ui, sans-serif (`weight: 400, 500, 600`, `line-height: 1.6`)
- **Clinical Receipt & Technical Coordinates (`--font-mono`)**: `'JetBrains Mono'`, monospace (`weight: 500, 600`)

---

## 3. Spatial Section Rhythm (Zero Uniform 3-Column Grids)

1. **Preloader (`0.9s`)**: Centered `MARSHALL®` wordmark on `#FAF6F0` wipes upward via `clip-path: inset(0 0 100% 0)`.
2. **Hero (`Asymmetric 5/7 Editorial Split`)**: 5-word serif H1 + studio portrait with 2 floating glassmorphic micro-widgets.
3. **Scroll-Pinned Suite Expand (`100vw Morph`)**: Container scales from `58vw` (`border-radius: 32px`) to `96vw` (`86vh`) on scroll with floating glass hotspot pills.
4. **Interactive Studio Lookbook + Receipt Drawer (`OFFLINE` Showcase)**: 4 isolated studio objects on seamless `#FAF6F0` cyclorama; clicking a case zooms the object and slides in the monospace `CLINICAL PROTOCOL RECEIPT` with barcode.
5. **Sticky `50/50` Care Journey (`From first visit to lasting care`)**: Left sticky studio photo crossfades across 3 stages while right steps scroll.
6. **3D Curved Arc Card Fan (`Planned by specialists`)**: 5 vertical `3:4` cards fan out in a curved arc (`rotateZ: -11deg .. +11deg`) on scroll.
7. **Obsidian Concierge Booking (`#161412`)**: High-contrast dark booking suite pre-filled from the Receipt Drawer.
