# Upcurious — App Brainstorm

## Current portfolio

| App | Type | What it does |
|-----|------|-------------|
| **Gradient** | Game | Color-perception puzzle — find the odd tile as grids grow and deltas shrink |
| **Vibe** | Tool | Design language generator — pick a mood, tweak tokens, export a prompt for AI tools |
| **OG Previewer** | Tool | Paste a URL, preview its Open Graph card on X / WhatsApp / Slack with diagnostics |

---

## Game ideas

### Refract

A light puzzle game. Direct beams of colored light through prisms, mirrors, and lenses to hit targets. The screen fills with rainbow refractions, bloom effects, and glass caustics — each solved level is essentially a generative art piece. WebGL shaders for light physics, dark background, vivid color. Think Monument Valley energy but with optics.

**Why it works:** Every screenshot is stunning. Puzzle mechanics are timeless and the visual output is inherently shareable.

### Constellation

Connect stars to form constellations against a procedurally generated night sky. Subtle parallax as you pan, stars twinkle with staggered animations, completed constellations glow and label themselves. A meditation game more than a puzzle — timed rounds, share your "sky."

**Why it works:** Deep dark UI with nothing but stars and light. Calming counterpart to Gradient's intensity. Leans into generative visuals.

### Bloom

A generative garden. Each tap plants a seed that grows into a procedurally generated flower or tree based on timing, position, and proximity to other plants. No score, no failure — just a canvas that fills with organic, branching life. L-system algorithms for growth, soft watercolor palette, ambient particle drift. Exportable as a poster.

**Why it works:** The anti-Gradient — no stress, pure visual reward. Output doubles as shareable art.

### Orbit

Launch planets with a flick. They fall into gravitational orbits around a central star, leaving glowing trails. Try to build a stable solar system. When planets collide, they merge with a burst. Neon-on-black, real n-body physics, trails that fade like long-exposure photography.

**Why it works:** Physics sim + beautiful trails = endlessly watchable. Simple input, emergent complexity.

### Typeset

A font identification game. Show a word rendered in a mystery font, pick from 4 choices. Streaks, timed rounds, difficulty ramps with visually similar fonts. Shares the curated font catalog from Vibe.

**Why it works:** Cross-promotes Vibe, reuses existing font data and the Gradient game-loop pattern. Appeals to designers.

### Palette

Show a photograph, recreate its dominant color palette by picking from a color wheel. Scored on delta-E accuracy. Reuses HSL and contrast math from Gradient and Vibe.

**Why it works:** Casual creative gameplay. The photo-to-palette output is inherently beautiful and shareable.

### Kerning

Drag letters to fix bad kerning. Classic design exercise turned into a scored game. Simple mechanic, surprising depth.

**Why it works:** Designers love this. Very shareable scores ("I got 94% kerning accuracy").

---

## Tool ideas

### Specimen

Pick any Google Font, instantly generate a full-page type specimen poster — giant display text, pangrams, character sets, size scales, all with editorial layout. Customizable background and accent color. Export as a high-res PNG.

**Why it works:** Every output is a portfolio-quality design artifact. Builds on font knowledge from Vibe. Designers share these.

### Aurora

Mesh gradient generator. Drag control points to shape flowing, multi-stop gradients that look like northern lights. Animated mode lets them breathe and shift. Layer noise and grain. Preview on mockup templates. Export as CSS, SVG, or PNG.

**Why it works:** The editor itself looks like art. Fills a gap — most gradient tools produce flat, boring output.

### Chromatic

Drop in a photo, extract a color palette rendered as a beautiful print: the image, extracted swatches with hex values, generous whitespace, thoughtful typography. One-click download as a shareable card.

**Why it works:** Output looks like a design agency mood board. Instant shareability.

### Kinetic

Animation curve playground. Draw custom easing functions and see them applied live to diverse animations: a ball bouncing, text revealing, cards fanning, a gradient shifting. Side-by-side curve comparison. Export as CSS cubic-bezier or spring values.

**Why it works:** The tool itself is an animation showreel. Useful for developers, beautiful enough to explore for fun.

### Ship Check

Enter a URL before launch, get a one-page audit: OG tags, favicon, WCAG contrast, meta description length, mobile viewport, broken images. A pre-launch checklist that runs the checks. Natural evolution of OG Previewer.

**Why it works:** Every builder needs it. Extends OG Previewer into broader utility.

### Type Scale

Interactive typography scale calculator. Pick a base size, a ratio (minor third, golden ratio), and a font — see the heading/body hierarchy live. Export as CSS variables or Tailwind config.

**Why it works:** Complements Vibe but focused enough to stand alone. Practical for every new project.

### Stack Card

Paste a `package.json` or repo URL, get a polished shareable image of your tech stack with logos. "Built with Next.js + Tailwind + Supabase" as a beautiful card.

**Why it works:** Developers love sharing their stack. Effortless virality.

---

## Recommended next builds

**If picking one game + one tool:**

- **Refract** — every screenshot is portfolio-grade. Puzzle games have long shelf life.
- **Specimen** — every output is a design artifact that promotes the Upcurious brand. Builds on existing font data from Vibe.

**If optimizing for speed to ship:**

- **Typeset** — reuses Vibe's font catalog, Gradient's game loop pattern, and existing Google Fonts integration.
- **Ship Check** — extends OG Previewer's fetching and parsing into a broader tool with minimal new infra.
