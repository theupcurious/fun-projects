# Vibe — Design Language Prompt Generator

**Date:** 2026-03-20
**Status:** Plan
**Purpose:** Portfolio showcase for Upcurious — solves a real problem in vibe-coded projects where AI models default to the same generic aesthetic (Inter, blue-purple gradients, white rounded cards).
**Product stance:** Practical creative tool. The primary output is a copy-paste prompt that encodes a complete design language for AI coding assistants. The preview is a confidence-builder, not the deliverable.
**Deploy target:** Vercel

---

## Problem

When developers use AI coding tools (Cursor, Claude, ChatGPT, Copilot) to build websites and apps, the visual output converges on a narrow default aesthetic:

- Inter or system sans-serif
- Blue-to-purple gradient accents
- Rounded white cards on light gray backgrounds
- Generous padding, soft shadows, muted neutrals
- The same button styles, the same hero layout, the same card grid

This happens because models optimize for "safe and professional" when no design direction is given. The result is a sea of sites that look AI-generated in the same way.

**Vibe** solves this by helping users define a distinctive design language across color, typography, style, and component treatment — then generating a structured prompt they can paste into any AI coding session to override the defaults.

---

## Concept

A single-page tool with three stages:

1. **Define** — Pick a starting mood, then customize colors, fonts, spacing, and component style
2. **Preview** — See the design language applied to a realistic page template in real time
3. **Export** — Copy a structured prompt that encodes the full design language for AI tools

The tool is opinionated about what dimensions matter (the ones AI models tend to flatten) and practical about the output (a prompt, not a design system repo).

---

## Product Scope

### MVP goal

Ship a tool that:

- lets a user define a complete design language in under 2 minutes
- shows a live preview of that language on a realistic template
- generates a well-structured prompt ready for Cursor, Claude, or ChatGPT
- feels polished enough to stand alone as a portfolio piece
- works entirely client-side with no backend

### Explicit non-goals for v1

- full design system generation (tokens, Figma export, Storybook)
- CSS/Tailwind config file export (prompt-only for v1)
- AI-powered suggestions ("generate a palette for me")
- URL import ("extract design language from this site")
- multiple template previews (one strong template is enough)
- dual-theme editing with separate light and dark token sets
- user accounts or saved configurations beyond localStorage

---

## Design Language Dimensions

These are the axes where AI models tend to flatten toward defaults. Each one gets a control in the tool.

### 1. Mood / Starting Point

Pre-built presets that set all dimensions at once as a starting point:

| Preset | Character | Example reference |
|--------|-----------|-------------------|
| **Brutalist** | Raw, high-contrast, monospace, sharp edges | Craigslist meets Virgil Abloh |
| **Editorial** | Serif-forward, generous whitespace, magazine-like | Stripe Press, The Outline |
| **Playful** | Rounded, colorful, bouncy, illustration-friendly | Linear marketing, Notion |
| **Luxury** | Dark, tight spacing, refined serif, gold/cream accents | Aesop, Bottega Veneta |
| **Retro** | Pixel fonts or vintage type, warm colors, texture | Poolsuite, Teenage Engineering |
| **Minimal** | Restrained palette, clean sans-serif, lots of air | Apple, Rauno's site |
| **Dashboard** | Dense, functional, data-forward, neutral | Vercel dashboard, Linear app |
| **Organic** | Warm tones, natural textures, rounded but not bubbly | Patagonia, Aesop |

Selecting a preset populates all controls below. Everything remains editable.

### 2. Color Palette

| Token | Purpose | Control |
|-------|---------|---------|
| **Primary** | Brand color, CTAs, key interactive elements | Color picker |
| **Secondary** | Supporting accent, secondary actions | Color picker |
| **Accent** | Highlights, badges, small pops of energy | Color picker |
| **Background** | Page background | Color picker |
| **Surface** | Cards, panels, elevated elements | Color picker |
| **Text** | Primary body text | Color picker |
| **Text muted** | Secondary text, captions | Color picker |
| **Border** | Dividers, card borders, input outlines | Color picker |

Palette harmony is not fully enforced, but the tool should protect basic usability:

