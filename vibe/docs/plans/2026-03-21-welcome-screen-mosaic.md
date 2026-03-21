# Welcome Screen Mosaic Redesign

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current animated-gradient welcome screen with a "living mosaic" of real preset UI fragments that slowly drifts upward, communicating "design tool" instantly.

**Architecture:** Single-file rewrite of `welcome-screen.tsx`. The mosaic is a CSS grid of lightweight tile components (heading, card, button, palette, quote) each rendered with a real preset's design tokens. The grid is duplicated vertically for seamless infinite scroll via CSS `@keyframes`. Wordmark and CTAs float above with `backdrop-blur` frosted-glass panels.

**Tech Stack:** React 19, Tailwind CSS v4, CSS animations, existing preset data from `@/lib/presets`

---

### Task 1: Rewrite welcome-screen.tsx with mosaic layout

**Files:**
- Modify: `components/welcome-screen.tsx` (full rewrite)

**Context:**
- The component receives `{ onStartGuided, onSkip }` props — interface unchanged
- `page.tsx` renders it as `<WelcomeScreen onStartGuided={...} onSkip={...} />` — no changes needed there
- Import presets from `@/lib/presets` (already imported in current file)
- Import types from `@/lib/types` (already imported)
- The component uses `FontLoader` from `@/components/font-loader` — but on the welcome screen we don't load fonts (tiles use system fallbacks or the fonts load lazily). The main `page.tsx` already handles `FontLoader` for the editor. The welcome screen should NOT add a FontLoader — the tiles are decorative and system-font fallback is fine.

**Step 1: Write the complete new welcome-screen.tsx**

Replace the entire file with the implementation below. The key parts:

1. **Tile types and configuration** — 5 fragment types (heading, card, buttons, palette, quote), a curated list of ~28 tiles assigned to specific presets for maximum visual contrast
2. **Tile renderer** — A `MosaicTile` component that renders the appropriate fragment using the preset's real design tokens (colors, typography, shape)
3. **Grid layout** — CSS grid with 4 columns (3 on mobile), tiles at fixed heights with some variety via `span 2` rows
4. **Drift animation** — The tile grid is rendered twice (duplicated). A CSS keyframe animation translates the wrapper upward by 50% infinitely, creating a seamless loop. Speed: ~60s per cycle.
5. **Frosted overlays** — Wordmark top-left and CTA panel bottom-center, both with `backdrop-blur-xl` + semi-transparent background

