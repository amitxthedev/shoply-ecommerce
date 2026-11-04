# Shoply — UI/UX Design Specification (Figma)

| Field | Value |
|---|---|
| **Project name** | Shoply |
| **Document type** | UI/UX Design Specification for Figma |
| **Version** | 1.0 |
| **Date** | 2026-11-04 |
| **Status** | 🟡 Draft — Awaiting stakeholder approval |
| **Author** | Senior UI/UX Designer & Design Systems Engineer |
| **Sources of truth** | `docs/PROJECT_PLANNING.md` v1.0 (approved) · `docs/SRS.md` v1.0 · `docs/USER_FLOWS.md` v1.0 · **two reference screenshots** (see §0) |
| **Visual references** | **Ref A:** "Furniture." green/yellow furniture ecommerce (primary) · **Ref B:** "SHOO TECH MART" PATRIA-style template (secondary, structure only) |
| **Next phase** | Figma file build (after approval) → frontend development (after Figma approval) |
| **Code status** | ❌ No application code |

---

## Document Control

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-04 | Initial design specification: reference analysis, tokens, components, responsive layouts, page requirements, Figma organization |

**Rules governing this document:**

1. **The screenshots are the source of truth for visual decisions.** This document does not redesign independently — every visual decision traces to Ref A (primary) or Ref B (secondary, structure only).
2. Your 15 explicit design requirements (square cards, dark green, yellow accent, no gradients, no conflicting colors, etc.) **override the screenshots where they collide**; every such collision is resolved and logged in §0.6 and §21.
3. Scope comes from the approved SRS and `USER_FLOWS.md`. Features deferred to V1.5/V2 (wishlist, reviews, coupons, email) get **no placeholder UI** (UX-DEC-13).
4. Requirement IDs (`A11Y-*`, `RESP-*`, `PERF-*`, `FR-*`) are cited so design and requirements stay traceable.
5. New design decisions raised here are logged in [§21](#21-unresolved-design-decisions-ds-dec) — no silent design choices.

---

## Table of Contents

0. [Reference Analysis & Reproduction Strategy](#0-reference-analysis--reproduction-strategy)
1. [Brand Identity](#1-brand-identity)
2. [Design Philosophy](#2-design-philosophy)
3. [Visual Direction](#3-visual-direction)
4. [Color Palette](#4-color-palette)
5. [Typography System](#5-typography-system)
6. [Spacing System](#6-spacing-system)
7. [Component Design Guidelines](#7-component-design-guidelines)
8. [Button Variants](#8-button-variants)
9. [Input Field Variants](#9-input-field-variants)
10. [Product Card Design](#10-product-card-design)
11. [Navigation Design](#11-navigation-design)
12. [Footer Design](#12-footer-design)
13. [Responsive Breakpoints](#13-responsive-breakpoints)
14. [Desktop Layout Specifications](#14-desktop-layout-specifications)
15. [Tablet Layout Specifications](#15-tablet-layout-specifications)
16. [Mobile Layout Specifications](#16-mobile-layout-specifications)
17. [Accessibility Requirements](#17-accessibility-requirements)
18. [Animation Guidelines](#18-animation-guidelines)
19. [Page-by-Page Design Requirements](#19-page-by-page-design-requirements)
20. [Figma Component Organization](#20-figma-component-organization)
21. [Unresolved Design Decisions (DS-DEC)](#21-unresolved-design-decisions-ds-dec)
22. [Recommended Design Direction & Approval](#22-recommended-design-direction--approval)

---

## 0. Reference Analysis & Reproduction Strategy

> This section fulfills the pre-implementation requirement: analyze the references and explain exactly how layout, typography, colors, and components will be reproduced **before** anything is built.

### 0.1 Reference A — "Furniture." (PRIMARY)

Desktop canvas ~1440 px, content container ~1200 px, section bands alternate **white ↔ light gray**.

| # | Zone | Anatomy as observed | Reproduction in Shoply |
|---|---|---|---|
| 1 | **Announcement bar** | ~40 px, solid dark green; phone number left, promo center with yellow underlined link, yellow circular social icons right | ✅ Adopt structure; **content adapted**: left = support phone, center = free-shipping message linking to shipping policy. Social icons → excluded in V1 ([DS-DEC-05](#21-unresolved-design-decisions-ds-dec)); 25%-off signup line excluded (coupons V1.5, email V2) |
| 2 | **Header** | White, ~72 px; logo (green circle monogram + wordmark) left; nav links centered; search · wishlist · cart · account icons right | ✅ Adopt three-zone structure exactly. **Wishlist icon excluded** (V1.5). Cart icon keeps a count badge |
| 3 | **Hero** | Light-gray band; left ≈55%: pill badge → display headline (2nd phrase green) → gray subcopy → green pill CTA + underlined secondary link → avatar-stack social proof; right ≈45%: horizontal category cards (white, photo, name, item count, price tag, green circular arrow) + green/yellow circular carousel arrows + faint dot-grid decoration | ✅ Adopt composition 1:1. Data from published products only (FR-CUS-01). CTA target = curated collection (UX-DEC-01). Rating proof adapted ([DS-DEC-03](#21-unresolved-design-decisions-ds-dec)); dot-grid decoration retained (static) |
| 4 | **USP bar** | White, 3 columns: line icon in circle, bold title, gray subtext | ✅ Adopt as-is: Free Shipping (≥ $180) · Flexible Payment (secure card payments) · Support (we're here to help) — copy tied to DEC-05 |
| 5 | **Category showcase** | Light-gray band; asymmetric grid — 1 tall card left + 2 stacked right; each card: count chip ("1500+ Items"), big title, subcategory link list, large product cutout on light gray | ✅ Adopt layout + count chips + large imagery. **Subcategory lists excluded** — categories are single-level (SRS DEC-15a); replaced by count chip + "Shop now" arrow link ([DS-DEC-09](#21-unresolved-design-decisions-ds-dec)) |
| 6 | **Products section** | White; eyebrow ("— Our Products") with yellow dash → centered H2 with green accent phrase → pill tab row (active = green fill, others = outlined white) → 4-up grid | ✅ Adopt fully. Tabs = rule-driven home modules (New Arrivals · Featured · Best Sellers, DEC-24). Discount badge, hover column, label row adopted with V1 substitutions (§0.6) |
| 7 | **Product card** | Light-gray 1:1 image area; green square discount badge top-left; vertical hover-icon column top-right (heart/expand/cart); yellow countdown bar on sale card; below: category label + ★ rating row, bold name | ✅ Adopt frame. **V1 substitutions:** no heart (V1.5 slot), no quick-add (UX-DEC-03 — PDP only), no countdown ([DS-DEC-02](#21-unresolved-design-decisions-ds-dec)), rating row replaced by **price** (price is mandatory, rating is V1.5) |
| 8 | **Footer** | Not visible (screenshot cut) | ➖ Designed from `USER_FLOWS.md` §8.4 + Ref B density; see §12 ([DS-DEC-14](#21-unresolved-design-decisions-ds-dec)) |

**Typography observed:** one geometric bold sans for display/headings (Poppins-like), one neutral sans for body; hierarchy carried by **weight (700 vs 400) and color (ink → green accent → gray)**, not by many sizes; small uppercase eyebrows with a yellow dash; generous line-height on body copy.

**Layout DNA observed:** full-width color bands alternating white/light-gray · asymmetric hero (text | card carousel) · asymmetric showcase grid · centered section headers with eyebrow · pill interactive elements on an otherwise rectangular page · large product photography on light-gray plates · circular icon actions.

### 0.2 Reference B — "SHOO TECH MART" (SECONDARY — structure only)

| Observed pattern | Decision | Shoply reproduction |
|---|---|---|
| Dense category **sidebar** on listing pages | ✅ Adopt | PLP desktop left filter rail (category · size · color · price) |
| **Tabbed product rows** (Best Seller / New In / Popular) | ✅ Adopt | Same tab pattern as Ref A products section |
| **"Top Categories" tile grid** | ✅ Adopt | Home "Shop by category" grid (4–5 tiles) |
| **In-stock badge**, green price emphasis, qty stepper, delivery-info block on PDP | ✅ Adopt | PDP stock state (DEC-16), square qty stepper, delivery/returns info block linking to policy pages |
| Green **section-header bars** ("DEAL OF THE DAY", "FEATURED BRANDS") | ⚠️ Adapt | Section headers follow Ref A (centered eyebrow + H2). Green filled bars used only for **admin console section labels** |
| **Deal-of-day countdown**, flash-sale progress | ❌ Exclude | No `saleEndsAt` data exists in SRS — see [DS-DEC-02](#21-unresolved-design-decisions-ds-dec) |
| **Featured brands** row | ❌ Exclude | Shoply is single-brand (R1 scope) |
| **Coupon marquee** strip | ❌ Exclude | Coupons deferred to V1.5 (FR-CPN-*) |
| **Stats** ($12.5M / 12K+ / 725+) | ❌ Exclude | No invented metrics (honesty principle, UX-DEC-13) |
| **Related products** row on PDP | ❌ Exclude | Recommendations explicitly out of scope (SRS §3.2) |
| Bright green **#18B818**, **red** prices | ❌ Exclude | Ref A palette only — see §0.5 |
| Dark **footer sitemap** density | ✅ Adopt (structure) | Footer columns per §12 |

### 0.3 Typography reproduction

| Reference trait | Shoply implementation |
|---|---|
| Geometric bold display face | **Poppins 600/700** for H1–H4, eyebrows, buttons |
| Neutral legible body face | **Inter 400/500/600** for body, labels, inputs, tables, nav |
| Hierarchy by weight + color | 700 ink headings · 400 gray body · green accent phrases inside headings |
| Uppercase eyebrows with dash | `OUR PRODUCTS` style: 12–13 px, letter-spacing 0.08 em, preceded by a 24×2 px **yellow** dash |
| Two-tone headline ("Explore Our **Modern Furniture Collection**") | Every H2 follows the pattern: ink phrase + **green** phrase |

Both faces are Google-hosted, limited to **5 weight faces total** with `font-display: swap` (PERF-12). Full scale in §5.

### 0.4 Color reproduction (sampled from the screenshots)

Sampled by reading pixel values directly from both reference images (mode/patch sampling, 8-quantized to suppress JPEG noise):

| Token | Hex | Sampled from | Role |
|---|---|---|---|
| `primary-700` | **#06571D** | Ref A top bar, Shop Now button, active tab (3 consistent reads) | Primary actions, announcement bar, badges, heading accents, footer, admin sidebar |
| `primary-800` | **#044516** (derived −12% lightness) | Derived | Hover/pressed states |
| `primary-900` | **#033311** (derived) | Derived | Active/pressed deep state |
| `accent-500` | **#F2B808** | Ref A countdown bar + "+" circle (range #F0B808–#F8B808) | Accent dashes, avatar "+", active indicators, warning state — **never as text on white** |
| `surface-light` | **#F5F6F6** | Ref A hero band, card image plates | Section bands, image plates, input fills, admin content bg |
| `white` | **#FFFFFF** | Ref A header, products section | Default page surface |
| `ink` | **#0A0A0A** | Ref A "Explore Our" (sampled #040605) | Headings, primary text |
| `text-body` | **#404040** | Ref A subcopy (stroke-center sample) | Body copy |
| `text-muted` | **#6E6E6E** (defined) | — | Labels, meta, helper text (5.2:1 on white) |
| `line` | **#E5E5E5** (defined) | Ref A tab outlines | Hairline dividers, input borders, table rules |
| ~~Ref B green~~ | ~~#18B818~~ | Ref B search button/deal header | ❌ **Excluded** — conflicts with primary (rule 14) |
| ~~Ref B red~~ | ~~red prices~~ | Ref B sale prices | ❌ **Excluded** — red allowed only as *semantic* error (§4.3) |

No gradients anywhere (plan §8 rule 1). Full palette + contrast math in §4.

### 0.5 Component reproduction map

| Component | Source | Status | Note |
|---|---|---|---|
| Announcement bar | Ref A | ✅ Adopt | Content adapted (§0.1 #1) |
| Header (3-zone, sticky) | Ref A | ✅ Adopt | No wishlist icon in V1 |
| Pill CTA with arrow | Ref A | ✅ Adopt | Signature element |
| Underlined text-link CTA | Ref A | ✅ Adopt | Secondary action |
| Pill badge / eyebrow chip | Ref A | ✅ Adopt | |
| Avatar-stack social proof | Ref A | ✅ Adopt | Copy adapted (DS-DEC-03) |
| Category carousel cards + circular arrows | Ref A | ✅ Adopt | Square cards per radius rule; circles stay circular |
| USP 3-column bar | Ref A | ✅ Adopt | |
| Asymmetric category showcase | Ref A | ✅ Adopt | No subcategory lists (DEC-15a) |
| Section eyebrow + two-tone H2 | Ref A | ✅ Adopt | |
| Pill tabs (green active) | Ref A | ✅ Adopt | |
| Product tile (1:1 plate, discount badge) | Ref A | ✅ Adopt | Substitutions per §0.6 |
| Hover icon column | Ref A | ⏸ V1.5 | Heart slot only (no dead icons in V1) |
| Countdown timer | Ref A/B | ❌ Exclude | DS-DEC-02 |
| Filter sidebar | Ref B | ✅ Adopt | PLP desktop rail; mobile bottom sheet (UX-DEC-04) |
| Top-categories tile grid | Ref B | ✅ Adopt | |
| Stock badge, qty stepper, delivery info | Ref B | ✅ Adopt | PDP |
| Feature cards (icon + title + text) | Ref B | ✅ Adopt | Account/trust micro-sections, checkout reassurance row |
| Footer sitemap columns | Ref B | ✅ Adopt | Structure only, §12 |
| Green section bars | Ref B | ⚠️ Adapt | Admin console only |
| Brands row / stats / marquee / countdown / related products | Ref B | ❌ Exclude | Scope or palette conflicts |

### 0.6 Conflicts resolved (screenshot vs. your 15 rules vs. approved scope)

| # | Conflict | Resolution |
|---|---|---|
| C1 | Ref A cards are rounded ~16 px vs. **rule 7: square-cornered cards, no visible borders** | **Cards, panels, image plates, inputs, badges, modals, tables = 0 px radius, borderless** (hairline dividers allowed only inside tables/lists). Radius exists only on **pill buttons, chips, tabs** and **circular** icon buttons — the reference's action signature. Satisfies rules 7 + 8 without redesigning the reference ([DS-DEC-01](#21-unresolved-design-decisions-ds-dec)) |
| C2 | Ref shows ★ ratings & "4.9 Ratings+" — reviews are **V1.5** | No stars in V1. Hero keeps the avatar stack with honest static copy; rating slot documented as V1.5 component variant (DS-DEC-03) |
| C3 | Ref shows countdown timers | Excluded — no sale-end field in SRS (DS-DEC-02) |
| C4 | Ref shows "Sign up and GET 25% OFF" | Excluded — coupons V1.5, email V2. Announcement carries free-shipping message instead (DS-DEC-04) |
| C5 | Ref nav has Blog / About Us / Contact Us | Excluded — not in the 35-page inventory (`USER_FLOWS.md` §9). Nav = Home + categories; Support lives in footer (DS-DEC-08) |
| C6 | Ref shows subcategory lists inside category cards | Excluded — categories are single-level (DEC-15a). Count chip + arrow instead (DS-DEC-09) |
| C7 | Ref B bright green / red prices | Excluded — Ref A palette only (rule 14) |
| C8 | Ref B brands row, stats, coupon marquee, related products | Excluded — single-brand scope, no invented metrics, coupons V1.5, recommendations out of scope (SRS §3.2) |
| C9 | Ref A card hover shows heart/expand/cart icons | V1 card hover = image zoom + title color only. Heart documented as V1.5 slot; quick-add prohibited (UX-DEC-03); expand would be redundant with card click (UX-DEC-13) |
| C10 | Ref shows social icons | Excluded in V1 — no real destinations exist; no dead links (DS-DEC-05) |

---

---

## 1. Brand Identity

| Attribute | Value |
|---|---|
| **Name** | Shoply |
| **Category** | Single-brand D2C apparel & accessories (4–5 categories · 40–60 products · ~250–400 SKUs) |
| **Positioning** | Premium everyday essentials — well-made staples, honestly presented |
| **Audience** | Style-conscious 25–40 professionals (persona Maya, primary); gift buyers (Daniel); returning loyalists (Sofia) |
| **Voice** | Calm, confident, material-first. Short sentences. No hype, no exclamation marks, no fake urgency |
| **Language/currency** | English · USD (US-only, V1) |

### 1.1 Logo

| Element | Specification |
|---|---|
| **Monogram** | Circle, fill `primary-700`, white "S" (Poppins 700) — mirrors Ref A's green circle mark. Circles are *shapes*, exempt from the radius rule |
| **Wordmark** | `Shoply` in Poppins 700, `ink`, followed by a **green period** (`primary-700`) — mirrors "Furniture." construction |
| **Lockup** | Monogram + wordmark horizontally, 12 px gap; monogram height = 1.6× cap height of wordmark |
| **Clear space** | Equal to the monogram radius on all sides |
| **Minimum size** | 120 px wide (digital) |
| **Header usage** | Full lockup · **Footer/admin:** lockup in white variant on green |
| **Not allowed** | Gradients, outlines, shadows, recoloring, stretching, placement on busy imagery without a solid plate |

### 1.2 Brand expressions in UI

- **Green = brand & action.** If an element is the primary thing to do, it is dark green.
- **Yellow = accent, never load-bearing.** Dashes, indicators, small highlights only (§4.4).
- **Photography = the product.** Large, realistic, consistent light-gray plates — apparel shots at 1:1 on `#F5F6F6`.

---

## 2. Design Philosophy

Derived from `PROJECT_PLANNING.md` §8 (six rules defining "premium") and the honesty principles in `USER_FLOWS.md` §13.3:

1. **Restrained palette.** One neutral base, one primary (dark green), one accent (yellow), one semantic set (error red). No gradients, no glow, no third brand hue. (Plan §8.1)
2. **Typography does the heavy lifting.** Two faces, one scale (§5). Hierarchy comes from weight and color — not from six font sizes. (Plan §8.2)
3. **Whitespace is the luxury signal.** Section rhythm ≥ what feels comfortable; content never packed edge-to-edge. (Plan §8.3)
4. **Imagery carries the brand.** Consistent aspect ratios, uniform light-gray plates, high-resolution photography. Poor imagery kills premium faster than bad CSS. (Plan §8.4)
5. **Micro-interactions, not decoration.** 150–200 ms transitions, skeleton loaders, focus rings. No parallax, no scroll-jacking. (Plan §8.5)
6. **Component discipline.** Every button, input, badge, card is defined once in Figma and reused — no page invents its own button. (Plan §8.6)
7. **Honest UI.** Nothing unbuilt is advertised: no dead links, no "coming soon", no placeholder features, no lorem ipsum (FR-CUS-01 AC; UX-DEC-13).
8. **Human-designed, not template-generated.** Asymmetric layouts (hero split, showcase grid), two-tone headings, eyebrow dashes, dot-grid details — the small deliberate touches visible in the reference that generic AI layouts omit.

---

## 3. Visual Direction

### 3.1 Style statement

> **Editorial-retail minimalism with furniture-store warmth:** full-width white/light-gray bands, oversized product photography on light-gray plates, geometric bold headings with a green accent phrase, dark-green actions, yellow punctuation — everything square except the actions you take.

### 3.2 What the eye should read, in order (visual hierarchy)

1. **Photography** (largest, highest contrast)
2. **Headings** (Poppins 700, ink + green accent phrase)
3. **Primary actions** (dark-green pill)
4. **Price / key data** (Inter 600, ink)
5. **Body copy** (Inter 400, #404040)
6. **Meta labels** (Inter 400/500, muted, small, uppercase where eyebrow-like)

### 3.3 Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Alternate white ↔ `#F5F6F6` section bands | Use gradients, glows, or more than 3 hues |
| Two-tone headings (ink + green phrase) | Color entire headings green |
| Square cards, panels, inputs (0 px) | Round cards, add card borders, or lift cards with shadows |
| Pill buttons/chips/tabs; circular icon buttons | Round structural containers "a little bit" |
| Yellow only as accent (dash, indicator, small fill with dark text) | Set yellow text on white, or yellow large surfaces |
| Large realistic product images on light-gray plates | Cut-out products on colored/patterned backgrounds |
| Hairline `#E5E5E5` dividers inside tables/lists only | Draw borders around cards or sections |
| Skeleton loaders for lists | Spinner-only loading states |
| One shadow style only (modals/toasts) | Drop shadows on cards, buttons, or images |
| Empty states with a next action | Dead-end empty screens |

### 3.4 Responsive principle

Authored **375 px first, enhanced upward** (RESP-01): larger breakpoints add columns and reveal sidebars — they never "repair" a broken mobile layout. The reference's identity (bands, two-tone headings, square structure, green actions) survives at every width (rule 15).

---

## 4. Color Palette

### 4.1 Core tokens

| Token | Hex | Source | Usage |
|---|---|---|---|
| `primary-700` | **#06571D** | Sampled (Ref A) | Primary buttons, announcement bar, active tabs, badges, heading accents, footer, admin sidebar, focus rings |
| `primary-800` | **#044516** | Derived | Button hover |
| `primary-900` | **#033311** | Derived | Button active/pressed |
| `primary-100` | **#E3EFE7** | Derived (tint) | Subtle selected states, chip fills, table row highlight |
| `accent-500` | **#F2B808** | Sampled (Ref A) | Eyebrow dash, avatar "+", active tab underline, warning badge fill, admin active indicator |
| `accent-600` | **#D9A307** | Derived | Accent hover |
| `white` | **#FFFFFF** | Sampled | Page surface, cards on gray bands |
| `surface-light` | **#F5F6F6** | Sampled | Section bands, image plates, input fill, admin content bg |
| `ink` | **#0A0A0A** | Sampled | Headings, primary text |
| `text-body` | **#404040** | Sampled | Body copy |
| `text-muted` | **#6E6E6E** | Defined | Labels, meta, helper text |
| `line` | **#E5E5E5** | Defined | Hairline dividers, input borders, table rules |
| `line-strong` | **#C9C9C9** | Defined | Input borders on white, control outlines |

### 4.2 Semantic tokens

| Token | Hex | Usage | Never |
|---|---|---|---|
| `error-700` | **#B42318** | Inline field errors, error toasts, decline states | Decorative use, prices |
| `error-100` | **#FDECEA** | Error banner background, input error fill tint | Large surfaces |
| `success` | = `primary-700` | In-stock, success toasts, PAID status | — |
| `warning` | = `accent-500` | "Only N low" badge fill (with **dark text**) | Text color on white |
| `info` | = `text-body` | Neutral notices | New hues (plan §8.1 allows only success/warning/error) |

Red exists **only** as semantic error. The reference's red prices are excluded (C7).

### 4.3 Status colors (always paired with text/icon — A11Y-05)

| Status | Foreground | Background | Text label required |
|---|---|---|---|
| In stock / PAID / success | `#06571D` | `#E3EFE7` | ✅ |
| Low stock / warning | `#0A0A0A` | `#F2B808` | ✅ |
| Sold out / CANCELLED / disabled | `#6E6E6E` | `#F5F6F6` | ✅ |
| Error / REFUNDED / failed | `#B42318` | `#FDECEA` | ✅ |

### 4.4 Contrast verification (WCAG 2.1 AA — A11Y-04)

| Pair | Ratio | Verdict |
|---|---|---|
| White on `primary-700` #06571D | **8.8:1** | ✅ AAA (buttons, bar) |
| `ink` #0A0A0A on white | **19.1:1** | ✅ AAA |
| `text-body` #404040 on white | **10.4:1** | ✅ AAA |
| `text-body` on `surface-light` #F5F6F6 | **9.9:1** | ✅ AAA |
| `text-muted` #6E6E6E on white | **5.2:1** | ✅ AA |
| `primary-700` on white (links/headings) | **8.8:1** | ✅ AAA |
| `ink` on `accent-500` #F2B808 | **17.4:1** | ✅ AAA (countdown/badges) |
| `error-700` #B42318 on white | **6.6:1** | ✅ AA |
| `accent-500` on white | 1.8:1 | ❌ **Forbidden** — yellow never as text on light surfaces (§7 rule) |

### 4.5 Figma color styles naming

`Color/Primary/700` · `Color/Primary/800` · `Color/Accent/500` · `Color/Surface/Base` · `Color/Surface/Subtle` · `Color/Text/Ink` · `Color/Text/Body` · `Color/Text/Muted` · `Color/Border/Line` · `Color/Error/700` · `Color/Error/100` · `Color/Success/700` · `Color/Warning/500` (Variables, not loose hexes — §20).

---

## 5. Typography System

### 5.1 Families

| Role | Face | Weights | Fallback |
|---|---|---|---|
| Display / headings / buttons / eyebrows | **Poppins** | 600, 700 | `system-ui, sans-serif` |
| Body / UI / inputs / tables / nav | **Inter** | 400, 500, 600 | `system-ui, sans-serif` |

5 faces total, `font-display: swap`, one critical face preloaded (PERF-12). No italics in V1.

### 5.2 Scale (RESP-07: token-driven, no per-breakpoint hacks)

| Token | Desktop (≥1440) | Tablet (768–1023) | Mobile (≤767) | Face/Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|
| `Display/H1` | 64 | 48 | 36 | Poppins 700 | 1.08 | −0.02em |
| `Heading/H2` | 40 | 32 | 28 | Poppins 700 | 1.15 | −0.01em |
| `Heading/H3` | 28 | 24 | 20 | Poppins 600 | 1.25 | −0.01em |
| `Heading/H4` | 20 | 18 | 17 | Poppins 600 | 1.3 | 0 |
| `Body/Large` | 18 | 17 | 16 | Inter 400 | 1.6 | 0 |
| `Body/Base` | 16 | 16 | 15 | Inter 400 | 1.6 | 0 |
| `Body/Small` | 14 | 14 | 13 | Inter 400 | 1.5 | 0 |
| `Label` | 14 | 14 | 14 | Inter 500 | 1.4 | 0 |
| `Eyebrow` | 13 | 13 | 12 | Poppins 600, uppercase | 1.4 | 0.08em |
| `Micro/Badge` | 12 | 12 | 12 | Inter 500 | 1.3 | 0.02em |
| `Price/Card` | 17 | 16 | 16 | Inter 600 | 1.3 | 0 |
| `Price/Hero` (PDP) | 28 | 24 | 22 | Inter 600 | 1.2 | 0 |

### 5.3 Rules

1. **One `h1` per page** (A11Y-09). Home H1 = hero headline; PLP H1 = category name; PDP H1 = product name.
2. **Two-tone headings:** first phrase `ink`, accent phrase `primary-700` (reference signature). Max one accent phrase per heading.
3. **Eyebrows** precede every section H2: yellow dash (24×2 px) + uppercase label.
4. Body measure ≤ 65 characters; paragraph spacing 12–16 px.
5. Prices: `Inter 600`, tabular numerals; compare-at price `text-muted` with line-through.
6. Buttons: Poppins 600, 15 px, never all-caps except `Micro/Badge`-level chips.
7. Text never set in `accent-500` on light backgrounds (§4.4).

---

## 6. Spacing System

### 6.1 Base scale (4 px grid)

| Token | px | Typical use |
|---|---|---|
| `space-1` | 4 | Icon-to-label, badge padding |
| `space-2` | 8 | Chip gaps, tight stacks |
| `space-3` | 12 | Input inner padding, list gaps |
| `space-4` | 16 | Card padding, mobile gutter, grid gap (mobile) |
| `space-5` | 20 | Tablet grid gap |
| `space-6` | 24 | Desktop grid gap, card padding (large) |
| `space-8` | 32 | Component group gaps |
| `space-10` | 40 | Desktop page gutter |
| `space-12` | 48 | Mobile section rhythm |
| `space-16` | 64 | Tablet section rhythm / hero internal |
| `space-20` | 80 | Desktop sub-sections |
| `space-24` | 96 | Desktop section rhythm (default) |
| `space-30` | 120 | Major section rhythm (home bands) |

### 6.2 Section rhythm

| Breakpoint | Vertical padding between sections |
|---|---|
| Desktop ≥1024 | 96 px (120 px for home major bands) |
| Tablet 768–1023 | 72 px |
| Mobile ≤767 | 48–64 px |

### 6.3 Container & grid

| | Desktop | Tablet | Mobile |
|---|---|---|---|
| Max content width | **1280 px** (1200 content + 40 gutters) | 100% − 48 px | 100% − 32 px |
| Columns | 12 | 8 | 4 |
| Gutter | 24 | 20 | 16 |
| Page gutter | 40 | 24 | 16 |

At 1920: container stays 1280 and centers (rule 15 — design must not stretch).

---

---

## 7. Component Design Guidelines

### 7.1 Universal rules

1. **Radius system (DS-DEC-01):**
   - **0 px** — cards, panels, image plates, inputs, textareas, selects, badges, chips(non-interactive), modals, drawers, tables, pagination, qty stepper, section containers.
   - **Pill (9999 px)** — action buttons, filter chips, tabs (interactive selectors only).
   - **Circle** — icon-only buttons, avatars, carousel arrows, logo monogram.
2. **No borders on cards/panels.** Separation comes from surface color (`white` on `#F5F6F6` bands, or `#F5F6F6` plates on white). Hairline `#E5E5E5` dividers allowed **only** inside tables, lists, and form groups.
3. **No shadows** except: modal/dialog (`0 16px 40px rgba(10,10,10,0.18)`) and toast (`0 8px 24px rgba(10,10,10,0.12)`). Cards, buttons, images: none.
4. **No gradients** anywhere (plan §8.1, rule 14).
5. **Focus:** 2 px `primary-700` outline, 2 px offset — on green surfaces, 2 px `accent-500` outline (A11Y-02).
6. **Touch targets ≥ 44×44 px** on mobile (A11Y-10, RESP-09).
7. **States are mandatory** for every interactive component: Default · Hover · Active/Pressed · Focus · Disabled · Loading (where async) · Error (inputs).
8. **No hover-only functionality** — every hover affordance has a tap/keyboard equivalent (RESP-10).
9. **Imagery:** product photos 1:1 on `surface-light`; PDP gallery 4:5; hero/category cards 4:3; `object-fit: cover`; explicit aspect-ratio reserved (PERF-11); meaningful alt text (A11Y-07).
10. **Icons:** outline style, 1.75 px stroke, 20/24 px grid, `currentColor` (one icon set — e.g., Lucide/Feather). No filled multicolor icons.
11. **Copy in components** is real seed copy — never lorem ipsum (FR-CUS-01 AC, R11).

### 7.2 Badge / chip

| Variant | Style |
|---|---|
| Discount badge (`50% OFF`) | 0 px, `primary-700` fill, white `Micro/Badge`, padding 6×10 — top-left of image plate |
| Count chip (`2,500+ Items`) | 0 px, white fill, `text-body`, `Micro/Badge`, padding 8×12 |
| Stock/status badge | 0 px, semantic pair from §4.3, text + icon, padding 6×10 |
| Filter chip (active) | Pill, `primary-100` fill, `primary-700` text, × remove icon |
| Role/order status badge | 0 px, semantic pair, uppercase `Micro/Badge` |

### 7.3 Modal / dialog

0 px corners, white, max-width 480 (confirm) / 720 (size guide), padding 32, overlay `rgba(10,10,10,0.5)`, focus-trapped, `Esc` closes, focus returns to trigger (A11Y-06). Title H3 + body + right-aligned action row (ghost secondary + pill primary).

### 7.4 Toast

Bottom-right (desktop) / top-center (mobile), 0 px, white, shadow token allowed, icon + message, auto-dismiss 4 s, `aria-live="polite"` (A11Y-12). Variants: success (green icon) · error (red icon) · info (gray).

### 7.5 Skeletons & empty/error states

- **Skeleton:** `#EDEDED` blocks matching final layout, subtle shimmer 1.4 s; used for grids, lists, dashboard widgets (plan §8.5).
- **Empty state:** centered icon + H3 + one sentence + pill CTA (e.g., "Nothing here yet → Continue shopping").
- **Error state:** icon + message + pill **Retry** button; shell still renders (FR-GEN-04).

---

## 8. Button Variants

All buttons: Poppins 600, 15 px, height by size, pill radius (DS-DEC-01), 16 px horizontal padding min, icon gap 8 px, transition 150 ms ease-out.

### 8.1 Hierarchy table

| Variant | Style | Usage |
|---|---|---|
| **Primary** | `primary-700` fill · white text · hover `primary-800` · active `primary-900` | Add to cart, Place order, Save, Submit — one per view |
| **Secondary** | white fill · `ink` text · 1 px `line-strong` outline · hover `surface-light` | Continue shopping, View all, secondary confirmations |
| **Ghost** | transparent · `primary-700` text · hover `primary-100` fill | Text-link actions, table row actions, "View All Products" (matches ref's underlined link: ghost variant with 1 px underline offset 4) |
| **Danger** | `error-700` fill · white text · hover `#941B13` | Refund, Archive, Block — always behind a confirm dialog |
| **Icon (circle)** | Circle 44/40/36 px · white fill · `line-strong` outline · icon 20 px · hover `primary-700` fill + white icon | Carousel arrows, back-to-top, gallery prev/next (ref signature: one green-filled "next" state allowed for hero carousel) |
| **Icon (square)** | 0 px · 44×44 · transparent · hover `surface-light` | Header utilities (search, account, cart), table utilities |
| **Pill chip / tab** | Interactive chips & tabs — see §8.3 | Filters, home tabs |

### 8.2 Sizes

| Size | Height | Padding X | Font | Use |
|---|---|---|---|---|
| L | 52 | 28 | 15/600 | Hero CTA, checkout Place order, PDP add-to-cart |
| M | 44 | 22 | 15/600 | Default (forms, dialogs) |
| S | 36 | 16 | 14/600 | Inline/table actions, chip buttons |
| Full | 52 | — | 15/600 | Full-width (mobile PDP sticky bar, auth submit) |

### 8.3 Tabs & chips (interactive pills)

- **Inactive:** white fill, `ink` text, 1 px `line` outline, pill.
- **Active:** `primary-700` fill, white text, no outline (reference pattern).
- **Focus:** 2 px `primary-700` outline + 2 px offset.
- Height 44; horizontal scroll allowed on mobile with fade edge.

### 8.4 Button rules

1. Exactly **one primary button per view section**; everything else secondary/ghost.
2. Destructive actions never default-focused; always confirmed (UX-DEC-09 pattern).
3. Loading state: label → spinner + same width (no layout shift); disabled = 40% opacity + `not-allowed`.
4. Icon+text buttons: icon only when it aids scanning (arrow on CTAs per reference).

---

## 9. Input Field Variants

### 9.1 Anatomy (top label pattern)

```
Label (Inter 500, 14, ink) *
[ Input: 0 px · 1 px line-strong border · white fill · 48 h · 16 px pad ]
Helper / error text (Inter 400, 13)
```

- **No floating labels, no placeholder-as-label** (placeholders show format examples only: `ABCDE1234F` style hints where useful).
- Required: `*` in `error-700` after label + `aria-required`.
- Focus: border `primary-700` + 2 px outline offset (no glow).
- Error: border `error-700`, helper text `error-700` with ⚠ icon, `aria-describedby`, input keeps typed value (ERR-08).
- Success (async checks, e.g., email): border `primary-700` + ✓ helper (only where meaningful).
- Disabled: fill `surface-light`, text `text-muted`, no pointer.

### 9.2 Variants table

| Variant | Height | Notes |
|---|---|---|
| Text / email / password | 48 | Password: eye toggle (square icon button), show/hide |
| Textarea | min 120 | Same rules; vertical resize |
| Select (native-styled) | 48 | 0 px, custom chevron; used for country/state, sort |
| Search | 48 | 0 px input + square green submit icon; header variant expands per §11.3 |
| Qty stepper | 44 | 0 px group: − | value | + ; square ± buttons, `surface-light` fill; bounds 1…min(stock,10) (DEC-15b); aria-live value |
| Checkbox | 20×20 | 0 px box, `primary-700` checked, 44 px hit area |
| Radio | 20×20 | 0 px (square) per radius system; same hit area |
| Price range (min/max) | 48 | Two inputs + divider; clamps `0 ≤ min ≤ max` (CF-04) |
| Color swatch | 32 circle | Circle = shape; selected = 2 px `ink` ring + 2 px offset gap |
| Size tile | min 44×44 | 0 px, 1 px `line-strong`; selected = 2 px `primary-700` border + `primary-100` fill; sold-out = line-through + `text-muted` + not-allowed |

### 9.3 Input rules

1. Every input has a programmatic label (A11Y-03).
2. Errors are inline, per-field, announced — never a single summary replacing fields.
3. Validation timing: on blur + on submit; never wipe the form on failure (BR-30).
4. Field width: forms max 480; checkout address grid 2-up (state/ZIP) ≥768.
5. Currency inputs show `$` prefix; quantities are integers only.

---

## 10. Product Card Design

### 10.1 Anatomy (V1 — desktop grid tile)

```
┌───────────────────────────────┐  ← 0 px, no border, no shadow
│ [50% OFF]                     │  ← discount badge (only if compare-at price exists)
│                               │
│      (product photo 1:1)      │  ← surface-light plate, cover, aspect-ratio reserved
│                               │
├───────────────────────────────┤
│ Chair              $89.00     │  ← row 1: category label (muted 13) · price (Inter 600 17 ink)
│ Wooden Sofa Chair             │  ← row 2: name (Inter 600 16 ink, 2-line clamp)
│ $120.00  (compare-at muted    │  ← row 3 (only when discount): current emphasized in badge;
│          line-through)        │      compare-at shown line-through muted beside name-row price
└───────────────────────────────┘
```

| Slot | V1 content | Deferred slot (not rendered in V1) |
|---|---|---|
| Image plate | 1:1 photo, `surface-light` | — |
| Top-left badge | `50% OFF` computed from compare-at (green fill) | — |
| Top-right column | *empty* | **Heart (V1.5)** · quick-add (permanently excluded, UX-DEC-03) |
| Row 1 | Category label + price | **★ rating (V1.5)** — rating slot reverts to right side then |
| Row 2 | Product name | — |
| Row 3 | Compare-at strike (when discounted) | — |
| Bottom bar | *none* | Countdown (excluded, DS-DEC-02) |

### 10.2 States

| State | Behavior |
|---|---|
| Default | As above |
| Hover (desktop) | Image scales 1.03 (300 ms ease-out, overflow hidden); name → `primary-700`; **no shadow, no lift** (rule 9/10) |
| Focus-visible | 2 px `primary-700` outline on the tile (whole card is one link) |
| Sold out | Image at 60% opacity + `Sold out` status badge (text, not color-only); price still shown; card still opens PDP |
| Loading | Skeleton: image block + two text bars |
| Unavailable (archived mid-session) | Card removed on refresh; direct URL → 404 |

### 10.3 Grid placement

- Desktop home/PLP: **4-up** (1280 container, 24 gap); with filter rail: **3-up**.
- Tablet: **3-up** (PLP 2-up with rail collapsed).
- Mobile: **2-up**, 16 gap (image plate + text padding 12).
- Cards link to `/products/:slug`; add-to-cart exists **only on PDP** (FR-CUS-03, UX-DEC-03).

---

## 11. Navigation Design

### 11.1 Announcement bar (all breakpoints)

- Height 40 (36 mobile, single line, truncate-safe), fill `primary-700`, white Inter 400/14.
- **Left:** `Call us: +1 (555) 012-3456` (fictional brand copy). **Center:** `Free shipping on orders over $180` — links to `/shipping-policy` (DEC-05 dependent; wording adjusts with approved shipping method). Underlined link styled `accent-500` text? ❌ — yellow text on green fails contrast; instead: **white text + white underline**, yellow reserved for the dash motif. (Yellow-on-green contrast: 8.8:1 white vs green fine; yellow #F2B808 on #06571D ≈ 5.9:1 — actually passes AA. Decision: promo link in `accent-500` with underline on the **green bar only** (passes AA), white elsewhere.)
- Right: empty in V1 (social icons excluded, DS-DEC-05).
- Tablet/mobile: message only, centered.

### 11.2 Header (desktop ≥1024)

- White, height 72, **sticky** (UX-DEC-16): on scroll > 80 px → height 60 + 1 px `line` bottom border (transition 200 ms). No shadow.
- Zones: **left** logo lockup (→ `/`) · **center** nav: `Home` + category links (4–5, from data) + `Support` · **right** utilities: search (square icon → expands to 280 px inline field on click/focus, UX-DEC-11) · account (icon → login or account menu) · cart (icon + **square** count badge, `primary-700` fill, white 11 px; updates without reload, FR-CUS-10; no layout shift).
- Current route indicated: nav link `primary-700` + 2 px yellow underline bar (accent used as indicator).
- **No** wishlist icon, no Blog/About/Contact (C5), no dropdown mega-menu (categories are single-level → links go straight to PLP).
- Keyboard: full tab order, skip-to-content link first (A11Y-08).

### 11.3 Search

- Desktop: icon → inline expanding field (280 px) with green square submit; **Enter submits to `/search?q=`** (no autocomplete dropdown in V1 — not in SRS; DS-DEC-16).
- Mobile: search icon in header opens the drawer's search row (full-width field, auto-focus) → results page.

### 11.4 Mobile header (≤767)

- Height 60, white: logo left · right: search icon, cart icon + badge, hamburger (all ≥ 44×44).
- **Drawer:** full-height white panel from left (0 px radius), slide 250 ms; rows: search field → Home → category links (H4, stacked) → divider → Account/Sign in → Support; footer row with policy links. Focus-trapped, `Esc` closes, focus returns (A11Y-06).
- Cart never hidden inside the drawer (USER_FLOWS §8.3).

### 11.5 Breadcrumbs

Home › Category › Product (desktop, `Body/Small`, `text-muted`, separators `/`, current = ink). Hidden on mobile PDP (replaced by back arrow + category name).

### 11.6 In-page navigation

- **PLP:** desktop left filter rail (280 px) · mobile = `Filter` / `Sort` buttons opening **bottom sheets** (UX-DEC-04).
- **Account:** left rail (desktop) / horizontal scrollable tabs (mobile).
- **Admin:** left sidebar (§19 D).
- **Checkout:** 3-step indicator — square step markers (0 px): done = green fill ✓ · current = green outline + green number · upcoming = `line` outline + muted number; labels: `1 Address · 2 Shipping · 3 Payment` (UX-DEC-15).

---

## 12. Footer Design

> Ref A's footer is not visible in the screenshot; structure follows `USER_FLOWS.md` §8.4, density follows Ref B. **Recommendation: dark-green footer** (bookends the green announcement bar — the reference's own top-bar logic) — confirm via [DS-DEC-14](#21-unresolved-design-decisions-ds-dec).

### 12.1 Structure (desktop)

```
[ fill primary-700 · white text · section padding 80/40 ]
┌─────────────┬──────────────┬──────────────┬──────────────┐
│ Shoply.     │ Shop         │ Help         │ Legal        │
│ (white       │ · category   │ · Support    │ · Privacy    │
│  lockup)    │   links (4–5)│ · Shipping   │ · Terms      │
│ One-line    │ · New        │ · Returns    │              │
│ brand blurb │   Arrivals   │   policy     │  [payment    │
│ (max 240px) │              │              │   marks row] │
├─────────────┴──────────────┴──────────────┴──────────────┤
│ © 2026 Shoply. Fictional brand for portfolio demo.       │
└───────────────────────────────────────────────────────────┘
```

- Columns: 4 (desktop) → 2 (tablet) → stacked accordions or plain stack (mobile).
- Links: white 80% opacity → white + `accent-500` underline on hover; focus 2 px `accent-500`.
- **Excluded in V1:** social icons (C10), newsletter/email capture (email V2), Blog, wishlist, promotions (UX-DEC-13).
- Payment marks: card badges row (Visa/MC/Amex/Discover as static marks — Stripe test mode accepts them) at 24 px height, 70% white opacity.
- Above footer on home only: optional **feature strip** (Ref B pattern): 3 items — secure payment · free shipping over $180 · easy returns — white band, icon + one-liner. (Links to policy pages.)

### 12.2 Footer rules

- Only routes that exist may be linked (FR-CUS-10 AC: footer links resolve).
- Footer identical across storefront pages; admin console has **no** storefront footer (FR-ADM-01).

---

---

## 13. Responsive Breakpoints

Per SRS §25. Mobile-first (RESP-01); larger breakpoints enhance, never repair.

| Name | Width | Role |
|---|---|---|
| **XS** | **375** | Authoring base (iPhone-class). Supported minimum |
| **SM** | **768** | Tablet portrait — start of admin support (RESP-06) |
| **MD** | **1024** | Tablet landscape / small laptop — PDP two-column begins (RESP-04), filter rail appears |
| **LG** | **1440** | Design reference width — full desktop composition (Figma master frames) |
| **XL** | **1920** | Container caps at 1280 and centers; no stretching |

Rules: no horizontal scrolling at any width (RESP-02) · typography/spacing scale only via §5/§6 tokens (RESP-07) · images keep reserved aspect ratios everywhere (RESP-08) · tap targets ≥ 44 px (RESP-09) · no hover-only functionality (RESP-10).

---

## 14. Desktop Layout Specifications (≥1024 · master @1440)

### 14.1 Global shell

| Zone | Spec |
|---|---|
| Announcement bar | Full-bleed `primary-700`, 40 h, container-aligned content |
| Header | 72 h (sticky → 60), container 1280, three zones: logo 200 · nav centered · utilities ~200 |
| Main | Container 1280, section bands full-bleed alternating `white` / `surface-light` |
| Section rhythm | 96 px (major home bands 120) |
| Footer | Full-bleed `primary-700`, inner container 1280 |

### 14.2 Home (FR-CUS-01) — module order

| # | Module | Layout spec |
|---|---|---|
| 1 | **Hero** | Band `surface-light`, min-h 560; grid 55/45 (gap 48). **Left:** pill badge (white, icon + `The everyday essentials store`) → H1 64/700 two-tone ("Built for **every day, made to last**" — final copy TBD) → `Body/Large` gray subcopy (max 460 w) → row: L pill primary CTA (arrow icon) + ghost underlined `View all products` → avatar stack (4× 40 circles, −12 overlap, `accent-500` "+" circle) + `Loved by 1,000+ customers` / `Free returns within 30 days`-style honest line (DS-DEC-03). **Right:** horizontal card track (cards 300×380, 2.5 visible, gap 24): category card = photo 4:3 + name + `2,500+ Items` count chip + green circular arrow (bottom-right overlap); below track: circular prev (white/outline) + next (`primary-700`) arrows. Dot-grid decoration (8×4 dots, `line` color) top-right of band, static |
| 2 | **USP bar** | White band, 96 h, 3 columns (gap 40): circle icon (56, `primary-100` fill, green icon) + title (H4) + subtext (`Body/Small` muted) |
| 3 | **Category showcase** | Band `surface-light`, asymmetric grid: **left card 1fr (tall, spans 2 rows)** + **right column 1fr (2 stacked)**, gap 24, card min-h 320/220. Card = `white`, 0 px: count chip top-left → H3 title → ghost `Shop now →` link → product cutout image anchored bottom-right (60% width). No subcategory lists (C6) |
| 4 | **Shop by category** (Ref B tile grid) | White band; eyebrow + two-tone H2; 4–5 tiles (gap 24): image 4:3 plate + name bar below (H4) + item count muted |
| 5 | **Products** | White band; centered eyebrow (yellow dash + `OUR PRODUCTS`) + two-tone H2; pill tab row (centered): `New Arrivals` (active, green) · `Featured` · `Best Sellers` (rule-driven, DEC-24); 4-up grid (gap 24, rows 8) per §10; bottom: secondary `View all products` button centered |
| 6 | **Feature strip** (home only) | `surface-light` band, 3 items (Ref B feature-card pattern): icon + title + one-liner → policy pages |
| 7 | **Footer** | §12 |

### 14.3 PLP / search results (FR-CUS-02, FR-SRCH-01…06)

- Breadcrumb → H1 (category name) + result count (`Body/Small` muted) → toolbar row (left: active filter chips; right: sort select) → content grid.
- **With rail:** grid `280px | 1fr` gap 32; product grid **3-up**.
- **Search results / no filter:** full-width grid **4-up**.
- Filter rail groups (Ref B sidebar): Category · Size · Color · Price range — group titles `Label` uppercase muted, options as checkbox rows (44 hit area); `Clear all` ghost link; rail sticky (top 100).
- Sort select: Newest (default) · Price low→high · Price high→low · Name A–Z (whitelist, FR-SRCH-03).
- Pagination: square buttons 40×40, current = `primary-700` fill/white, others white/`line` border (radius system: pagination is square).
- Filter/sort/page state lives in the URL (FR-SRCH-05).

### 14.4 PDP (FR-CUS-03) — two-column ≥1024 (RESP-04)

- Grid `55 | 45` gap 48 (left `1fr`, right `1fr` min 440).
- **Left:** main gallery image 4:5 (0 px, `surface-light` plate) + thumbnail column 72 px squares left of main (or row beneath — recommend **row beneath**, 5 thumbs, 72×72, active = 2 px `primary-700` border); image counter chip `1/5`.
- **Right (stack, gap 20):** breadcrumb (mobile only; desktop starts with category label muted) → category label → **H1** product name (H2 size 28–32) → price row: current price `Price/Hero` + compare-at muted strike + `SAVE 20%` badge (green) → `Body/Base` short description → **color** row (label + 32 px circle swatches) → **size** row (label + `Size guide` ghost link right → dialog, UX-DEC-12/DEC-21; tiles 44 min, per §9.2) → stock status (DEC-16: `In stock` green · `Only N left` amber badge · `Sold out` gray — always with text) → row: qty stepper (44) + **Add to cart** (L pill, flex-1, arrow icon) → delivery info block (Ref B pattern): 3 rows icon + text (`Free shipping over $180`, `Delivery 3–5 business days`, `Free returns within 30 days`) linking to policies (wording follows DEC-05/DEC-25) → accordion: `Description & materials` / `Shipping & returns` (0 px, hairline top/bottom, +/− icon).
- Below (full width): **no related-products row** (C8/DS-DEC-10).
- Feedback on add: toast success + cart badge pop (FR-NTF-04).

### 14.5 Cart (FR-CART-*) — dedicated page (UX-DEC-10)

- Grid `1fr | 380` gap 32. **Left:** H1 `Shopping cart` + N items; line rows (grid: 96×96 image plate · name/options/price stack · qty stepper · line total · remove icon-button) separated by hairlines; unavailable lines: grayed + `Unavailable` badge + `Remove` (checkout blocked until removed). **Right:** summary card (`surface-light`, 0 px, padding 24): Subtotal row · Shipping row (hidden until checkout) · Total row (H4) → primary `Proceed to checkout` full-width → ghost `Continue shopping` → trust line (lock icon + `Secure checkout · Stripe`).
- Empty state: icon + `Your cart is empty` + primary `Browse products`.

### 14.6 Checkout (FR-CHK-*, UX-DEC-15 stepped)

- Grid `1fr | 400` gap 40; summary card **sticky** (top 100).
- **Left:** step indicator (§11.6) → step panels:
  - **Step 1 Address:** guest = form (full name, email, address line 1, line 2, city, state select, ZIP, country select US) · account = saved-address radio list + `Add new address` → primary `Continue to shipping`.
  - **Step 2 Shipping:** method radio cards (0 px, `surface-light`, selected = 2 px `primary-700`): name + window + price (content from approved DEC-05; e.g., Standard 3–5 days $5.95 / free ≥ $100, Express 1–2 days $14.95) → back ghost + primary `Continue to payment`.
  - **Step 3 Payment:** hosted Stripe element (iframe — our styles frame it with 0 px input rules) + order note `Test mode — use card 4242…` → primary `Place order · $X.XX`.
- **Right summary (persistent, all steps):** line items (thumb 48, name, qty × price) · `Subtotal` · `Shipping — <method>` · `Estimated tax` (label per DEC-04) · hairline · **`Total` H4** · lock microcopy. All costs visible before payment (BR-21).
- Stock/`409` failure: inline error banner at top of panel (`error-100`, message + `Go to cart` link); entered data preserved (BR-30).

### 14.7 Order confirmation (FR-NTF-01)

- Centered max 720: green circle ✓ (96) → H1 `Thank you — order confirmed` → order number chip (`SHOP-YYYYMMDD-XXXX`, `surface-light` plate, copy button) → summary card: items · totals · shipping method · **delivery estimate window** (from DEC-05) → primary `Track order` + secondary `Continue shopping` → guest-only panel (`surface-light`): `Create an account to track this order` + pre-filled email + primary button + ghost `No thanks` (FR-CUS-07).

### 14.8 Account area (FR-CUS-04…06)

- Grid `240 | 1fr` gap 40. Left rail: nav items (Account overview · Orders · Addresses · Profile) 0 px rows, active = `primary-100` fill + green text; logout ghost at bottom.
- **Overview:** greeting H2 + 3 stat cards (orders count, default address, member since) + `View orders` primary.
- **Orders:** table (white, 0 px, hairline rows): Order · Date · Status badge (semantic) · Total · `View` ghost. Status badges per §4.3.
- **Order detail:** H2 order number + status badge → items table · totals · address snapshot card · payment row · **status timeline** (vertical: green dots + timestamps for entered states only, FR-ORD-09) → `Cancel order` danger-ghost button **only when PENDING** (CF-16) → confirm dialog states consequences (UX-DEC-09).
- **Addresses:** card grid 2-up (0 px white cards on band): label, address, `Default` green chip, edit/delete icon-buttons; `Add address` primary; max-20 and default-handling messages inline.
- **Profile:** form max 480: name (email read-only per DEC-20) · change-password group (current/new/confirm) → primary `Save`.

### 14.9 Auth pages

- Full-height `surface-light` band, centered card 440 (white, 0 px, padding 40): lockup → H2 (`Sign in` / `Create account`) → fields → primary full-width submit → divider `or` → ghost link row (`Create account` / `Sign in instead`). Password rules helper under register fields; rate-limit and generic-error banners (`error-100`) per CF-06/CF-07. Support link: `Forgot password?` → `/support` (V1, CF-08).

### 14.10 Support & policy pages

- Prose layout: container 720, H1 + updated-date muted + H2/H3 sections (`Body/Large`), left rail of in-page anchors (desktop). Content = approved static copy (DEC-25) — no invented legal text beyond short honest drafts flagged for review.

### 14.11 404

- Centered: oversized `404` (Display, `surface-light` fill effect via color only), H2 `Page not found`, primary `Browse products`, ghost `Back home`.

---

## 15. Tablet Layout Specifications (768–1023)

| View | Adaptation |
|---|---|
| Global | Container 100%−48; section rhythm 72; H1 48 / H2 32 |
| Header | Nav collapses to drawer at ≤1023 (same as mobile pattern) but logo+utilities remain inline; announcement message centered |
| Hero | Stacks: text block full-width (H1 48, CTA row) then category-card track below (2.2 cards visible); dot-grid retained |
| USP bar | 3 columns compressed (icon 48, title H4, subtext Body/Small); stacks to 1-col only <768 |
| Category showcase | Asymmetric grid retained (it is 2-column by nature) — left tall + right stack; card padding 20 |
| Shop-by-category tiles | 3-up (5th wraps) |
| Product grid | 3-up home / 2-up PLP (rail hidden → `Filter` sheet button appears at <1024) |
| PLP | Rail → bottom sheet trigger; sort = sheet (UX-DEC-04) |
| PDP | **Stacks** (RESP-04: two-col only ≥1024): gallery (thumbs row beneath) → details full-width; sticky bottom ATC bar appears ≤1023 for consistency with mobile |
| Cart | Single column; summary below list (RESP-05) |
| Checkout | Single column; summary collapses to top (order lines) with totals always visible |
| Account | Rail → horizontal tabs |
| Admin | **Supported ≥768** (RESP-06): sidebar collapses to icon rail 64; tables scroll horizontally inside container (page never scrolls sideways) |
| Footer | 2-column link grid |

---

## 16. Mobile Layout Specifications (≤767 · authored @375)

### 16.1 Global

- Container 100%−32; section rhythm 48–64; H1 36 / H2 28 / H3 20.
- Announcement: 36 h, single centered message (truncate with title attr if needed).
- Header 60 h (§11.4) · drawer navigation · cart badge always visible.
- All tap targets ≥ 44×44 (A11Y-10); no horizontal page scroll (RESP-02).

### 16.2 Home

1. Hero: badge → H1 36 two-tone → subcopy → **full-width** primary CTA (52) + centered ghost link → avatar stack row (smaller, 32 px) + proof line → category-card track (cards 240×300, swipe, 1.6 visible; circular arrows hidden — swipe suffices, dots indicator below).
2. USP bar: horizontally scrollable row of 3 (snap) or stacked 1-col — recommend **stacked** (only 3 items, avoids hidden content).
3. Category showcase: all cards stacked full-width (left-tall card first), image 16:10, count chip + H3 + link.
4. Shop by category: 2-up grid.
5. Products: eyebrow + H2 centered → tabs horizontally scrollable (fade edge) → **2-up** grid → full-width secondary `View all`.
6. Feature strip: stacked rows.
7. Footer: stacked columns (plain lists, no accordions — simpler and accessible).

### 16.3 PLP

- H1 + count → sticky sub-toolbar: `Filter` (opens bottom sheet: groups per rail + `Apply`/`Clear all`) and `Sort` (sheet with radio list) — sheets are 0 px, focus-trapped (UX-DEC-04).
- Active filter chips row (scrollable).
- Grid 2-up → pagination squares centered.

### 16.4 PDP (RESP-04)

- Gallery: full-width 4:5 main, thumb dots/row beneath, swipe between images.
- Details stacked: category → H1 → price row → description → color → size (+ size guide link) → stock → qty + **sticky bottom bar** (fixed, white, hairline top, shadow allowed for overlay): price left + `Add to cart` pill (flex) right; bar appears after main CTA scrolls out; respects `env(safe-area-inset-bottom)`.
- Delivery block + accordions full-width.

### 16.5 Cart / checkout / confirmation

- Cart: line rows stack (image left, details right; qty + total row below); summary card full-width; CTA full-width.
- Checkout: steps indicator compact (numbers only + labels 12 px); each step one column; **summary shows as collapsible header block always exposing `Total`** (RESP-05 — totals never hidden); sticky bottom bar with `Total` + primary action on payment step.
- Confirmation: centered, full-width buttons.

### 16.6 Account / auth

- Account: horizontal scroll tabs; tables → **card lists** (each row a 0 px card: status + order no. top, date/total middle, `View` link).
- Auth: full-bleed card (no side margins), padding 24.

### 16.7 Admin on mobile

Not a target (admin usable ≥768, RESP-06): at 768 sidebar = icon rail; tables scroll in container; dialogs full-width minus 16.

---

---

## 17. Accessibility Requirements

Target: **WCAG 2.1 AA** (SRS §24). Design-level rules — implementation must verify each (A11Y-01…14).

### 17.1 Contrast (A11Y-04)

| Requirement | Value |
|---|---|
| Normal text ≥ 4.5:1 | Verified pairs in §4.4 (all pass) |
| Large text / UI components ≥ 3:1 | Focus rings, borders, icons verified |
| Forbidden | `accent-500` text on light surfaces; white text on `surface-light`; muted text under 13 px on gray |

### 17.2 Keyboard & focus (A11Y-01, 02, 06, 08)

- Every action reachable/operable by keyboard: nav, drawer, tabs, gallery, variant pickers, steppers, sheets, dialogs, checkout.
- **Focus indicator always visible:** 2 px `primary-700` + 2 px offset; on green surfaces 2 px `accent-500`. Never `outline: none` without replacement.
- Dialogs/drawers/sheets: focus trapped while open, `Esc` closes, focus returns to trigger.
- Skip-to-content link as first tabbable element; landmarks `header/nav/main/footer` (A11Y-08).
- Tab order follows visual order; no positive `tabindex`.

### 17.3 Content & semantics (A11Y-03, 05, 07, 09, 12)

- One `h1` per page; logical heading tree (A11Y-09).
- Every input: programmatic label; errors `aria-describedby` + announced (A11Y-03).
- **Status never color-only:** stock, order status, form errors always carry text/icon (A11Y-05) — enforced by §4.3 badge table.
- Product images: meaningful alt (`"Navid wool coat, charcoal, front view"`); decorative dots/icons `aria-hidden` (A11Y-07).
- Live regions: cart-added toast, error banners, result counts — `polite`, no focus theft (A11Y-12).
- Link purpose clear out of context (no bare "Click here").

### 17.4 Targets, zoom, motion (A11Y-10, 11, 13; RESP-09)

- Interactive targets ≥ 44×44 px with ≥ 8 px spacing on variant/qty controls.
- Layouts usable at 200% zoom without loss of content/function (fluid containers, no fixed-height text boxes).
- `prefers-reduced-motion: reduce` → disable transforms/parallax/scale; keep opacity/color ≤ 100 ms (§18.4).
- Admin panel meets the same bar — tables, filters, dialogs (A11Y-14).

### 17.5 Forms (checkout, auth, admin)

- Error summary pattern on failed submit: banner + per-field errors (never summary-only).
- Autocomplete attributes designed for: `name`, `email`, `street-address`, `postal-code`, `cc-*` is provider-owned.
- Guest checkout never requires account creation (persona Daniel; BR-30).

### 17.6 Design QA checklist (per screen, before build)

- [ ] Contrast table pairs only · [ ] Focus ring visible on every interactive · [ ] Targets ≥ 44 px · [ ] Status = text+color · [ ] Alt text drafted · [ ] Heading order · [ ] Reduced-motion variant · [ ] Empty/loading/error states present · [ ] No hover-only affordance · [ ] Copy is real (no lorem).

---

## 18. Animation Guidelines

### 18.1 Principles

Micro-interactions, not decoration (plan §8.5). Motion exists to explain state change, preserve context, and confirm actions — never to entertain. Reference aesthetic = calm; nothing moves without user action except skeletons.

### 18.2 Tokens

| Token | Value | Use |
|---|---|---|
| `dur-fast` | **120 ms** | Color/border changes, hover tints, focus |
| `dur-base` | **180 ms** | Buttons, chips, image zoom (plan: 150–200 ms) |
| `dur-slow` | **250 ms** | Drawer/sheet slide, sticky header resize, accordion |
| `ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Entrances, slides |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | State morphs, header |
| `ease-emphasis` | `cubic-bezier(0.34, 1.2, 0.64, 1)` | Badge pop only (single use) |

### 18.3 Approved micro-interactions

| Where | Motion |
|---|---|
| Button hover/active | Background `dur-base` ease-out; arrow icon translateX 4 px on primary hover |
| Product card hover | Image scale 1.03 `dur-base` (container overflow hidden, no shadow); name → green |
| Cart badge update | Pop: scale 1 → 1.15 → 1, 240 ms `ease-emphasis`; count increments without layout shift (FR-CUS-10 AC) |
| Add-to-cart confirm | Toast slide-up 250 ms + badge pop (FR-NTF-04) |
| Drawer / bottom sheet | Translate 100%→0, 250 ms `ease-out`; overlay fade 180 ms |
| Sticky header | Height 72→60, 200 ms `ease-in-out`; border appears (no shadow) |
| Tabs | Active fill color 180 ms; content swap = instant or 150 ms opacity |
| Gallery | Image crossfade 150 ms; thumb border 120 ms |
| Accordion | Height 250 ms `ease-out` + chevron rotate 180° |
| Skeletons | Shimmer sweep 1.4 s linear infinite (opacity only) |
| Step indicator | Completed check draws (stroke) 250 ms on transition |
| Toast | In 250 ms / out 200 ms; auto-dismiss 4000 ms |

### 18.4 Reduced motion (A11Y-11)

Under `prefers-reduced-motion: reduce`: no scale/translate/slide/stagger; drawers and sheets appear with ≤100 ms opacity; skeletons static fill; badge pop → instant count change; all state colors/borders retained.

### 18.5 Prohibited

Parallax · scroll-jacking · autoplaying carousels (hero track = manual/swipe only) · entrance animations on scroll for every element · cursor followers · animated gradients (no gradients at all) · springy overshoot anywhere except the badge pop · loading spinners as the *only* loading state · motion longer than 300 ms for routine interactions.

---

---

## 19. Page-by-Page Design Requirements

All 35 V1 pages from `USER_FLOWS.md` §9. Detailed layouts for the **eight key views** live in §14 (home, listing, PDP, cart, checkout, confirmation, account, admin dashboard); this section adds page-specific modules, states, and auth notes. Every page includes: loading skeleton, empty state (with action), error state (with retry) per FR-GEN-04/FR-SRCH-06 — the **States matrix** in §19.E defines the pattern once.

**Auth legend:** `Public` · `Guest-ok` · `Customer` · `STAFF+` · `ADMIN`.

### 19.A Storefront

| # | Page | Route | Design spec | States (beyond global) | Refs |
|---|---|---|---|---|---|
| 1 | **Home** | `/` | §14.2 seven-module order; two-tone H1; asymmetric showcase; tabbed products | Module-level skeleton; per-module error with Retry (shell renders); archived card → 404 on click | FR-CUS-01 |
| 2 | **Category listing** | `/category/:slug` | §14.3; H1 = category name; count; rail + 3-up (desktop) | Zero published products → empty state with links to other categories; page beyond last → empty page + nav (EC-26) | FR-CUS-02 |
| 3 | **Search results** | `/search?q=` | Same grid; H1 `Results for "…"`; active-query chip; query+filters+page in URL | No matches → empty naming the query + `Clear search` + category shortcuts; <2 chars client-blocked | FR-SRCH-01/06 |
| 4 | **Product detail** | `/products/:slug` | §14.4; gallery 4:5, variant pickers, stock states, sticky ATC mobile | Sold-out state (ATC disabled + badge); 409 stock banner on add; unknown slug → 404 | FR-CUS-03, DEC-16 |
| 5 | **Size guide** | *(dialog on PDP)* | Global chart dialog 720: table of size ↔ measurements, `Body/Base`; note text slot (DEC-21) | Chart missing → text fallback | FR-CUS-09, DEC-21 |
| 6 | **Cart** | `/cart` | §14.5; line rows + sticky summary | Empty → empty state; unavailable line flagged + checkout blocked; price-change notice chip | FR-CART-02…06 |
| 7 | **Checkout** | `/checkout` | §14.6 stepped (UX-DEC-15); persistent summary; all costs pre-payment | Guard redirect when empty; `409 INSUFFICIENT_STOCK` banner (names lines, cart intact); invalid field errors keep input; session expiry → login, restore (EC-22) | FR-CHK-01…07 |
| 8 | **Payment step** | `/checkout/payment` | Hosted Stripe element framed by our input tokens; test-mode notice; `Place order · $total` | Decline → error banner, order stays PENDING, retry (DEC-03); processing → button loading state; 3DS handled in iframe | FR-PAY-01…06 |
| 9 | **Order confirmation** | `/checkout/confirmation/:no` | §14.7; order-number chip w/ copy; delivery window; guest account prompt | Refresh pre-confirmation → waiting state (not success); expired link → login prompt | FR-NTF-01, FR-CUS-07 |
| 14 | **404** | `*` | §14.11 | Always available with catalog recovery link | FR-GEN-04 |

### 19.B Auth & static pages (all `Public`)

| # | Page | Route | Design spec | Refs |
|---|---|---|---|---|
| 10 | Login | `/login` | §14.9 card; email+password; `Forgot password?` link → `/support`; generic error banner (no enumeration); lockout banner with retry timing | FR-AUTH-02/08 |
| 11 | Register | `/register` | Card; password rules helper (≥8, letter+number); confirm field; duplicate-email inline error + `Sign in instead` | FR-AUTH-01/07 |
| 12 | Forgot password | `/forgot-password` | **V1 = redirect/landing → `/support`** with one-line explanation (CF-08). No email UI, no fake success | FR-AUTH-06 (V1.5) |
| 13 | Support | `/support` | Prose + contact block (email/phone, fictional); password-reset guidance section; hours | plan §2.8, DEC-18 |
| 15–18 | Shipping / Returns / Privacy / Terms | `/…-policy` | §14.10 prose template; short honest drafts flagged for review (DEC-25); linked from footer & delivery block | FR-CUS-08 |

### 19.C Account (`Customer` — unauthenticated → `/login` with destination preserved)

| # | Page | Route | Design spec | States / refs |
|---|---|---|---|---|
| 19 | Account overview | `/account` | §14.8; greeting + 3 stat cards + shortcuts | Empty (no orders) → card with `Start shopping` CTA |
| 20 | Profile | `/account/profile` | Name editable; **email read-only** (DEC-20); change-password group | Inline field errors; success toast; sessions-invalidated notice |
| 21 | Addresses | `/account/addresses` | 2-up card grid; default chip; add/edit dialog (0 px) | Limit-20 message; delete-default handling (BR-15); delete confirms orders keep snapshots (BR-16) |
| 22 | Order list | `/account/orders` | Table: order · date · status badge · total · View; newest first, paginated | No orders → empty state; status badge = text+color (§4.3) |
| 23 | Order detail | `/account/orders/:no` | §14.8: items, totals, address/payment snapshot, status timeline (entered states only); `Cancel order` **only when PENDING** → confirm dialog (UX-DEC-09) | Foreign order → 404 (no leak); already-final → button absent + API 409 message pattern |

### 19.D Admin console (`STAFF+` / `ADMIN`)

**Admin shell (FR-ADM-01):** separate surface, **never renders storefront chrome**.

| Zone | Spec |
|---|---|
| Sidebar | 240 px, fill `primary-700`, white text; lockup (white) top; items 44 h: Dashboard · Products · Inventory · Orders · **Categories** · **Customers** · **Settings** (bold = ADMIN-only — **not rendered for STAFF**); active = `primary-800` fill + 3 px `accent-500` left bar; logout bottom. Collapses to 64 px icon rail at 768–1023 (RESP-06) |
| Topbar | 64 h white: page title (H3) left; right = `View storefront` ghost link + user chip (avatar square 32 + name + role `Micro/Badge`) |
| Content | `surface-light`, padding 32, fluid (max 1440); page header pattern = H2 + muted description + right-aligned primary action |
| Density | Rows 48; text 14 (Inter); inputs/controls 40 h (compact vs storefront 48) |
| Components | KPI card (white, 0 px, pad 24: muted label · number Inter 600/32 · delta chip) · data table (white, hairline rows, sticky header, status badges, ghost row actions) · filter bar (white, 40 h controls, chips for active filters) · confirm dialog (states side effects: refund amount, stock) · toasts |
| Login | `/admin/login`: `surface-light` full-screen, centered card 400: monogram + `Shoply Admin` chip; same credential rules as storefront (CF/AF-01) |
| Role rules | Refund/cancel-paid/publish/archive/category/customer/settings = ADMIN; STAFF sees buttons **absent** and endpoints 403 (design never shows unavailable actions) |

| # | Page | Route | Design spec | States / refs |
|---|---|---|---|---|
| 24 | Admin login | `/admin/login` | Shell above | Generic error · lockout · `CUSTOMER` → 403 view w/ storefront link |
| 25 | **Dashboard** | `/admin` | §19.D shell + date segmented control (7/30/90, square, active green; default 30; URL-persisted) → 4 KPI cards (Revenue · Orders · AOV · Low stock) → 2-col: Recent orders (table, 10) \| right stack: Top products (5, units+revenue) + Low-stock SKUs (links to inventory) | Empty range → `No orders in this period` empty state; AOV `—` at zero; **per-widget** error+Retry (FR-ADM-02) |
| 26 | Product list | `/admin/products` | Filter bar (search, status, category) + table (thumb 40, name, category, price, status badge, total stock, actions: Edit · Publish *(ADMIN)* · Archive *(ADMIN)*) + `New product` primary | No products → empty + `New product`; search miss → clear-filters |
| 27 | Product create | `/admin/products/new` | §19.D form pattern: main card (name, slug auto+editable, description, category select, price, compare-at) + side card (status radios, **image dropzone**: dashed 1px `line-strong` control inside card, 1–8 thumbs, ≤5 MB jpg/png/webp, primary star, reorder, DEC-27) + variants table (size/color/SKU/price override/stock, add/remove rows; vocab per DEC-15d) + sticky action bar: `Save draft` ghost · `Publish` primary (ADMIN only; STAFF → no publish control) | Validation errors inline; duplicate SKU/slug → field error; publish blocked without ≥1 variant+image |
| 28 | Product edit | `/admin/products/:id/edit` | Same + status banner (DRAFT/PUBLISHED/ARCHIVED) + `Archive` danger-ghost (ADMIN, confirm warns pending orders, DEC-12); archived → read-only view | `409` optimistic-lock → banner `Reload to edit latest` |
| 29 | Inventory | `/admin/inventory` | Filter row (search name/SKU, category, status, **Low stock only** toggle ≤ threshold DEC-13) + table (product, options, SKU, stock w/ status badge, updated, `Adjust`) + adjust dialog (set/delta radios, qty, reason required for reductions, **resulting-stock preview**, negative → block BR-34) | Zero rows → empty; adjustment success → row highlight + ledger note |
| 30 | Order list | `/admin/orders` | Filter bar: status chips (multi), date range, search order/email; URL-persisted; table (no., date, customer, items, total, status badge, View); paginated | Empty filtered → clear-filters action |
| 31 | Order detail | `/admin/orders/:id` | Header (order no + status badge + **only legal transitions** as buttons: green forward actions, danger-ghost refund/cancel with confirm dialog listing side effects) + 2-col: items table (snapshots) \| stacked cards: customer, address snapshot, payment (amount/method/refund state), shipping (method; carrier+tracking inputs appear at `PROCESSING→SHIPPED`, DEC-07) + status history table (actor/time/note) | Illegal transition never offered; refund fail → error toast, state unchanged (EC-17); STAFF on admin-only action → control absent |
| 32 | Categories | `/admin/categories` | Table (name, slug, product count, order, Edit/Archive) + side panel form (name 2–60 unique, slug unique); single-level only (DEC-15a) | Archive with products → `409` explain count; duplicate → field error |
| 33 | Customer list | `/admin/customers` | Table (name, email, joined, orders, status badge) + search | Empty search → clear |
| 34 | Customer detail | `/admin/customers/:id` | Profile card + addresses (read-only) + orders table + actions: `Block`/`Unblock` (confirm: pending-order warning) + role select (confirm; last-admin guard error message design) | Self-demotion/last-admin → error banner text |
| 35 | Settings | `/admin/settings` | **Likely out of V1 (DEC-26 — config file).** If approved: form cards — Store info (name, support contact), Shipping methods (rows matching DEC-05), Tax rate, Low-stock threshold → `Save` primary | Only designed if DEC-26 approves |

**Deferred pages — NOT designed in V1** (no placeholders, UX-DEC-13): `/account/wishlist` (V1.5) · reviews section on PDP (V1.5) · `/admin/promotions` (V1.5) · `/admin/analytics` (V2). Component slots documented in §20 for later.

### 19.E States matrix (applies to every page)

| View type | Loading | Empty | Error |
|---|---|---|---|
| List/grid (PLP, orders, admin tables) | Skeleton matching row/card layout | Icon + H3 + sentence + pill CTA | Message + `Retry`; shell remains |
| Detail (PDP, order, customer) | Skeleton (image plate + text bars) | n/a (404 for missing) | Inline banner + Retry |
| Form (auth, checkout, admin) | Submit → button loading (width held) | n/a | Field errors inline; server errors banner; input preserved (ERR-08, BR-30) |
| Dashboard widgets | Per-widget skeletons | `No data in range` text (not fake zeros) | Per-widget error + Retry (FR-ADM-02) |
| Cart/checkout guards | — | Redirect with explanation | `409` banners name the cause + recovery action |

### 19.F Copy rules for all pages

- Real seed copy only — no lorem ipsum anywhere (FR-CUS-01 AC, risk R11).
- Headings follow the two-tone pattern (§5.3) on marketing surfaces; admin/account headings plain ink.
- Every CTA leads to a valid route (FR-CUS-01 AC); no "coming soon" (UX-DEC-13).
- USD formatting `$1,234.56`; dates `MMM D, YYYY`; order numbers `SHOP-YYYYMMDD-XXXX` (DEC-17).

---

---

## 20. Figma Component Organization

### 20.1 File structure (one file: `Shoply — Design System v1.0`)

| Page | Contents |
|---|---|
| **00 · Cover** | Lockup, version, date, status stamp, reference thumbnails (Ref A/Ref B) |
| **01 · Foundations** | Color variables board · type scale specimen (all 12 tokens at 3 sizes) · spacing scale visual · radius system diagram (0 / pill / circle) · iconography set (1.75 stroke) · imagery rules (aspect-ratio plates) · do/don't board (§3.3) |
| **02 · Components** | All components below, organized in labeled sections with variants + states |
| **03 · Storefront** | High-fidelity screens: Home · PLP (rail) · PLP (search) · PDP · Cart · 404 · Support/Policies |
| **04 · Checkout & Auth** | Checkout steps 1–3 · Payment · Confirmation · Login · Register · Support-fallback |
| **05 · Account** | Overview · Orders · Order detail (+ cancel dialog) · Addresses · Profile |
| **06 · Admin** | Shell · Dashboard · Product list · Product editor · Inventory (+ adjust dialog) · Orders · Order detail (+ transition confirms) · Categories · Customers · Settings (if approved) |
| **07 · States** | Loading/empty/error exemplars per pattern (§19.E), toasts, banners, 404, 403, lockout |
| **08 · Responsive** | Duplicates of key screens at **375 / 768 / 1024** (1440 masters live on 03–06) |
| **09 · Archive** | Superseded explorations (kept, clearly marked) |

### 20.2 Naming conventions

- **Components:** `Category/Name` — `Button/Primary`, `Button/Icon-Circle`, `Input/Text`, `Card/Product`, `Card/Category`, `Badge/Discount`, `Nav/Header`, `Footer/Main`, `Modal/Confirm`, `Toast/Success`, `Skeleton/Card`, `State/Empty`.
- **Component properties (variants):** `Size = S | M | L` · `State = Default | Hover | Active | Focus | Disabled | Loading` (interactive) · `Type = Primary | Secondary | Ghost | Danger` (buttons) · `Error = True | False` (inputs) · `Breakpoint = Desktop | Tablet | Mobile` (composites where needed).
- **Styles/variables:** `Color/…` (§4.5) · `Text/Heading-H1` … `Text/Price-Card` · `Space/6` … · `Radius/None|Pill|Circle` · `Motion/Base|Fast|Slow` (duration/easing tokens as number vars).
- **Layers:** semantic names (`hero/cta-primary`, `pdp/gallery/thumbs`) — never `Frame 247`.

### 20.3 Construction rules

1. **Auto Layout everywhere**; padding/gap values from §6 scale only.
2. **No detached components** on screens; overrides via variants/props only (plan §8.6).
3. **Grid:** frame 1440 with 12-col grid, 1280 container, 40 margins, 24 gutter; tablet frames 8-col; mobile 4-col (16 gutters).
4. **Masters at 1440**; responsive copies at 1024/768/375 on page 08 — same components, re-stacked (proves §13–§16).
5. **States kit:** every interactive component ships the full state row from §7.1 #7 on page 02.
6. **Real content:** all frames use final-style seed copy and real product names/prices from the seed catalog — no `Lorem` (risk R11).
7. **Accessibility annotations:** layer notes for alt text, aria labels, focus order on key screens; contrast pairs pre-verified (§4.4).
8. **Icons:** single library, 24 px grid, 1.75 stroke; never mixed styles.

### 20.4 Prototype (minimum flows to wire)

1. Home → category → PDP → add to cart → cart → checkout steps → payment (test) → confirmation.
2. Search + filter → PDP; mobile drawer → category.
3. Login (guest cart merge) → checkout resume.
4. Admin: login → dashboard → product create → publish → storefront visibility; order detail transition dialog.
5. Dialogs: size guide, cancel-order confirm, archive confirm.

### 20.5 Handoff package (what the build reads from Figma)

- Variables exported as the **Tailwind token seed**: `colors` (§4), `fontSize` (§5), `spacing` (§6), `borderRadius` (0 / pill / circle), `transitionDuration` (§18.2).
- Component inventory (§20.2) = build checklist; screens = acceptance reference for the eight key views (plan §8 deliverable).
- Screenshot-based visual QA: pixel-compare each built screen against its Figma frame before moving on (risk R10).

---

## 21. Unresolved Design Decisions (DS-DEC)

**(A) decisions to approve before Figma build · (B) lower-stakes, defaults stated · (C) carry-forward from other docs**

### 21.1 (A) Blocking the Figma build

| ID | Question | Recommendation | Alternative |
|---|---|---|---|
| **DS-DEC-01** | Radius collision: Ref A rounds cards ~16 px; your rules demand square cards + minimal radius | **Cards/panels/inputs/badges 0 px; pill only on buttons/chips/tabs; circles for icon actions** (§7.1) | All-rectangular buttons (4 px) — closer to "everything square", further from reference |
| **DS-DEC-02** | Ref shows countdown timers (cards + deal blocks) | **Omit in V1** — no sale-end field in SRS; discount badges (from compare-at price) carry the promo feel | Add `saleEndsAt` to SRS/schema (scope change) |
| **DS-DEC-03** | Ref shows ★ ratings + "4.9 Ratings+" | **No stars in V1** (reviews V1.5); hero keeps avatar stack with honest static proof line | Hide proof block entirely |
| **DS-DEC-04** | Announcement bar content (ref shows 25%-off signup) | **Free-shipping message + phone** — links to shipping policy; no coupon code (coupons V1.5) | Single centered message only |
| **DS-DEC-06** | Hero CTA target (carries UX-DEC-01) | **Curated/new-arrivals collection** view | A single category |
| **DS-DEC-08** | Nav items: ref has Blog/About/Contact — none exist in the 35-page inventory | **Home + 4–5 category links + Support**; About/Contact/Blog not designed | Add an About page (scope addition) |
| **DS-DEC-14** | Footer color (ref footer not visible) | **Dark green `primary-700`** — bookends the green announcement bar | Light `surface-light` footer (airier, closer to Ref A's light bands) |
| **DS-DEC-15** | Admin console sidebar color | **Dark green sidebar** (brand continuity, Ref B's green chrome adapted) | Neutral white sidebar with green active states |

### 21.2 (B) Lower-stakes (defaults apply unless you object)

| ID | Question | Default |
|---|---|---|
| DS-DEC-05 | Social icons in announcement/footer | **Omitted** (no real destinations; no dead links) |
| DS-DEC-07 | Home tab set | **New Arrivals · Featured · Best Sellers** (rule-driven per DEC-24; "All Products" optional) |
| DS-DEC-09 | Category showcase content | **Count chip + image + Shop-now link** (no subcategory lists — DEC-15a) |
| DS-DEC-10 | PDP related-products row | **Omitted** (recommendations excluded, SRS §3.2) |
| DS-DEC-11 | Checkout summary lines | Items · Shipping · **Estimated** tax · Total — wording follows approved DEC-04/DEC-05 |
| DS-DEC-12 | Yellow usage | Accent only (dash, indicator, badge fill with dark text, link-on-green); never text on white |
| DS-DEC-13 | Fonts | **Poppins 600/700 + Inter 400/500/600** (Google Fonts; matches reference geometry) |
| DS-DEC-16 | Search suggestions | **No autocomplete in V1** (not specified in SRS); Enter → results page |
| DS-DEC-17 | Logo lockup | Circle monogram `S` + `Shoply` wordmark with **green period** (mirrors reference construction) |
| DS-DEC-18 | Admin density | 48 px rows / 14 px text / 40 px controls (compact vs storefront 48) |

### 21.3 (C) Carry-forward (defined elsewhere; Figma draws per their outcome)

| Source | Impact on Figma |
|---|---|
| **DEC-01…05** (SRS §33, blocking) | Checkout summary, shipping-method cards, tax line, payment/expiry messaging — drawn with recommended values, adjustable |
| **DEC-07** | Order-detail carrier/tracking inputs at `SHIPPED` |
| **DEC-13 / DEC-15b** | Low-stock threshold (5) and qty cap (10) shown in copy/UI limits |
| **DEC-16** | Stock badge thresholds (`Only N left` when N ≤ 5) |
| **DEC-17** | Order-number format in chips/tables |
| **DEC-21** | Size-guide dialog content (global chart) |
| **DEC-24** | Home modules rule-driven (no admin merchandising UI) |
| **DEC-25 / DEC-26** | Policy pages in V1; Settings page likely dropped |
| **UX-DEC-01…16** (`USER_FLOWS.md` §12.2) | Already applied throughout this spec (stepped checkout, bottom-sheet filters, dedicated cart page, sticky header, no quick-add, archive-restore, etc.) |

---

## 22. Recommended Design Direction & Approval

### 22.1 The direction in one paragraph

**Shoply adopts Reference A pixel-for-pixel in structure and palette** — sampled dark green `#06571D` for every primary action and brand surface, sampled yellow `#F2B808` as punctuation, white ↔ `#F5F6F6` alternating bands, Poppins display over Inter body, the asymmetric hero (text | category-card track), the asymmetric category showcase, USP bar, eyebrow + two-tone headings, pill tabs over a 4-up product grid — **with your square-card rule applied as the one systematic override**: cards, panels, inputs and badges are 0 px and borderless, while pills survive only on buttons, chips and tabs, and circles on icon actions. Reference B contributes **structure only** (filter sidebar, tabbed rows, category tiles, stock/qty/delivery PDP patterns, footer density, admin chrome) while its brighter green, red prices, brands, stats, coupons, countdowns and related-products are excluded. Deferred features (wishlist, reviews, coupons, email) render **nothing** in V1 — the design looks finished because it *is* finished at its scope, not because it fakes more.

### 22.2 What gets built in Figma after approval

1. **Foundations page** — color/type/spacing/radius/motion tokens (exportable to Tailwind).
2. **Component library** — buttons, inputs, badges, chips/tabs, product & category cards, nav, footer, dialogs, toasts, skeletons, states (per plan §8 inventory: button/input/select/badge/card/product tile/nav/footer/modal/toast).
3. **High-fidelity screens** — the eight key views (home, listing, PDP, cart, checkout, confirmation, account, admin dashboard) at 1440 + responsive copies at 1024/768/375, plus auth, support, 404, and the admin console set.
4. **Prototype** — two wired flows (shopper purchase path; admin product-publish path).

### 22.3 ❓ Approval required

**Please review `docs/UI_UX_DESIGN_SPEC.md` and respond with one of:**

1. ✅ **Approve** — reference analysis, tokens, components, layouts, page requirements, Figma plan, and all DS-DEC recommendations accepted → I proceed to **building the Figma file** (still no application code).
2. ✅ **Approve with changes** — name the section or `DS-DEC-*` items to change.
3. ❌ **Reject** — tell me which part of the direction does not match your vision.

**Minimum decisions to start Figma:** **DS-DEC-01** (square cards + pill actions), **DS-DEC-02** (no countdown), **DS-DEC-06** (hero CTA target), **DS-DEC-08** (nav items), **DS-DEC-14** (footer color) — plus carry-forward **DEC-01…DEC-05** if you want the checkout summary drawn with final shipping/tax wording.

*No application code has been written. No existing document was modified.*