- warn when text/background or text/surface contrast falls below a minimum threshold
- warn when background and surface are too close to read as separate layers
- block export only if the preview becomes clearly unreadable

The goal is not to police taste; it is to stop obviously broken prompt outputs.

### 3. Typography

| Token | Control | Source |
|-------|---------|--------|
| **Heading font** | Searchable dropdown | Curated local catalog |
| **Body font** | Searchable dropdown | Curated local catalog |
| **Mono font** | Searchable dropdown (optional) | Curated local catalog |
| **Heading weight** | Slider: 300–900 | — |
| **Body size base** | Slider: 14–20px | — |
| **Heading style** | Toggle: normal / italic / uppercase | — |
| **Letter spacing** | Slider: tight / normal / wide | — |

### 4. Shape & Spacing

| Token | Control |
|-------|---------|
| **Border radius** | Slider: 0 (sharp) → 24px (pill) |
| **Spacing density** | Compact / Default / Generous |
| **Shadow style** | None / Subtle / Elevated / Dramatic |
| **Border weight** | None / Hairline / Medium / Heavy |

### 5. Component Style

| Token | Control |
|-------|---------|
| **Button style** | Filled / Outline / Ghost / Underline |
| **Card style** | Flat / Bordered / Elevated / Glass |
| **Input style** | Underline / Bordered / Filled |
| **Link treatment** | Underline / Color-only / Arrow |

### 6. Theme Mode

| Option | Effect |
|--------|--------|
| **Light** | Preview renders in light mode |
| **Dark** | Preview renders in dark mode |

For v1, the tool edits one theme at a time. Supporting parallel light and dark token sets is deferred until there is a clear derivation or editing model.

---

## Preview Template

The preview shows a single realistic page template that exercises all the design language tokens. It should look like a plausible landing page, not a component catalog.

### Template structure

```text
┌─────────────────────────────────────────────────┐
│  Nav:  Logo    Links...            [CTA Button] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Hero:                                          │
│    Large heading (heading font + weight)         │
│    Subheading paragraph (body font)             │
│    [Primary Button]  [Secondary Button]         │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Feature Cards (3-up grid):                     │
│    ┌──────┐  ┌──────┐  ┌──────┐                │
│    │ Icon │  │ Icon │  │ Icon │                 │
│    │Title │  │Title │  │Title │                 │
│    │ Text │  │ Text │  │ Text │                 │
│    └──────┘  └──────┘  └──────┘                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Testimonial / Quote:                           │
│    "Quote text in body font italic"             │
│    — Author name                                │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  CTA Section:                                   │
│    Heading + input + button                     │
│                                                 │
├─────────────────────────────────────────────────┤
│  Footer:  Links   •   Muted text               │
│                                                 │
└─────────────────────────────────────────────────┘
```

This exercises: heading font, body font, buttons (filled + outline), cards, inputs, links, spacing, borders, shadows, background/surface contrast, and text hierarchy.

---

## Prompt Output

The generated prompt is the core deliverable. It should be:

- structured enough that AI models parse it reliably
- human-readable so users can tweak it
- platform-agnostic (works in Cursor, Claude, ChatGPT, etc.)
- opinionated about the dimensions that matter

### Example output

```markdown
## Design Language

Use this design language for all UI work in this project. Do not fall back to default styles.

### Color Palette
- Primary: #E63946 (warm red)
- Secondary: #457B9D (steel blue)
- Accent: #F4A261 (amber)
- Background: #1D3557 (deep navy)
- Surface: #264573 (lighter navy)
- Text: #F1FAEE (off-white)
- Text muted: #A8DADC (pale teal)
- Border: #2E4A6E (muted navy)

### Typography
- Heading font: "Playfair Display" (Google Fonts), weight 700
- Body font: "Source Sans 3" (Google Fonts), weight 400, size base 16px
- Mono font: "JetBrains Mono" (Google Fonts)
- Heading style: normal case, letter-spacing -0.02em
- Body letter-spacing: normal

### Shape & Spacing
- Border radius: 4px (slightly rounded, not pill-shaped)
- Spacing: generous (prefer breathing room between sections)
- Shadows: subtle (0 1px 3px rgba(0,0,0,0.12))
- Borders: hairline (1px solid)

### Component Style
- Buttons: filled with primary color, no border radius on hover state change
- Cards: bordered with surface background, no shadow
- Inputs: bordered, surface background, bottom-border focus indicator
- Links: underline style, primary color on hover

### Dark Mode
This is a dark-mode-first design. Light mode is not needed.

### Overall Aesthetic
Editorial and refined. Think Stripe Press: confident serif headings,
clean sans-serif body, generous whitespace, restrained color use with
one warm accent. Avoid rounded/playful elements. Prefer sharp, intentional
composition over soft gradients.
```

