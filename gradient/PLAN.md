# Gradient — Color Perception Game

**Date:** 2026-03-20
**Status:** Plan
**Purpose:** Portfolio demo for GradientMind — demonstrates frontend craft, interaction design, visual polish, and lightweight game feel.
**Product stance:** Demo-first. It does not need to be a tuned competitive game yet, but the core rules should still feel fair and internally consistent.
**Deploy target:** `gradientmind.github.io/gradient` or standalone on Vercel

---

## Concept

A color perception puzzle game. Each round shows a grid of tiles that all look nearly identical, except one is slightly different. Tap the odd one out. As the player progresses, the grid gets denser and the color difference gets subtler.

The game works well as a portfolio piece because the UI itself is the product: color, motion, spacing, and feedback all carry the experience.

The name "Gradient" is a direct play on the GradientMind brand.

---

## Product Scope

### MVP goal

Ship a polished, mobile-friendly single-player demo that:

- feels responsive and satisfying within 30 seconds
- looks visually distinctive enough to stand on its own as a portfolio piece
- uses rules that are easy to understand and hard to exploit
- stores high score locally

### Explicit non-goals for v1

- online leaderboard
- account system
- accessibility calibration for all forms of color vision deficiency
- deep difficulty tuning based on playtesting data
- perfect competitive balance

---

## Core Mechanics

### Gameplay loop

1. Player starts with 3 lives
2. A round shows an N×N grid of tiles in one color family
3. Exactly one tile is the odd tile
4. Player gets one meaningful guess per round
5. Correct tap -> score increases, streak increases, next round loads
6. Wrong tap -> lose 1 life, streak resets, round ends immediately, next round loads if lives remain
7. Game ends when all lives are lost -> show final score + local high score + shareable result

### Fairness rules

- Only the first tile tap counts for scoring and life loss in a round
- After a tap, the grid locks briefly so the player cannot spam guesses
- The odd tile is placed uniformly at random across all grid positions
- A round never uses a color pair that falls below the minimum visible delta threshold defined by the game engine
- Difficulty ramps along one axis at a time where possible: first grid density, then color subtlety

### Difficulty curve

| Level range | Grid size | Target perceptual delta | Notes |
|-------------|-----------|-------------------------|-------|
| 1–5         | 3×3       | Easy                    | teach the mechanic |
| 6–10        | 4×4       | Easy                    | more scanning load |
| 11–15       | 4×4       | Medium                  | color difference tightens |
| 16–20       | 5×5       | Medium                  | density + subtlety |
| 21–30       | 5×5       | Hard                    | requires attention |
| 31+         | 6×6       | Hard floor              | capped so the demo stays fair-ish |

### Color generation

- Use **OKLCH** or another perceptually aware color space for round generation instead of raw HSL lightness deltas
- Generate a base color and one neighboring color with a controlled perceptual distance
- Constrain colors away from extreme near-black and near-white values so contrast remains playable on mobile screens
- Rotate hue family across rounds so screens feel visually varied, but keep saturation/chroma within a stable range
- Provide a small set of manually tested fallback palettes if generated pairs look too ambiguous

### Scoring

- **Base score:** +1 per correct answer
- **Speed bonus:** +0 / +1 / +2 based on response buckets, capped per round
- **Streak bonus:** `floor(streak / 3)`, capped at +3 per round
- **Wrong answer:** no points, lose 1 life, streak resets

This keeps the score readable while avoiding runaway late-game inflation.

---

## Screens & UI

### 1. Start screen

- Game title "Gradient" in a bold display font
- Slow animated gradient atmosphere in the background
- One prominent "Play" button
- Small text explaining the rule: "Find the odd tile before you run out of lives."
- High score display from localStorage
- "by GradientMind" footer link

### 2. Game screen

- Grid of color tiles with rounded corners and clean spacing
- Top bar: score, level, lives
- Optional streak indicator appears when streak >= 3
- Correct tap feedback: brief scale pulse and subtle particle burst in the tapped color
- Wrong tap feedback: short shake and red outline flash, then round transition
- Background color shifts in harmony with the round palette
- Round transitions are quick and smooth, not theatrical

### 3. Game over screen

- Final score
- Stats: level reached, best streak, accuracy percentage
- Shareable result card with score and representative palette
- "Share" button copies image if supported, otherwise share text
- "Play Again" button
- High score update if beaten

---

## Tech Stack

