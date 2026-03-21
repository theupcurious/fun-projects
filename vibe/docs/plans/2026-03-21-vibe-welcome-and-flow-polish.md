# Vibe Welcome & Flow Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 2 new moods (Handcraft + Cyberpunk) to reach 18 total, animate the welcome screen with cycling palette backgrounds, and simplify the guided flow to 2 steps by removing the project type step.

**Architecture:** Pure UI changes across 4 files. No new dependencies needed — the animation uses `useEffect` + `useState` with CSS `transition`. The `Record<PresetId, ...>` constraint in `variants.ts` means new PresetIds must get variant entries before the build will pass.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4. Verify with `npm run build` (no unit test framework).

---

### Task 1: Add new PresetIds and empty variant stubs

TypeScript will refuse to compile if `COLOR_VARIANTS` or `TYPOGRAPHY_VARIANTS` (both typed as `Record<PresetId, ...>`) are missing keys. Add the new IDs to the type union and empty stubs to variants first, so the build stays green while we work.

**Files:**
- Modify: `vibe/lib/types.ts` (line 18–34 — the PresetId union)
- Modify: `vibe/lib/variants.ts` (line 18 — COLOR_VARIANTS object, line 465 — TYPOGRAPHY_VARIANTS object)

**Step 1: Add the two new PresetIds to the union in `lib/types.ts`**

Find the `PresetId` type (currently ends with `| "startup"`). Add two new entries:

```ts
export type PresetId =
  | "editorial"
  | "minimal"
  | "dashboard"
  | "corporate"
  | "saas"
  | "monochrome"
  | "playful"
  | "retro"
  | "brutalist"
  | "studio"
  | "whimsical"
  | "luxury"
  | "organic"
  | "neon"
  | "candy"
  | "startup"
  | "handcraft"
  | "cyberpunk";
```

**Step 2: Add empty stub arrays to `COLOR_VARIANTS` in `lib/variants.ts`**

At the end of the `COLOR_VARIANTS` object (just before the closing `}`), add:

```ts
  handcraft: [],
  cyberpunk: [],
```

**Step 3: Add empty stub arrays to `TYPOGRAPHY_VARIANTS` in `lib/variants.ts`**

At the end of the `TYPOGRAPHY_VARIANTS` object (just before the closing `}`), add:

```ts
  handcraft: [],
  cyberpunk: [],
```

**Step 4: Verify the build passes**

```bash
cd vibe && npm run build
```

Expected: clean build. TypeScript should not complain about missing Record keys.

**Step 5: Commit**

```bash
git add lib/types.ts lib/variants.ts
git commit -m "feat: add handcraft and cyberpunk to PresetId union with empty variant stubs"
```

---

### Task 2: Add Handcraft and Cyberpunk presets to `lib/presets.ts`

**Files:**
- Modify: `vibe/lib/presets.ts`

**Context:** `PRESETS` is an array ordered by group. Handcraft goes at the end of the Creative group (after `whimsical`), Cyberpunk at the end of the Bold group (after `startup`). The current array order: Professional (6), Creative (5 — editorial through whimsical), Bold (5 — luxury through startup).

**Step 1: Insert the Handcraft preset after `whimsical` (the last Creative preset)**

Find the line with `// ── Bold ──` and insert this block immediately before it:

```ts
  {
    id: "handcraft",
    group: "creative",
    name: "Handcraft",
    description: "Warm, artisanal, craft-studio feel",
    reference: "Etsy sellers, indie ceramics brands, local bakeries",
    aestheticBlurb:
      "Artisanal and tactile — warm cream backgrounds, terracotta and sage tones, a sense that something was made by hand with care. Rounded humanist type, generous spacing, warmth implied through earthy palette. Avoid anything digital, cold, or corporate.",
    values: {
      presetId: "handcraft",
      mode: "light",
      colors: {
        primary: "#c4622d",
        secondary: "#6b8f71",
        accent: "#d4a853",
        background: "#faf4ec",
        surface: "#f0e8d8",
        text: "#2a1f14",
        textMuted: "#7a6655",
        border: "#d8c8b0",
      },
      typography: {
        headingFont: "Lora",
        bodyFont: "Nunito",
        monoFont: "IBM Plex Mono",
        headingWeight: 600,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 8,
        spacingDensity: "generous",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "underline",
      },
    },
  },
```