### Prompt format options

The user can choose:

- **Markdown** (default) — works in most AI tools
- **System prompt** — wrapped as a system instruction
- **Cursor rules** — formatted as a `.cursorrules` file

---

## UX Flow

### Step 1: Pick a mood

Full-width grid of preset cards. Each card shows a tiny preview swatch (palette + type sample) and a one-word name. Clicking a preset populates all controls and jumps to the customization panel.

A "Start from scratch" option begins with neutral defaults.

### Step 2: Customize

Split layout:

- **Left panel (40%):** Controls organized by section (Color, Typography, Shape, Components, Theme). Collapsible sections, all visible on desktop. Scrollable on mobile.
- **Right panel (60%):** Live preview template that updates as controls change.

Every control change updates the preview instantly via CSS custom properties.

### Step 3: Export

A sticky bottom bar with:

- "Copy Prompt" button — copies the generated prompt to clipboard
- Format selector — Markdown / System Prompt / Cursor Rules
- "Reset" — return to defaults
- "Share" — generates a URL with the configuration encoded in the hash (no backend needed)

---

## Tech Stack

| Layer        | Choice                          | Why                                      |
|--------------|----------------------------------|------------------------------------------|
| Framework    | Next.js 15 (static export)       | Matches portfolio stack, no server needed |
| Styling      | Tailwind CSS                     | Fast iteration, matches stack            |
| Components   | shadcn/ui (select, slider, popover, button, tabs) | Good control primitives |
| Color picker | react-colorful                   | Lightweight, accessible, no dependencies |
| Font loading | Curated Google Fonts list + dynamic link injection | Real fonts without remote search complexity |
| State        | React useState + URL hash sync   | Simple, shareable, no backend            |
| Deploy       | Vercel (static)                  | Zero-cost, instant                       |

### Fonts (for the tool itself, not the preview)