| Layer        | Choice                          | Why                                      |
|--------------|----------------------------------|------------------------------------------|
| Framework    | Next.js 15 (static export)       | Matches GradientMind stack, easy deploy  |
| Styling      | Tailwind CSS                     | Fast iteration, matches stack            |
| Animation    | Framer Motion                    | Smooth UI feedback and transitions       |
| State        | React useReducer                 | Clear state machine for round flow       |
| Color math   | `culori` or lightweight utility  | OKLCH generation and perceptual deltas   |
| Persistence  | localStorage                     | High score and simple settings           |
| Share card   | `html-to-image` or canvas API    | Generate shareable result card           |
| Deploy       | GitHub Pages or Vercel           | Static export, zero-cost friendly        |

### Fonts

- Display: **Space Mono** or **JetBrains Mono**
- Body: **DM Sans**

---

## File Structure

```text
apps/gradient/
├── app/
│   ├── layout.tsx          # Root layout, fonts, meta tags
│   ├── page.tsx            # Start screen
│   └── play/
│       └── page.tsx        # Game screen (client component)
├── components/
│   ├── game-grid.tsx       # The N×N color grid
│   ├── color-tile.tsx      # Individual tile with tap handling
│   ├── score-bar.tsx       # Top bar (score, level, lives)
│   ├── game-over.tsx       # Game over overlay with stats
│   ├── share-card.tsx      # Shareable score card renderer
│   └── gradient-bg.tsx     # Animated background
├── lib/
│   ├── game-engine.ts      # Difficulty, scoring, round progression
│   ├── color-utils.ts      # OKLCH generation and palette guards
│   ├── round-generator.ts  # Tile layout + odd tile placement
│   └── storage.ts          # localStorage helpers
├── public/
│   └── og-image.png        # OG image for social sharing
├── package.json
├── tailwind.config.ts
├── next.config.ts          # Static export config
└── PLAN.md
```

---

## Implementation Steps

### Phase 1: Core game (2-3 hours)

1. **Scaffold** — `npx create-next-app` with TypeScript + Tailwind + App Router
2. **`color-utils.ts`** — functions for base color generation, perceptual delta checks, fallback palette selection, and harmonious background color
3. **`game-engine.ts`** — `getLevel(n)` returns `{ gridSize, difficultyTier }`; `scoreRound(timeMs, streak)` returns bounded score bonuses
4. **`round-generator.ts`** — generates a valid round with one odd tile and a locked-in first tap result
5. **`game-grid.tsx` + `color-tile.tsx`** — render the grid, handle a single active tap, emit correct/wrong events
6. **`play/page.tsx`** — reducer-driven state machine for `start -> round -> resolve -> gameOver`
7. **`score-bar.tsx`** — displays score, level, lives, and optional streak

### Phase 2: UX polish (1-2 hours)

8. **Start screen** (`page.tsx`) — title, play button, rule hint, animated background, high score
9. **Game over screen** (`game-over.tsx`) — stats, replay, high score persistence
10. **Animations** — motion for tap feedback, round transitions, and overlay entry
11. **Background** — dynamic but restrained atmosphere that supports the current palette without obscuring the tiles

### Phase 3: Shareability (1 hour)

12. **Share card** (`share-card.tsx`) — styled result card with score + palette swatch
13. **Share action** — use Web Share / clipboard APIs with text fallback
14. **OG tags** — title, description, OG image

### Phase 4: QA + deploy (45-60 min)

15. **Manual tuning pass** — test at least 20 rounds across desktop and mobile widths, adjust difficulty tiers if any palette feels unfair
16. **Static export** — `next.config.ts` with `output: 'export'`
17. **Deploy** — GitHub Pages or Vercel

---

## Acceptance Criteria

- Rules are obvious within one play session
- A wrong answer always feels attributable to player error or legitimate difficulty, not broken color generation
- Tapping cannot be exploited by rapidly guessing multiple tiles in one round
- The game remains comfortably playable on a phone without tiles dropping below practical tap size
- The visual design still reads as a portfolio-quality demo even if the scoring system is simple

---

## Design Notes

- The color is the design; UI chrome should stay minimal
- Keep the game readable before making it flashy
- Prefer strong typography and composition over excessive particles
- Dark default is fine for the demo, but palette contrast should be validated against the background
- Mobile-first: maintain comfortable tap targets and fast round pacing

---

## Estimated Total Effort

**5-7 hours** from zero to deployed, including a real tuning pass for color fairness.