**Step 2: Insert the Cyberpunk preset after `startup` (the last Bold preset, just before `];`)**

Find the closing `},` of the `startup` preset (around line 721) and insert this block after it, before the `];`:

```ts
  {
    id: "cyberpunk",
    group: "bold",
    name: "Cyberpunk",
    description: "High contrast, dark, tech-dystopia",
    reference: "Blade Runner UI, sci-fi dashboards, hacker terminals",
    aestheticBlurb:
      "Dark and electric — near-black background with cyan and magenta accents that demand attention. Sharp corners, tight spacing, condensed geometric type with uppercase transforms. Feels like a sci-fi interface from 2049. Avoid warmth, softness, or anything organic.",
    values: {
      presetId: "cyberpunk",
      mode: "dark",
      colors: {
        primary: "#00e5ff",
        secondary: "#ff00aa",
        accent: "#ccff00",
        background: "#07070f",
        surface: "#0f0f1a",
        text: "#e8eaf6",
        textMuted: "#7986cb",
        border: "#1a1a2e",
      },
      typography: {
        headingFont: "Rajdhani",
        bodyFont: "Share Tech Mono",
        monoFont: "Share Tech Mono",
        headingWeight: 700,
        bodySize: 15,
        headingTransform: "uppercase",
        letterSpacing: 2,
      },
      shape: {
        borderRadius: 2,
        spacingDensity: "compact",
        shadowStyle: "none",
        borderWeight: "medium",
      },
      components: {
        buttonStyle: "outline",
        cardStyle: "bordered",
        inputStyle: "underline",
        linkTreatment: "color-only",
      },
    },
  },
```

**Step 3: Verify the build passes**

```bash
cd vibe && npm run build
```

Expected: clean build. `PRESETS.length` is now 18.

**Step 4: Commit**

```bash
git add lib/presets.ts
git commit -m "feat: add Handcraft and Cyberpunk presets (18 total)"
```

---

### Task 3: Add real variants for Handcraft and Cyberpunk in `lib/variants.ts`

Replace the empty stub arrays added in Task 1 with real color and typography variants.

**Files:**
- Modify: `vibe/lib/variants.ts`

**Step 1: Replace the `handcraft: []` in `COLOR_VARIANTS` with:**

```ts
  handcraft: [
    {
      name: "Terracotta",
      values: {
        primary: "#c4622d", secondary: "#6b8f71", accent: "#d4a853",
        background: "#faf4ec", surface: "#f0e8d8", text: "#2a1f14",
        textMuted: "#7a6655", border: "#d8c8b0",
      },
    },
    {
      name: "Sage",
      values: {
        primary: "#5a7a4a", secondary: "#c4622d", accent: "#e8c97a",
        background: "#f5f4ee", surface: "#eceadf", text: "#1a2018",
        textMuted: "#6a6858", border: "#ccc8b8",
      },
    },
    {
      name: "Linen",
      values: {
        primary: "#8b5e3c", secondary: "#b07d54", accent: "#6b8f71",
        background: "#fdf8f2", surface: "#f5eee4", text: "#2a1f14",
        textMuted: "#8a7060", border: "#ddd0bc",
      },
    },
  ],
```

**Step 2: Replace the `cyberpunk: []` in `COLOR_VARIANTS` with:**

```ts
  cyberpunk: [
    {
      name: "Cyan",
      values: {
        primary: "#00e5ff", secondary: "#ff00aa", accent: "#ccff00",
        background: "#07070f", surface: "#0f0f1a", text: "#e8eaf6",
        textMuted: "#7986cb", border: "#1a1a2e",
      },
    },
    {
      name: "Magenta",
      values: {
        primary: "#ff00aa", secondary: "#00e5ff", accent: "#ffea00",
        background: "#0f070f", surface: "#1a0f1a", text: "#f8e8f6",
        textMuted: "#9c7aab", border: "#2e1a2e",
      },
    },
    {
      name: "Acid",
      values: {
        primary: "#ccff00", secondary: "#00e5ff", accent: "#ff00aa",
        background: "#070f07", surface: "#0f1a0f", text: "#e8f6e8",
        textMuted: "#7ab47a", border: "#1a2e1a",
      },
    },
  ],
```

**Step 3: Replace the `handcraft: []` in `TYPOGRAPHY_VARIANTS` with:**

