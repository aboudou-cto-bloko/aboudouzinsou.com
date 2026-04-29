# Design System: aboudouzinsou.com

## 1. Visual Theme & Atmosphere

A purely monochromatic, text-first reading environment. Near-zero chrome. The interface disappears — only content remains. Density: Art Gallery Airy (2/10). Variance: Predictable Symmetric (2/10). Motion: Static Restrained (1/10). Inspired by Naval's archive at nav.al/archive — the conviction that a page stripped of all ornament communicates more authority than a decorated one.

## 2. Color Palette & Roles

- **Void Black** (#090909) — Primary canvas, entire background
- **Ink Surface** (#111111) — Subtle surface variation for code blocks only
- **Pure Paper** (#f0f0f0) — Primary text, all body and headings
- **Fog** (#888888) — Secondary text: dates, reading time, metadata
- **Ash** (#444444) — Tertiary: dividers, muted labels
- **Focus Signal** (#f0f0f0) — Focus ring (same as text — no color accent)

No accent color. No red. No blue. No glow. Strictly monochrome.

## 3. Typography Rules

- **Primary Font:** Jost — Google Fonts. Weights: 300 (body), 400 (UI), 500 (headings)
- **Display/H1:** Jost 500, 2rem (32px), letter-spacing -0.02em, Pure Paper
- **H2:** Jost 500, 1.375rem (22px), letter-spacing -0.01em
- **H3:** Jost 400, 1.125rem (18px)
- **Body:** Jost 300, 1.0625rem (17px), line-height 1.85, max 65ch
- **Meta/Date:** Jost 300, 0.8125rem (13px), Fog color
- **Code:** JetBrains Mono, 0.875rem (14px), Ink Surface background
- **Banned:** Inter, system-ui for body, any serif, any sans with personality > neutral

## 4. Component Stylings

- **Nav links:** Jost 300, 15px, Pure Paper. Hover: opacity 0.5. Active: opacity 1. No underline by default.
- **Article list items:** Title in Pure Paper, date in Fog. On hover: title opacity 0.6. No card, no border, no shadow. Divider via margin only.
- **Article body links:** Underline with `text-decoration-color: #444444`. Hover: Pure Paper underline.
- **Code blocks:** Ink Surface (#111111) background, 4px padding, JetBrains Mono. No syntax highlighting colors except Fog for comments.
- **Buttons (rare):** Ghost style only. 1px solid Ash border. No fill. Hover: 1px solid Pure Paper. No glow.
- **Focus rings:** 2px solid Pure Paper, 2px offset. Never hidden. Keyboard-first.

## 5. Layout Principles

- Single-column content, max-width 680px, centered
- Nav: max-width 680px, same column as content — no full-width nav bar
- Vertical rhythm: base unit 8px. Section gaps: 64px (8rem). Article spacing: 32px (4rem)
- No cards anywhere in the list views — pure text list
- No hero images, no cover photos in article headers
- No sidebar, no table of contents visible by default
- Section dividers: 1px solid Ash (#444444) or spacing only

## 6. Motion & Interaction

- No entrance animations on page load
- Link hover: `opacity` transition 120ms ease
- Focus: instant (no transition on focus ring)
- Page transitions: none (prefer content immediacy)

## 7. Anti-Patterns (Banned)

- No color accent (no red, no brand color)
- No gradient text, no gradient backgrounds
- No card components in lists — raw text links only
- No hero section with image
- No icons next to navigation links
- No animated counters, no fake metrics
- No "Elevate", "Seamless", "Next-Gen" copy
- No decorative horizontal rules with special styling
- No tag badges with colored backgrounds
- No oversized hero typography (max 32px headline)
- No sticky header with blur/glass effect — simple sticky or static
- No `Inter` font