```tsx
"use client";

import { PRESETS } from "@/lib/presets";
import type { Preset } from "@/lib/presets";

// ── Fragment types ────────────────────────────────────────────────────────────
type TileFragment = "heading" | "card" | "buttons" | "palette" | "quote";

interface TileConfig {
  presetId: string;
  fragment: TileFragment;
  tall?: boolean; // spans 2 rows
}

// Curated for maximum adjacent-color contrast and visual variety.
// ~28 tiles → 7 rows × 4 cols. Some are tall (span 2 rows) for texture.
const TILES: TileConfig[] = [
  // Row 1-2
  { presetId: "neon", fragment: "heading", tall: true },
  { presetId: "candy", fragment: "card" },
  { presetId: "brutalist", fragment: "buttons" },
  { presetId: "luxury", fragment: "palette", tall: true },
  // Row 2-3
  { presetId: "editorial", fragment: "quote" },
  { presetId: "cyberpunk", fragment: "heading" },
  // Row 3-4
  { presetId: "playful", fragment: "card", tall: true },
  { presetId: "retro", fragment: "palette" },
  { presetId: "saas", fragment: "buttons" },
  { presetId: "organic", fragment: "heading" },
  // Row 4-5
  { presetId: "studio", fragment: "quote" },
  { presetId: "handcraft", fragment: "card" },
  { presetId: "dashboard", fragment: "heading", tall: true },
  { presetId: "whimsical", fragment: "buttons" },
  // Row 5-6
  { presetId: "minimal", fragment: "palette" },
  { presetId: "startup", fragment: "card" },
  { presetId: "corporate", fragment: "quote" },
  { presetId: "monochrome", fragment: "heading" },
  // Row 6-7
  { presetId: "candy", fragment: "heading" },
  { presetId: "neon", fragment: "buttons" },
  { presetId: "retro", fragment: "quote", tall: true },
  { presetId: "cyberpunk", fragment: "card" },
  // Row 7-8
  { presetId: "luxury", fragment: "heading" },
  { presetId: "playful", fragment: "palette" },
  { presetId: "brutalist", fragment: "quote" },
  { presetId: "editorial", fragment: "card" },
  { presetId: "organic", fragment: "buttons" },
  { presetId: "handcraft", fragment: "heading" },
];

// Short phrases for heading tiles — variety of tones
const HEADING_PHRASES = [
  "Make it bold.",
  "Less is more",
  "Ship it fast",
  "Pixel perfect",
  "Think different",
  "Keep it clean",
  "Stay golden",
  "Raw & real",
  "Dream big",
  "Pure craft",
];

// Short quotes for quote tiles
const QUOTE_PHRASES = [
  "Design is not what it looks like, it's how it works.",
  "Simplicity is the ultimate sophistication.",
  "Good design is invisible.",
  "Details make the product.",
  "Form follows function.",
  "The best interface is no interface.",
];

// ── Tile renderer ─────────────────────────────────────────────────────────────

function MosaicTile({ preset, fragment, index }: { preset: Preset; fragment: TileFragment; index: number }) {
  const { colors, typography, shape, components } = preset.values;
  const radius = `${shape.borderRadius}px`;

  const base: React.CSSProperties = {
    backgroundColor: colors.background,
    borderRadius: radius,
    overflow: "hidden",
    border: `1px solid ${colors.border}`,
  };

  if (fragment === "heading") {
    const phrase = HEADING_PHRASES[index % HEADING_PHRASES.length];
    return (
      <div style={base} className="flex items-center justify-center p-5">
        <span
          style={{
            color: colors.text,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight,
            textTransform: typography.headingTransform === "uppercase" ? "uppercase" : undefined,
            letterSpacing: `${typography.letterSpacing * 0.1}em`,
            fontSize: "clamp(14px, 1.6vw, 22px)",
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          {phrase}
        </span>
      </div>
    );
  }

  if (fragment === "card") {
    return (
      <div style={base} className="flex flex-col p-4">
        {/* Fake image bar */}
        <div
          className="mb-3 h-8 w-full"
          style={{
            backgroundColor: colors.surface,
            borderRadius: `${Math.min(shape.borderRadius, 6)}px`,
          }}
        />
        {/* Title line */}
        <div
          className="mb-1.5 h-2.5 w-3/4"
          style={{ backgroundColor: colors.text, borderRadius: 2, opacity: 0.8 }}
        />
        {/* Body lines */}
        <div
          className="mb-1 h-2 w-full"
          style={{ backgroundColor: colors.textMuted, borderRadius: 2, opacity: 0.4 }}
        />
        <div
          className="h-2 w-2/3"
          style={{ backgroundColor: colors.textMuted, borderRadius: 2, opacity: 0.3 }}
        />
      </div>
    );
  }

  if (fragment === "buttons") {
    const btnRadius = `${shape.borderRadius}px`;
    const isFilled = components.buttonStyle === "filled";
    return (
      <div style={base} className="flex flex-col items-center justify-center gap-2 p-4">
        {/* Primary button */}
        <div
          className="flex w-full items-center justify-center py-2 text-[11px] font-semibold"
          style={{
            backgroundColor: isFilled ? colors.primary : "transparent",
            color: isFilled ? colors.background : colors.primary,
            border: isFilled ? "none" : `1.5px solid ${colors.primary}`,
            borderRadius: btnRadius,
            fontFamily: typography.bodyFont,
          }}
        >
          Get started
        </div>
        {/* Secondary button */}
        <div
          className="flex w-full items-center justify-center py-2 text-[11px]"
          style={{
            color: colors.textMuted,
            border: `1px solid ${colors.border}`,
            borderRadius: btnRadius,
            fontFamily: typography.bodyFont,
          }}
        >
          Learn more
        </div>
      </div>
    );
  }

  if (fragment === "palette") {
    return (
      <div style={base} className="flex flex-col items-center justify-center gap-3 p-4">
        {/* Color dots */}
        <div className="flex gap-2">
          {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-full"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        {/* Preset name */}
        <span
          className="text-[11px]"
          style={{
            color: colors.text,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight,
            textTransform: typography.headingTransform === "uppercase" ? "uppercase" : undefined,
            opacity: 0.7,
          }}
        >
          {preset.name}
        </span>
      </div>
    );
  }

  // quote
  const quote = QUOTE_PHRASES[index % QUOTE_PHRASES.length];
  return (
    <div style={base} className="flex items-center p-4">
      <div className="flex gap-2.5">
        <div
          className="w-0.5 shrink-0 self-stretch"
          style={{ backgroundColor: colors.accent, borderRadius: 1 }}
        />
        <p
          className="text-[11px] italic leading-relaxed"
          style={{
            color: colors.textMuted,
            fontFamily: typography.bodyFont,
          }}
        >
          {quote}
        </p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface WelcomeScreenProps {
  onStartGuided: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onStartGuided, onSkip }: WelcomeScreenProps) {
  // Resolve preset objects once
  const resolvedTiles = TILES.map((tile) => ({
    ...tile,
    preset: PRESETS.find((p) => p.id === tile.presetId)!,
  }));

  return (
    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
      {/* Mosaic grid — duplicated for seamless loop */}
      <div
        className="animate-mosaic-drift pointer-events-none"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="grid grid-cols-3 gap-2 p-2 md:grid-cols-4 md:gap-2.5 md:p-2.5"
            style={{ gridAutoRows: "90px" }}
          >
            {resolvedTiles.map((tile, idx) => (
              <div
                key={`${copy}-${idx}`}
                style={{ gridRow: tile.tall ? "span 2" : "span 1" }}
              >
                <div className="h-full w-full">
                  <MosaicTile preset={tile.preset} fragment={tile.fragment} index={idx} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Frosted wordmark — top left */}
      <div className="absolute left-4 top-4 z-10 rounded-xl bg-black/40 px-4 py-3 backdrop-blur-xl">
        <div className="text-lg font-semibold tracking-tight text-white">Vibe</div>
        <div className="text-[11px] text-white/50">Design language generator</div>
      </div>

      {/* Frosted CTA panel — bottom center */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
        <div className="flex w-full max-w-xs flex-col gap-2.5 rounded-2xl bg-black/40 p-5 backdrop-blur-xl">
          <button
            onClick={onStartGuided}
            className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90"
          >
            Guide me
            <span className="ml-2 text-xs font-normal text-black/50">— 2 quick questions</span>
          </button>

          <button
            onClick={onSkip}
            className="rounded-lg border border-white/20 px-6 py-3 text-sm text-white/70 transition-all hover:border-white/40 hover:text-white"
          >
            I know what I want
          </button>

          <p className="mt-1 text-center text-[11px] text-white/25">by Upcurious</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add the drift animation to Tailwind config / global CSS**

The animation class `animate-mosaic-drift` needs to be defined. Check if the project uses a `tailwind.config.ts` or `app/globals.css` for custom animations.

Look for the CSS file at `app/globals.css` and add:

```css
@keyframes mosaic-drift {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.animate-mosaic-drift {
  animation: mosaic-drift 60s linear infinite;
}
```

**Step 3: Verify the build**

Run: `npm run build`
Expected: Build succeeds with no TypeScript errors

**Step 4: Visual check**

Run: `npm run dev`
Open `http://localhost:3000` — verify:
- Mosaic grid fills the viewport with colorful preset tiles
- Grid slowly drifts upward, loops seamlessly
- Frosted "Vibe" wordmark is visible top-left
- Frosted CTA panel floats bottom-center
- Both buttons work (navigate to guided flow / editor)

**Step 5: Commit**

```bash
git add components/welcome-screen.tsx app/globals.css
git commit -m "feat: redesign welcome screen as living mosaic of preset UI fragments"
```