- Display: **Space Grotesk**
- Body: **Inter** (acceptable here — it's the tool chrome, not the output)

---

## File Structure

```text
vibe/
├── app/
│   ├── layout.tsx                 # Root layout, tool fonts, meta tags
│   └── page.tsx                   # Main page — orchestrates panels
├── components/
│   ├── mood-picker.tsx            # Preset grid for step 1
│   ├── controls/
│   │   ├── color-section.tsx      # Color palette controls
│   │   ├── typography-section.tsx  # Font pickers, weight, size
│   │   ├── shape-section.tsx      # Radius, spacing, shadow, border
│   │   ├── component-section.tsx  # Button, card, input, link styles
│   │   └── theme-section.tsx      # Light / dark selector
│   ├── preview/
│   │   ├── preview-frame.tsx      # Container with CSS custom properties
│   │   ├── preview-nav.tsx        # Template nav bar
│   │   ├── preview-hero.tsx       # Template hero section
│   │   ├── preview-cards.tsx      # Template feature cards
│   │   ├── preview-quote.tsx      # Template testimonial
│   │   ├── preview-cta.tsx        # Template CTA section
│   │   └── preview-footer.tsx     # Template footer
│   ├── export-bar.tsx             # Bottom bar with copy + format selector
│   └── font-loader.tsx            # Dynamic font link injection for selected curated fonts
├── lib/
│   ├── presets.ts                 # Mood preset definitions
│   ├── prompt-generator.ts        # Turns config into prompt text
│   ├── types.ts                   # DesignLanguage type definition
│   ├── url-state.ts               # Encode/decode config to URL hash
│   ├── fonts.ts                   # Curated font catalog + metadata
│   └── contrast.ts                # Preview/readability guardrails
├── public/
│   └── og-image.png               # OG image for the tool itself
├── package.json
├── tailwind.config.ts
├── next.config.ts                 # Static export config
└── PLAN.md
```

---

## Implementation Steps

### Phase 1: Design language model + presets (1-2 hours)

1. **Scaffold** — `npx create-next-app` with TypeScript + Tailwind + App Router
2. **`types.ts`** — `DesignLanguage` type covering all dimensions
3. **`presets.ts`** — 6-8 mood presets with fully populated values
4. **`prompt-generator.ts`** — converts `DesignLanguage` → formatted prompt string (Markdown, system prompt, Cursor rules)
5. **`url-state.ts`** — encode/decode `DesignLanguage` to URL hash for sharing
6. **`contrast.ts`** — contrast checks and preview warnings for clearly broken palettes

### Phase 2: Controls panel (2-3 hours)

7. **`mood-picker.tsx`** — preset card grid with visual swatches
8. **`color-section.tsx`** — 8 color pickers with token labels + contrast warnings
9. **`typography-section.tsx`** — font dropdowns from a curated catalog, weight slider, size slider, style toggles
10. **`shape-section.tsx`** — radius slider, spacing radio, shadow radio, border radio
11. **`component-section.tsx`** — button/card/input/link style selectors
12. **`theme-section.tsx`** — light/dark selector
13. **`font-loader.tsx`** — injects font `<link>` tags dynamically based on selected curated fonts

### Phase 3: Live preview template (2-3 hours)

14. **`preview-frame.tsx`** — maps `DesignLanguage` to CSS custom properties on a container
15. **`preview-nav.tsx`** — nav bar with logo text, links, CTA button
16. **`preview-hero.tsx`** — large heading, paragraph, two buttons
17. **`preview-cards.tsx`** — 3-up feature card grid
18. **`preview-quote.tsx`** — testimonial block
19. **`preview-cta.tsx`** — email input + submit button
20. **`preview-footer.tsx`** — footer links and muted text

### Phase 4: Export + polish (2-3 hours)

21. **`export-bar.tsx`** — copy button, format selector, reset, share URL
22. **Page assembly** — split layout with controls left, preview right, export bar bottom
23. **Responsive pass** — stacked layout on mobile (controls above preview, or tabbed)
24. **Empty/initial state** — start with mood picker, then reveal controls + preview
25. **OG tags** — make the tool itself share well
26. **Deploy to Vercel**

---

## Acceptance Criteria

- A user can go from zero to a copied prompt in under 2 minutes
- The preview visually updates in real time as controls change
- The generated prompt is structured enough that AI models follow it reliably
- Mood presets produce visually distinct results (not subtle variations of the same look)
- The tool works entirely client-side with no backend
- Shareable URLs correctly restore the full configuration
- The tool warns when the palette creates unreadable text or insufficient surface contrast
- The tool itself looks portfolio-quality

---

## Design Notes

- The tool chrome should be neutral and minimal so the preview is the star
- Preset swatches need to look dramatically different from each other at a glance
- The preview template should look like a real landing page, not a style guide
- Font loading should feel instant — preload preset fonts and lazy-load only from the curated catalog
- The copy-to-clipboard interaction should feel satisfying (animation, confirmation)
- The prompt output should read well to a human, not just to an AI parser

---

## Potential Enhancements (post-MVP)

- **URL import** — paste a site URL, extract its design language via computed styles
- **AI suggestions** — "describe your brand in a sentence" → AI generates a starting palette
- **Multiple templates** — dashboard, blog, e-commerce, SaaS
- **Tailwind config export** — generate `tailwind.config.ts` alongside the prompt
- **CSS variables export** — copy a `:root {}` block
- **Figma tokens export** — JSON format compatible with Figma Tokens plugin
- **Community gallery** — browse and fork design languages others have created
- **Side-by-side compare** — show the same template with "AI default" vs your design language

---

## Estimated Total Effort

**8-12 hours** from zero to deployed, with the majority of time in the preview template and font loading UX.