```ts
  handcraft: [
    {
      name: "Lora",
      values: {
        headingFont: "Lora", bodyFont: "Nunito", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Fraunces",
      values: {
        headingFont: "Fraunces", bodyFont: "Karla", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Libre",
      values: {
        headingFont: "Libre Baskerville", bodyFont: "Raleway", monoFont: "IBM Plex Mono",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],
```

**Step 4: Replace the `cyberpunk: []` in `TYPOGRAPHY_VARIANTS` with:**

```ts
  cyberpunk: [
    {
      name: "Rajdhani",
      values: {
        headingFont: "Rajdhani", bodyFont: "Share Tech Mono", monoFont: "Share Tech Mono",
        headingWeight: 700, bodySize: 15, headingTransform: "uppercase", letterSpacing: 2,
      },
    },
    {
      name: "Orbitron",
      values: {
        headingFont: "Orbitron", bodyFont: "Share Tech Mono", monoFont: "Share Tech Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "uppercase", letterSpacing: 3,
      },
    },
    {
      name: "Mono",
      values: {
        headingFont: "JetBrains Mono", bodyFont: "JetBrains Mono", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "uppercase", letterSpacing: 1,
      },
    },
  ],
```

**Step 5: Verify the build passes**

```bash
cd vibe && npm run build
```

**Step 6: Commit**

```bash
git add lib/variants.ts
git commit -m "feat: add color and typography variants for Handcraft and Cyberpunk"
```

---

### Task 4: Animated welcome screen

Rewrite `components/welcome-screen.tsx`. The background cycles through 6 visually distinct presets (neon, candy, luxury, editorial, brutalist, organic) with a 1s opacity crossfade every 3.5s. A dark overlay ensures buttons and text always read clearly. The logo is larger, buttons are more prominent.

**Files:**
- Modify: `vibe/components/welcome-screen.tsx`

**Step 1: Write the new welcome-screen.tsx**

Replace the entire file content with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { PRESETS } from "@/lib/presets";
import type { PresetId } from "@/lib/types";

// Curated for maximum visual variety — light/dark mix, color diversity
const SHOWCASE_IDS: PresetId[] = ["neon", "candy", "luxury", "editorial", "brutalist", "organic"];

interface WelcomeScreenProps {
  onStartGuided: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onStartGuided, onSkip }: WelcomeScreenProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % SHOWCASE_IDS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const showcasePresets = SHOWCASE_IDS.map((id) => PRESETS.find((p) => p.id === id)!);

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      {/* Animated palette backgrounds */}
      {showcasePresets.map((preset, idx) => {
        const { primary, background: bg } = preset.values.colors;
        return (
          <div
            key={preset.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              opacity: idx === activeIdx ? 1 : 0,
              backgroundColor: bg,
              backgroundImage: `radial-gradient(ellipse at 25% 35%, ${primary}55 0%, transparent 65%), radial-gradient(ellipse at 75% 65%, ${primary}33 0%, transparent 60%)`,
            }}
          />
        );
      })}

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex max-w-md flex-col items-center px-6 text-center">
        <div className="mb-6">
          <span className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">Vibe</span>
          <p className="mt-3 text-sm text-white/70">
            Design language generator for vibe coders
          </p>
        </div>

        <p className="mb-10 text-sm leading-relaxed text-white/50">
          Pick a mood, get a design system prompt you can paste into
          Cursor, Claude, or ChatGPT. No design experience needed.
        </p>

        <div className="flex w-full flex-col gap-3">
          <button
            onClick={onStartGuided}
            className="rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
          >
            Guide me
            <span className="ml-2 text-xs font-normal text-black/50">— 2 quick questions</span>
          </button>

          <button
            onClick={onSkip}
            className="rounded-lg border border-white/20 px-6 py-3.5 text-sm text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:text-white"
          >
            I know what I want
          </button>
        </div>

        <p className="mt-8 text-[11px] text-white/25">by Upcurious</p>
      </div>
    </div>
  );
}
```

**Step 2: Verify the build passes**

```bash
cd vibe && npm run build
```

**Step 3: Commit**

```bash
git add components/welcome-screen.tsx
git commit -m "feat: animated palette cycling welcome screen"
```

---

### Task 5: Simplify guided flow to 2 steps

Remove the "What are you building?" step entirely. The guided flow becomes: pick a mood (flat 18-item 3-column grid) → light or dark.

**Files:**
- Modify: `vibe/components/guided-flow.tsx`

**Step 1: Write the simplified guided-flow.tsx**

Replace the entire file content with:

```tsx
"use client";

import { useState } from "react";
import type { PresetId, ThemeMode } from "@/lib/types";
import { PRESETS } from "@/lib/presets";
import { cn } from "@/lib/utils";

interface GuidedFlowProps {
  onComplete: (presetId: PresetId, mode: ThemeMode) => void;
  onBack: () => void;
}

export function GuidedFlow({ onComplete, onBack }: GuidedFlowProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPreset, setSelectedPreset] = useState<PresetId | null>(null);

  function handlePresetSelect(id: PresetId) {
    setSelectedPreset(id);
    setStep(2);
  }

  function handleModeSelect(mode: ThemeMode) {
    if (selectedPreset) {
      onComplete(selectedPreset, mode);
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      {/* Progress bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <button
          onClick={() => {
            if (step === 1) onBack();
            else setStep(1);
          }}
          className="text-xs text-white/40 transition-colors hover:text-white/70"
        >
          Back
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                s <= step ? "bg-white/40" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <span className="text-[11px] text-white/30">Step {step} of 2</span>
      </div>

      {/* Step content */}
      <div className="flex flex-1 justify-center overflow-y-auto px-6 py-8">
        {/* Step 1: Pick a vibe */}
        {step === 1 && (
          <div className="w-full max-w-lg">
            <h2 className="mb-2 text-lg font-semibold text-white">Pick a vibe</h2>
            <p className="mb-6 text-sm text-white/40">
              Choose the aesthetic that fits your project.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((preset) => {
                const { colors, typography } = preset.values;
                const isSelected = selectedPreset === preset.id;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border text-left transition-all duration-150",
                      isSelected
                        ? "border-white/40 ring-2 ring-white/30"
                        : "border-white/10 hover:border-white/25"
                    )}
                    style={{ background: colors.background }}
                  >
                    <div className="p-3">
                      <div className="mb-2 flex gap-1">
                        {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
                          <div key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                        ))}
                      </div>
                      <div
                        className="text-[11px] font-bold leading-tight"
                        style={{
                          color: colors.text,
                          fontFamily: typography.headingFont,
                          textTransform: typography.headingTransform === "uppercase" ? "uppercase" : undefined,
                        }}
                      >
                        {preset.name}
                      </div>
                      <div
                        className="mt-0.5 text-[9px] leading-snug opacity-60"
                        style={{ color: colors.text, fontFamily: typography.bodyFont }}
                      >
                        {preset.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Light or dark? */}
        {step === 2 && (
          <div className="w-full max-w-sm">
            <h2 className="mb-2 text-lg font-semibold text-white">Light or dark?</h2>
            <p className="mb-6 text-sm text-white/40">You can always switch later.</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleModeSelect("light")}
                className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-white px-6 py-6 transition-all hover:border-white/30"
              >
                <div className="h-10 w-10 rounded-full border border-neutral-200 bg-neutral-50" />
                <span className="text-sm font-medium text-neutral-900">Light</span>
              </button>

              <button
                onClick={() => handleModeSelect("dark")}
                className="flex flex-col items-center gap-3 rounded-lg border border-white/15 bg-[#111] px-6 py-6 transition-all hover:border-white/30"
              >
                <div className="h-10 w-10 rounded-full border border-white/10 bg-neutral-800" />
                <span className="text-sm font-medium text-white">Dark</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify the build passes**

```bash
cd vibe && npm run build
```

Expected: clean build. `page.tsx` already uses `GuidedFlow` with the same props interface (`onComplete`, `onBack`) so no changes needed there.

**Step 3: Commit**

```bash
git add components/guided-flow.tsx
git commit -m "feat: simplify guided flow to 2 steps (drop project type, flat 18-mood grid)"
```

---

## Done

All 5 tasks complete. Verify by running `npm run dev` and checking:
1. Welcome screen has animated cycling backgrounds
2. "Guide me" goes to a 2-step flow: mood grid (18 items, 3 columns, no orphan) → light/dark
3. Handcraft and Cyberpunk appear in the mood picker in the editor sidebar
4. "Surprise me" button still works (uses `PRESETS.length` dynamically)
