# Vibe V2: Expanded Moods & Guided Flow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Vibe from a power-user design tool into a simple "pick a vibe, copy the prompt" tool for non-designers, with 16 moods in 3 groups, a guided onboarding flow, and a simplified default interface that hides granular controls.

**Architecture:** The main changes are: (1) expand presets from 8→16 with group metadata, (2) add a welcome screen component with two entry paths, (3) create a 3-step guided wizard component, (4) restructure the controls panel to lead with mood picking and hide customization behind a toggle. All client-side React, no new dependencies.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4

---

## Task 1: Add new PresetId types and mood group system

**Files:**
- Modify: `vibe/lib/types.ts`
- Modify: `vibe/lib/presets.ts`

**Step 1: Update PresetId union type**

In `vibe/lib/types.ts`, replace the `PresetId` type (line 18-26) with:

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
  | "startup";

export type MoodGroup = "professional" | "creative" | "bold";
```

**Step 2: Add group field to Preset interface**

In `vibe/lib/presets.ts`, update the `Preset` interface (line 4-11):

```ts
export interface Preset {
  id: PresetId;
  group: MoodGroup;
  name: string;
  description: string;
  reference: string;
  aestheticBlurb: string;
  values: DesignLanguage;
}
```

Update the import to include `MoodGroup`:

```ts
import type { DesignLanguage, MoodGroup, PresetId } from "./types";
```

**Step 3: Add `group` field to all 8 existing presets**

Add `group` to each existing preset right after `id`:

- `editorial`: `group: "professional"`
- `brutalist`: `group: "creative"`
- `playful`: `group: "creative"`
- `luxury`: `group: "bold"`
- `retro`: `group: "creative"`
- `minimal`: `group: "professional"`
- `dashboard`: `group: "professional"`
- `organic`: `group: "bold"`

**Step 4: Add group labels helper**

At the bottom of `vibe/lib/presets.ts`, before `getPreset`, add:

```ts
export const MOOD_GROUPS: { id: MoodGroup; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "bold", label: "Bold" },
];

export function getPresetsByGroup(): { group: MoodGroup; label: string; presets: Preset[] }[] {
  return MOOD_GROUPS.map(({ id, label }) => ({
    group: id,
    label,
    presets: PRESETS.filter((p) => p.group === id),
  }));
}
```

**Step 5: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 6: Commit**

```bash
git add lib/types.ts lib/presets.ts && git commit -m "feat: add mood group system and expand PresetId types"
```

---

## Task 2: Add 8 new mood presets

**Files:**
- Modify: `vibe/lib/presets.ts`

Add these 8 new presets to the `PRESETS` array. Insert them so presets within each group are adjacent. The final order should be:

**Professional group:** editorial, minimal, dashboard, corporate, saas, monochrome
**Creative group:** playful, retro, brutalist, studio, whimsical
**Bold group:** luxury, organic, neon, candy, startup

**Step 1: Add Corporate preset** (after dashboard)

```ts
{
  id: "corporate",
  group: "professional",
  name: "Corporate",
  description: "Trustworthy, polished, blue-chip",
  reference: "Stripe, Intercom, Slack",
  aestheticBlurb:
    "Corporate polish without the stuffiness. Clean sans-serif typography, a blue-driven palette that conveys trust, well-structured layouts with clear hierarchy. Professional but not boring — think Stripe's confidence, not a bank's rigidity.",
  values: {
    presetId: "corporate",
    mode: "light",
    colors: {
      primary: "#1e40af",
      secondary: "#3b82f6",
      accent: "#0ea5e9",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textMuted: "#64748b",
      border: "#e2e8f0",
    },
    typography: {
      headingFont: "Plus Jakarta Sans",
      bodyFont: "DM Sans",
      monoFont: "JetBrains Mono",
      headingWeight: 700,
      bodySize: 16,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 8,
      spacingDensity: "default",
      shadowStyle: "subtle",
      borderWeight: "hairline",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "bordered",
      inputStyle: "bordered",
      linkTreatment: "color-only",
    },
  },
},
```

**Step 2: Add SaaS preset** (after corporate)

```ts
{
  id: "saas",
  group: "professional",
  name: "SaaS",
  description: "Clean, conversion-focused, product-led",
  reference: "Linear, Vercel marketing, Resend",
  aestheticBlurb:
    "Modern SaaS aesthetic — clean lines, purposeful whitespace, a single bold accent color for CTAs. Typography is sharp and readable. Feels fast, focused, and engineered for conversion. Avoid decoration; let the product speak.",
  values: {
    presetId: "saas",
    mode: "light",
    colors: {
      primary: "#111827",
      secondary: "#6366f1",
      accent: "#8b5cf6",
      background: "#ffffff",
      surface: "#f9fafb",
      text: "#111827",
      textMuted: "#6b7280",
      border: "#e5e7eb",
    },
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "Manrope",
      monoFont: "JetBrains Mono",
      headingWeight: 600,
      bodySize: 16,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 10,
      spacingDensity: "generous",
      shadowStyle: "subtle",
      borderWeight: "hairline",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "elevated",
      inputStyle: "bordered",
      linkTreatment: "color-only",
    },
  },
},
```

**Step 3: Add Monochrome preset** (after saas)

```ts
{
  id: "monochrome",
  group: "professional",
  name: "Monochrome",
  description: "Pure black & white, type-driven",
  reference: "iA Writer, Notion minimal, Bear",
  aestheticBlurb:
    "Stripped to essentials — pure black on white (or white on black). No accent colors, no decoration. Typography hierarchy does all the visual work. Feels authoritative and focused. Every element must earn its place.",
  values: {
    presetId: "monochrome",
    mode: "light",
    colors: {
      primary: "#000000",
      secondary: "#333333",
      accent: "#000000",
      background: "#ffffff",
      surface: "#fafafa",
      text: "#000000",
      textMuted: "#71717a",
      border: "#e4e4e7",
    },
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "DM Sans",
      monoFont: "IBM Plex Mono",
      headingWeight: 700,
      bodySize: 16,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 4,
      spacingDensity: "generous",
      shadowStyle: "none",
      borderWeight: "hairline",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "flat",
      inputStyle: "underline",
      linkTreatment: "underline",
    },
  },
},
```

**Step 4: Add Studio preset** (after brutalist)

```ts
{
  id: "studio",
  group: "creative",
  name: "Studio",
  description: "Bold type, confident, agency feel",
  reference: "Pentagram, Collins, Huge Inc",
  aestheticBlurb:
    "Design studio energy — oversized typography, asymmetric confidence, a sense that every pixel was placed with intention. Bold but not loud. Prefers one strong typeface over busy combinations. Avoid cute, playful, or corporate.",
  values: {
    presetId: "studio",
    mode: "light",
    colors: {
      primary: "#1a1a1a",
      secondary: "#e63946",
      accent: "#e63946",
      background: "#f1f0eb",
      surface: "#e8e6df",
      text: "#1a1a1a",
      textMuted: "#6b6b6b",
      border: "#d1d0ca",
    },
    typography: {
      headingFont: "Syne",
      bodyFont: "Barlow",
      monoFont: "Space Mono",
      headingWeight: 800,
      bodySize: 16,
      headingTransform: "uppercase",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 0,
      spacingDensity: "generous",
      shadowStyle: "none",
      borderWeight: "medium",
    },
    components: {
      buttonStyle: "outline",
      cardStyle: "flat",
      inputStyle: "underline",
      linkTreatment: "underline",
    },
  },
},
```

**Step 5: Add Whimsical preset** (after studio)

```ts
{
  id: "whimsical",
  group: "creative",
  name: "Whimsical",
  description: "Soft, illustrated, storybook warmth",
  reference: "Mailchimp, Dropbox Paper, Duolingo",
  aestheticBlurb:
    "Warm and whimsical — like a well-designed children's book for adults. Soft rounded shapes, warm secondary colors, a font that feels handwritten without being illegible. Approachable without being childish. Avoid anything sharp, dark, or corporate.",
  values: {
    presetId: "whimsical",
    mode: "light",
    colors: {
      primary: "#7c3aed",
      secondary: "#f472b6",
      accent: "#fbbf24",
      background: "#fffbf0",
      surface: "#fef3e2",
      text: "#1f1235",
      textMuted: "#7c6f94",
      border: "#ede4d4",
    },
    typography: {
      headingFont: "Fraunces",
      bodyFont: "Nunito",
      monoFont: "Fira Code",
      headingWeight: 700,
      bodySize: 17,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 16,
      spacingDensity: "generous",
      shadowStyle: "subtle",
      borderWeight: "hairline",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "elevated",
      inputStyle: "bordered",
      linkTreatment: "color-only",
    },
  },
},
```

**Step 6: Add Neon preset** (after organic)

```ts
{
  id: "neon",
  group: "bold",
  name: "Neon",
  description: "Electric, dark, cyberpunk energy",
  reference: "Vercel dark mode, GitHub Universe, Figma Config",
  aestheticBlurb:
    "Electric and futuristic. Deep dark background with neon accents that glow. High contrast, sharp edges, a sense of digital craftsmanship. Typography is clean and modern — the colors do the talking. Avoid warmth, softness, or anything organic.",
  values: {
    presetId: "neon",
    mode: "dark",
    colors: {
      primary: "#00ff88",
      secondary: "#6366f1",
      accent: "#f43f5e",
      background: "#09090b",
      surface: "#18181b",
      text: "#fafafa",
      textMuted: "#71717a",
      border: "#27272a",
    },
    typography: {
      headingFont: "Space Grotesk",
      bodyFont: "DM Sans",
      monoFont: "JetBrains Mono",
      headingWeight: 700,
      bodySize: 15,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 8,
      spacingDensity: "default",
      shadowStyle: "subtle",
      borderWeight: "hairline",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "bordered",
      inputStyle: "bordered",
      linkTreatment: "color-only",
    },
  },
},
```

**Step 7: Add Candy preset** (after neon)

```ts
{
  id: "candy",
  group: "bold",
  name: "Candy",
  description: "Pastel, gradient-ready, Gen-Z",
  reference: "Figma, Notion covers, Framer templates",
  aestheticBlurb:
    "Pastel-forward and playful — soft pinks, lavenders, and mints. Generous rounding, light shadows, a sense of delight in every interaction. Typography is clean and modern but friendly. The palette should feel like a Figma template you'd actually want to use.",
  values: {
    presetId: "candy",
    mode: "light",
    colors: {
      primary: "#a855f7",
      secondary: "#ec4899",
      accent: "#06b6d4",
      background: "#fefcff",
      surface: "#faf5ff",
      text: "#1e1b4b",
      textMuted: "#7c71a6",
      border: "#ede9fe",
    },
    typography: {
      headingFont: "Plus Jakarta Sans",
      bodyFont: "Nunito",
      monoFont: "Fira Code",
      headingWeight: 700,
      bodySize: 16,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 14,
      spacingDensity: "generous",
      shadowStyle: "elevated",
      borderWeight: "none",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "elevated",
      inputStyle: "bordered",
      linkTreatment: "color-only",
    },
  },
},
```

**Step 8: Add Startup preset** (after candy)

```ts
{
  id: "startup",
  group: "bold",
  name: "Startup",
  description: "High-energy, bold, Series A vibes",
  reference: "Early-stage YC, Product Hunt, Arc browser",
  aestheticBlurb:
    "Startup energy — bold, optimistic, moving fast. A strong primary color that demands attention, clean sans-serif type, and a layout that feels like it was built by a small team that ships every day. Not polished, not rough — just confident.",
  values: {
    presetId: "startup",
    mode: "light",
    colors: {
      primary: "#f97316",
      secondary: "#2563eb",
      accent: "#16a34a",
      background: "#ffffff",
      surface: "#f8f8f8",
      text: "#0a0a0a",
      textMuted: "#737373",
      border: "#e5e5e5",
    },
    typography: {
      headingFont: "Outfit",
      bodyFont: "DM Sans",
      monoFont: "Fira Code",
      headingWeight: 700,
      bodySize: 16,
      headingTransform: "none",
      letterSpacing: -1,
    },
    shape: {
      borderRadius: 10,
      spacingDensity: "default",
      shadowStyle: "elevated",
      borderWeight: "hairline",
    },
    components: {
      buttonStyle: "filled",
      cardStyle: "elevated",
      inputStyle: "bordered",
      linkTreatment: "color-only",
    },
  },
},
```

**Step 9: Reorder the PRESETS array**

Reorder the full PRESETS array so that presets are grouped:

```
Professional: editorial, minimal, dashboard, corporate, saas, monochrome
Creative: playful, retro, brutalist, studio, whimsical
Bold: luxury, organic, neon, candy, startup
```

**Step 10: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 11: Commit**

```bash
git add lib/presets.ts && git commit -m "feat: add 8 new mood presets (corporate, saas, monochrome, studio, whimsical, neon, candy, startup)"
```

---

## Task 3: Add color and typography variants for new presets

**Files:**
- Modify: `vibe/lib/variants.ts`

Add 3 color variants and 3 typography variants for each of the 8 new presets.

**Step 1: Add color variants**

Add entries to `COLOR_VARIANTS` for each new preset:

```ts
corporate: [
  {
    name: "Blue Chip",
    values: {
      primary: "#1e40af", secondary: "#3b82f6", accent: "#0ea5e9",
      background: "#ffffff", surface: "#f8fafc", text: "#0f172a",
      textMuted: "#64748b", border: "#e2e8f0",
    },
  },
  {
    name: "Slate",
    values: {
      primary: "#334155", secondary: "#64748b", accent: "#0ea5e9",
      background: "#ffffff", surface: "#f8fafc", text: "#0f172a",
      textMuted: "#64748b", border: "#e2e8f0",
    },
  },
  {
    name: "Trust",
    values: {
      primary: "#0f766e", secondary: "#14b8a6", accent: "#0d9488",
      background: "#ffffff", surface: "#f0fdfa", text: "#0f172a",
      textMuted: "#5a7a74", border: "#d1e8e4",
    },
  },
],

saas: [
  {
    name: "Indigo",
    values: {
      primary: "#111827", secondary: "#6366f1", accent: "#8b5cf6",
      background: "#ffffff", surface: "#f9fafb", text: "#111827",
      textMuted: "#6b7280", border: "#e5e7eb",
    },
  },
  {
    name: "Violet",
    values: {
      primary: "#111827", secondary: "#8b5cf6", accent: "#a78bfa",
      background: "#ffffff", surface: "#faf8ff", text: "#111827",
      textMuted: "#6b7280", border: "#ede9fe",
    },
  },
  {
    name: "Emerald",
    values: {
      primary: "#111827", secondary: "#059669", accent: "#34d399",
      background: "#ffffff", surface: "#f0fdf4", text: "#111827",
      textMuted: "#6b7280", border: "#d1fae5",
    },
  },
],

monochrome: [
  {
    name: "Pure",
    values: {
      primary: "#000000", secondary: "#333333", accent: "#000000",
      background: "#ffffff", surface: "#fafafa", text: "#000000",
      textMuted: "#71717a", border: "#e4e4e7",
    },
  },
  {
    name: "Soft",
    values: {
      primary: "#1a1a1a", secondary: "#525252", accent: "#1a1a1a",
      background: "#fafafa", surface: "#f5f5f5", text: "#1a1a1a",
      textMuted: "#737373", border: "#d4d4d4",
    },
  },
  {
    name: "Charcoal",
    values: {
      primary: "#e5e5e5", secondary: "#a3a3a3", accent: "#e5e5e5",
      background: "#171717", surface: "#262626", text: "#e5e5e5",
      textMuted: "#737373", border: "#404040",
    },
  },
],

studio: [
  {
    name: "Red Accent",
    values: {
      primary: "#1a1a1a", secondary: "#e63946", accent: "#e63946",
      background: "#f1f0eb", surface: "#e8e6df", text: "#1a1a1a",
      textMuted: "#6b6b6b", border: "#d1d0ca",
    },
  },
  {
    name: "Ink Blue",
    values: {
      primary: "#1a1a1a", secondary: "#2563eb", accent: "#2563eb",
      background: "#f0f1f3", surface: "#e4e6ea", text: "#1a1a1a",
      textMuted: "#6b6b6b", border: "#cdd0d5",
    },
  },
  {
    name: "Black",
    values: {
      primary: "#fafafa", secondary: "#a3a3a3", accent: "#fafafa",
      background: "#0a0a0a", surface: "#171717", text: "#fafafa",
      textMuted: "#737373", border: "#2a2a2a",
    },
  },
],

whimsical: [
  {
    name: "Lavender",
    values: {
      primary: "#7c3aed", secondary: "#f472b6", accent: "#fbbf24",
      background: "#fffbf0", surface: "#fef3e2", text: "#1f1235",
      textMuted: "#7c6f94", border: "#ede4d4",
    },
  },
  {
    name: "Peach",
    values: {
      primary: "#e11d48", secondary: "#f59e0b", accent: "#8b5cf6",
      background: "#fff7f0", surface: "#ffedd5", text: "#2a1215",
      textMuted: "#8a6a6a", border: "#f5d5c0",
    },
  },
  {
    name: "Meadow",
    values: {
      primary: "#16a34a", secondary: "#eab308", accent: "#7c3aed",
      background: "#f7fff0", surface: "#ecfccb", text: "#14280a",
      textMuted: "#5a7a50", border: "#d4e8c0",
    },
  },
],

neon: [
  {
    name: "Green",
    values: {
      primary: "#00ff88", secondary: "#6366f1", accent: "#f43f5e",
      background: "#09090b", surface: "#18181b", text: "#fafafa",
      textMuted: "#71717a", border: "#27272a",
    },
  },
  {
    name: "Cyan",
    values: {
      primary: "#22d3ee", secondary: "#a855f7", accent: "#f43f5e",
      background: "#09090b", surface: "#18181b", text: "#fafafa",
      textMuted: "#71717a", border: "#27272a",
    },
  },
  {
    name: "Pink",
    values: {
      primary: "#f472b6", secondary: "#818cf8", accent: "#34d399",
      background: "#09090b", surface: "#18181b", text: "#fafafa",
      textMuted: "#71717a", border: "#27272a",
    },
  },
],

candy: [
  {
    name: "Purple",
    values: {
      primary: "#a855f7", secondary: "#ec4899", accent: "#06b6d4",
      background: "#fefcff", surface: "#faf5ff", text: "#1e1b4b",
      textMuted: "#7c71a6", border: "#ede9fe",
    },
  },
  {
    name: "Pink",
    values: {
      primary: "#ec4899", secondary: "#f472b6", accent: "#8b5cf6",
      background: "#fff5f7", surface: "#fce7f3", text: "#1e1b4b",
      textMuted: "#8a6a80", border: "#fbd5e8",
    },
  },
  {
    name: "Mint",
    values: {
      primary: "#2dd4bf", secondary: "#a78bfa", accent: "#f472b6",
      background: "#f0fffc", surface: "#ccfbf1", text: "#0f2b2b",
      textMuted: "#5a8a80", border: "#b0e8d8",
    },
  },
],

startup: [
  {
    name: "Orange",
    values: {
      primary: "#f97316", secondary: "#2563eb", accent: "#16a34a",
      background: "#ffffff", surface: "#f8f8f8", text: "#0a0a0a",
      textMuted: "#737373", border: "#e5e5e5",
    },
  },
  {
    name: "Blue",
    values: {
      primary: "#2563eb", secondary: "#f97316", accent: "#16a34a",
      background: "#ffffff", surface: "#f5f7ff", text: "#0a0a0a",
      textMuted: "#737373", border: "#e0e4f0",
    },
  },
  {
    name: "Green",
    values: {
      primary: "#16a34a", secondary: "#2563eb", accent: "#f97316",
      background: "#ffffff", surface: "#f0fdf4", text: "#0a0a0a",
      textMuted: "#737373", border: "#d5eadb",
    },
  },
],
```

**Step 2: Add typography variants**

Add entries to `TYPOGRAPHY_VARIANTS` for each new preset:

```ts
corporate: [
  {
    name: "Jakarta",
    values: {
      headingFont: "Plus Jakarta Sans", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Manrope",
    values: {
      headingFont: "Manrope", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Barlow",
    values: {
      headingFont: "Barlow", bodyFont: "DM Sans", monoFont: "IBM Plex Mono",
      headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
    },
  },
],

saas: [
  {
    name: "Grotesk",
    values: {
      headingFont: "Space Grotesk", bodyFont: "Manrope", monoFont: "JetBrains Mono",
      headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Jakarta",
    values: {
      headingFont: "Plus Jakarta Sans", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Outfit",
    values: {
      headingFont: "Outfit", bodyFont: "Manrope", monoFont: "Fira Code",
      headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
    },
  },
],

monochrome: [
  {
    name: "Grotesk",
    values: {
      headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "IBM Plex Mono",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Serif",
    values: {
      headingFont: "Libre Baskerville", bodyFont: "Source Serif 4", monoFont: "IBM Plex Mono",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: 0,
    },
  },
  {
    name: "System",
    values: {
      headingFont: "DM Sans", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 700, bodySize: 15, headingTransform: "none", letterSpacing: 0,
    },
  },
],

studio: [
  {
    name: "Syne Bold",
    values: {
      headingFont: "Syne", bodyFont: "Barlow", monoFont: "Space Mono",
      headingWeight: 800, bodySize: 16, headingTransform: "uppercase", letterSpacing: -1,
    },
  },
  {
    name: "Bebas",
    values: {
      headingFont: "Bebas Neue", bodyFont: "Barlow", monoFont: "Space Mono",
      headingWeight: 400, bodySize: 16, headingTransform: "uppercase", letterSpacing: 2,
    },
  },
  {
    name: "Grotesk",
    values: {
      headingFont: "Space Grotesk", bodyFont: "Outfit", monoFont: "Space Mono",
      headingWeight: 700, bodySize: 16, headingTransform: "uppercase", letterSpacing: 0,
    },
  },
],

whimsical: [
  {
    name: "Fraunces",
    values: {
      headingFont: "Fraunces", bodyFont: "Nunito", monoFont: "Fira Code",
      headingWeight: 700, bodySize: 17, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Lora",
    values: {
      headingFont: "Lora", bodyFont: "Karla", monoFont: "Fira Code",
      headingWeight: 600, bodySize: 17, headingTransform: "none", letterSpacing: 0,
    },
  },
  {
    name: "Playfair",
    values: {
      headingFont: "Playfair Display", bodyFont: "Nunito", monoFont: "Fira Code",
      headingWeight: 700, bodySize: 17, headingTransform: "italic", letterSpacing: 0,
    },
  },
],

neon: [
  {
    name: "Grotesk",
    values: {
      headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 700, bodySize: 15, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Mono",
    values: {
      headingFont: "JetBrains Mono", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 700, bodySize: 14, headingTransform: "none", letterSpacing: 0,
    },
  },
  {
    name: "Syne",
    values: {
      headingFont: "Syne", bodyFont: "Outfit", monoFont: "JetBrains Mono",
      headingWeight: 800, bodySize: 15, headingTransform: "none", letterSpacing: -1,
    },
  },
],

candy: [
  {
    name: "Jakarta",
    values: {
      headingFont: "Plus Jakarta Sans", bodyFont: "Nunito", monoFont: "Fira Code",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Outfit",
    values: {
      headingFont: "Outfit", bodyFont: "DM Sans", monoFont: "Fira Code",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: 0,
    },
  },
  {
    name: "Nunito",
    values: {
      headingFont: "Nunito", bodyFont: "Karla", monoFont: "Fira Code",
      headingWeight: 800, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
],

startup: [
  {
    name: "Outfit",
    values: {
      headingFont: "Outfit", bodyFont: "DM Sans", monoFont: "Fira Code",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Jakarta",
    values: {
      headingFont: "Plus Jakarta Sans", bodyFont: "Manrope", monoFont: "Fira Code",
      headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
    },
  },
  {
    name: "Grotesk",
    values: {
      headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
      headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
    },
  },
],
```

**Step 3: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 4: Commit**

```bash
git add lib/variants.ts && git commit -m "feat: add color and typography variants for 8 new mood presets"
```

---

## Task 4: Update MoodPicker with grouped layout

**Files:**
- Modify: `vibe/components/mood-picker.tsx`

Replace the current flat 2-column grid with a grouped layout that shows group headers.

**Step 1: Read the file, then rewrite the component**

```tsx
"use client";

import { getPresetsByGroup } from "@/lib/presets";
import type { PresetId } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MoodPickerProps {
  selectedId: PresetId | null;
  onSelect: (id: PresetId) => void;
}

export function MoodPicker({ selectedId, onSelect }: MoodPickerProps) {
  const groups = getPresetsByGroup();

  return (
    <div className="space-y-4">
      {groups.map(({ group, label, presets }) => (
        <div key={group}>
          <div className="mb-2 text-[10px] uppercase tracking-wider text-white/30">
            {label}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => {
              const { colors, typography } = preset.values;
              const isSelected = selectedId === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => onSelect(preset.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border text-left transition-all duration-150",
                    isSelected
                      ? "border-white/40 ring-2 ring-white/30"
                      : "border-white/10 hover:border-white/25"
                  )}
                  style={{ background: colors.background }}
                >
                  <div className="p-3">
                    {/* Color dots */}
                    <div className="mb-2 flex gap-1">
                      {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
                        <div
                          key={i}
                          className="h-3 w-3 rounded-full"
                          style={{ background: c }}
                        />
                      ))}
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ background: colors.surface, borderColor: colors.border }}
                      />
                    </div>

                    {/* Mini type sample */}
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
                      className="mt-0.5 text-[9px] leading-snug opacity-70"
                      style={{
                        color: colors.text,
                        fontFamily: typography.bodyFont,
                      }}
                    >
                      {preset.description}
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <div
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full"
                      style={{ background: colors.primary }}
                    >
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none">
                        <path
                          d="M2 5l2 2 4-4"
                          stroke={colors.background}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**Step 2: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 3: Commit**

```bash
git add components/mood-picker.tsx && git commit -m "feat: update mood picker with grouped layout (professional, creative, bold)"
```

---

## Task 5: Create the Welcome screen component

**Files:**
- Create: `vibe/components/welcome-screen.tsx`

This is the first thing users see. Two paths: "Guide me" (starts the wizard) and "Just let me pick" (goes straight to editor with mood section open).

**Step 1: Create the component**

```tsx
"use client";

import { cn } from "@/lib/utils";

interface WelcomeScreenProps {
  onStartGuided: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onStartGuided, onSkip }: WelcomeScreenProps) {
  return (
    <div className="flex h-full items-center justify-center bg-[#0d0d0d] px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-2xl font-bold tracking-tight text-white">Vibe</span>
          <p className="mt-2 text-sm text-white/50">
            Design language generator for vibe coders
          </p>
        </div>

        {/* Value prop */}
        <p className="mb-10 text-sm leading-relaxed text-white/40">
          Pick a mood, get a design system prompt you can paste into
          Cursor, Claude, or ChatGPT. No design experience needed.
        </p>

        {/* Two paths */}
        <div className="flex w-full flex-col gap-3">
          <button
            onClick={onStartGuided}
            className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90"
          >
            Guide me
            <span className="ml-2 text-xs text-black/50">
              — 3 quick questions
            </span>
          </button>

          <button
            onClick={onSkip}
            className="rounded-lg border border-white/15 px-6 py-3 text-sm text-white/60 transition-colors hover:border-white/25 hover:text-white/80"
          >
            I know what I want
          </button>
        </div>

        <p className="mt-6 text-[11px] text-white/20">
          by Upcurious
        </p>
      </div>
    </div>
  );
}
```

**Step 2: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 3: Commit**

```bash
git add components/welcome-screen.tsx && git commit -m "feat: add welcome screen with two entry paths"
```

---

## Task 6: Create the Guided Flow wizard component

**Files:**
- Create: `vibe/components/guided-flow.tsx`

A 3-step wizard:
1. "What are you building?" — pick a project type
2. "Pick a vibe" — mood grid sorted by relevance to project type
3. "Light or dark?" — simple toggle, then done

**Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import type { PresetId, ThemeMode } from "@/lib/types";
import { PRESETS, getPresetsByGroup } from "@/lib/presets";
import { cn } from "@/lib/utils";

type ProjectType =
  | "landing"
  | "saas"
  | "portfolio"
  | "blog"
  | "ecommerce"
  | "dashboard";

const PROJECT_OPTIONS: { value: ProjectType; label: string; description: string }[] = [
  { value: "landing", label: "Landing page", description: "Marketing site, product launch" },
  { value: "saas", label: "SaaS app", description: "Web app, tool, platform" },
  { value: "portfolio", label: "Portfolio", description: "Personal site, agency, studio" },
  { value: "blog", label: "Blog / Content", description: "Articles, newsletter, media" },
  { value: "ecommerce", label: "E-commerce", description: "Shop, product pages, checkout" },
  { value: "dashboard", label: "Dashboard", description: "Admin panel, analytics, data" },
];

// Map project types to recommended preset IDs (ordered by relevance)
const PROJECT_RECOMMENDATIONS: Record<ProjectType, PresetId[]> = {
  landing: ["saas", "startup", "minimal", "playful", "corporate"],
  saas: ["saas", "dashboard", "minimal", "corporate", "neon"],
  portfolio: ["studio", "minimal", "editorial", "brutalist", "monochrome"],
  blog: ["editorial", "minimal", "organic", "whimsical", "retro"],
  ecommerce: ["corporate", "playful", "candy", "minimal", "luxury"],
  dashboard: ["dashboard", "neon", "saas", "monochrome", "corporate"],
};

interface GuidedFlowProps {
  onComplete: (presetId: PresetId, mode: ThemeMode) => void;
  onBack: () => void;
}

export function GuidedFlow({ onComplete, onBack }: GuidedFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetId | null>(null);

  function handleProjectSelect(type: ProjectType) {
    setProjectType(type);
    setStep(2);
  }

  function handlePresetSelect(id: PresetId) {
    setSelectedPreset(id);
    setStep(3);
  }

  function handleModeSelect(mode: ThemeMode) {
    if (selectedPreset) {
      onComplete(selectedPreset, mode);
    }
  }

  // Sort presets: recommended first, then the rest
  const sortedPresets = (() => {
    if (!projectType) return PRESETS;
    const recs = PROJECT_RECOMMENDATIONS[projectType];
    const recommended = recs.map((id) => PRESETS.find((p) => p.id === id)).filter(Boolean);
    const rest = PRESETS.filter((p) => !recs.includes(p.id));
    return [...recommended, ...rest] as typeof PRESETS;
  })();

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      {/* Progress bar */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <button
          onClick={() => {
            if (step === 1) onBack();
            else setStep((s) => (s - 1) as 1 | 2 | 3);
          }}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Back
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                s <= step ? "bg-white/40" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <span className="text-[11px] text-white/30">
          Step {step} of 3
        </span>
      </div>

      {/* Step content */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8">
        {/* Step 1: What are you building? */}
        {step === 1 && (
          <div className="w-full max-w-sm">
            <h2 className="mb-2 text-lg font-semibold text-white">
              What are you building?
            </h2>
            <p className="mb-6 text-sm text-white/40">
              This helps us recommend the right mood.
            </p>
            <div className="grid gap-2">
              {PROJECT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleProjectSelect(opt.value)}
                  className={cn(
                    "rounded-lg border border-white/10 px-4 py-3 text-left transition-all hover:border-white/25",
                    projectType === opt.value && "border-white/40 bg-white/5"
                  )}
                >
                  <div className="text-sm font-medium text-white">{opt.label}</div>
                  <div className="text-xs text-white/40">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pick a vibe */}
        {step === 2 && (
          <div className="w-full max-w-lg">
            <h2 className="mb-2 text-lg font-semibold text-white">
              Pick a vibe
            </h2>
            <p className="mb-6 text-sm text-white/40">
              {projectType
                ? `Recommended for ${PROJECT_OPTIONS.find((o) => o.value === projectType)?.label.toLowerCase()}. All moods available below.`
                : "Choose the aesthetic that fits your project."}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {sortedPresets.map((preset, idx) => {
                const { colors, typography } = preset.values;
                const isRecommended =
                  projectType && idx < PROJECT_RECOMMENDATIONS[projectType].length;
                const isSelected = selectedPreset === preset.id;

                return (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border text-left transition-all duration-150",
                      isSelected
                        ? "border-white/40 ring-2 ring-white/30"
                        : isRecommended
                          ? "border-white/20 hover:border-white/35"
                          : "border-white/10 hover:border-white/25",
                      !isRecommended && projectType && "opacity-50 hover:opacity-80"
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

        {/* Step 3: Light or dark? */}
        {step === 3 && (
          <div className="w-full max-w-sm">
            <h2 className="mb-2 text-lg font-semibold text-white">
              Light or dark?
            </h2>
            <p className="mb-6 text-sm text-white/40">
              You can always switch later.
            </p>
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

**Step 2: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 3: Commit**

```bash
git add components/guided-flow.tsx && git commit -m "feat: add 3-step guided flow wizard (project type → mood → light/dark)"
```

---

## Task 7: Restructure controls panel — mood-first, customize toggle

**Files:**
- Modify: `vibe/app/page.tsx`

The controls panel should now show:
1. The mood picker (always visible, not collapsible)
2. A "Customize" toggle that reveals the granular controls (color, type, shape, components, theme)

**Step 1: Read `app/page.tsx` then update it**

Update the `Section` type and `SECTIONS` array to separate mood from customization sections:

```ts
type CustomizeSection = "color" | "type" | "shape" | "components" | "theme";

const CUSTOMIZE_SECTIONS: { id: CustomizeSection; label: string }[] = [
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "shape", label: "Shape" },
  { id: "components", label: "Components" },
  { id: "theme", label: "Theme" },
];
```

Add a new state:

```ts
const [showCustomize, setShowCustomize] = useState(false);
const [openCustomizeSection, setOpenCustomizeSection] = useState<CustomizeSection | null>(null);
```

Remove the old `openSection` and `SECTIONS` references.

Replace the controls panel content (the `<aside>` inner content) with:

```tsx
<div className="flex-1 overflow-y-auto">
  {/* Instruction */}
  <div className="border-b border-white/10 px-3 py-3">
    <p className="text-[11px] leading-relaxed text-white/50">
      Pick a mood, then{" "}
      <span className="text-white/80">Copy prompt</span>{" "}
      to paste into Cursor, Claude, or ChatGPT.
    </p>
  </div>

  {/* Mood picker — always visible */}
  <div className="border-b border-white/5 px-3 py-3">
    <MoodPicker
      selectedId={lang.presetId}
      onSelect={selectPreset}
    />
  </div>

  {/* Customize toggle */}
  <div className="border-b border-white/5">
    <button
      onClick={() => setShowCustomize((p) => !p)}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-xs transition-colors",
        showCustomize ? "text-white/60" : "text-white/30 hover:text-white/50"
      )}
    >
      <span className="font-medium">Customize</span>
      <svg
        viewBox="0 0 10 10"
        className={cn("h-3 w-3 transition-transform", showCustomize ? "rotate-180" : "")}
        fill="none"
      >
        <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>

  {/* Customization sections — hidden by default */}
  {showCustomize && (
    <>
      {CUSTOMIZE_SECTIONS.map(({ id, label }) => (
        <div key={id} className="border-b border-white/5">
          <SectionHeader
            label={label}
            active={openCustomizeSection === id}
            onClick={() =>
              setOpenCustomizeSection(openCustomizeSection === id ? null : id)
            }
          />
          {openCustomizeSection === id && (
            <div className="px-3 pb-4">
              {id === "color" && (
                <ColorSection
                  colors={lang.colors}
                  onChange={(c) => setLang((l) => ({ ...l, colors: c }))}
                  variants={lang.presetId ? getColorVariants(lang.presetId) : undefined}
                />
              )}
              {id === "type" && (
                <TypographySection
                  typography={lang.typography}
                  onChange={(t) => setLang((l) => ({ ...l, typography: t }))}
                  presetId={lang.presetId}
                  variants={lang.presetId ? getTypographyVariants(lang.presetId) : undefined}
                />
              )}
              {id === "shape" && (
                <ShapeSection
                  shape={lang.shape}
                  onChange={(s) => setLang((l) => ({ ...l, shape: s }))}
                />
              )}
              {id === "components" && (
                <ComponentSection
                  components={lang.components}
                  onChange={(c) => setLang((l) => ({ ...l, components: c }))}
                />
              )}
              {id === "theme" && (
                <ThemeSection
                  mode={lang.mode}
                  onChange={(m) =>
                    setLang((l) => {
                      if (m === l.mode) return l;
                      const toDark = m === "dark";
                      return {
                        ...l,
                        mode: m,
                        colors: invertPalette(l.colors, toDark),
                        presetId: null,
                      };
                    })
                  }
                />
              )}
            </div>
          )}
        </div>
      ))}
    </>
  )}
</div>
```

Remove the old `type Section` and `SECTIONS` const. Remove `openSection` state. Keep `SectionHeader` component.

**Step 2: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 3: Commit**

```bash
git add app/page.tsx && git commit -m "feat: restructure controls panel — mood picker always visible, customize sections behind toggle"
```

---

## Task 8: Wire Welcome screen and Guided Flow into page.tsx

**Files:**
- Modify: `vibe/app/page.tsx`

**Step 1: Add imports and app view state**

Add imports at the top:

```ts
import { WelcomeScreen } from "@/components/welcome-screen";
import { GuidedFlow } from "@/components/guided-flow";
```

Add a view state to the `Page` component:

```ts
type AppView = "welcome" | "guided" | "editor";

const [view, setView] = useState<AppView>("welcome");
```

**Step 2: Handle URL state — if design in URL, skip welcome**

Update the URL check `useEffect` to also set the view:

```ts
useEffect(() => {
  const fromUrl = readDesignFromUrl();
  if (fromUrl) {
    setLang(fromUrl);
    setView("editor");
  }
}, []);
```

**Step 3: Handle guided flow completion**

Add a handler:

```ts
function handleGuidedComplete(presetId: PresetId, mode: ThemeMode) {
  const preset = getPreset(presetId);
  if (preset) {
    const design = { ...preset.values };
    if (mode !== design.mode) {
      design.mode = mode;
      design.colors = invertPalette(design.colors, mode === "dark");
    }
    setLang(design);
  }
  setView("editor");
}
```

Add `ThemeMode` to the imports from `@/lib/types`.

**Step 4: Wrap the return in a view switcher**

The return should conditionally render based on `view`:

```tsx
if (view === "welcome") {
  return (
    <div className="h-screen bg-[#0d0d0d]">
      <WelcomeScreen
        onStartGuided={() => setView("guided")}
        onSkip={() => setView("editor")}
      />
    </div>
  );
}

if (view === "guided") {
  return (
    <div className="h-screen bg-[#0d0d0d]">
      <GuidedFlow
        onComplete={handleGuidedComplete}
        onBack={() => setView("welcome")}
      />
    </div>
  );
}

return (
  <>
    <FontLoader fonts={activeFonts} />
    {/* ... existing editor layout ... */}
  </>
);
```

**Step 5: Verify build**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 6: Commit**

```bash
git add app/page.tsx && git commit -m "feat: wire welcome screen and guided flow into main page"
```

---

## Task 9: Final polish — update getRandomDesign for new presets

**Files:**
- Modify: `vibe/lib/presets.ts`

The existing `getRandomDesign()` already works with any number of presets since it picks from the `PRESETS` array. However, verify that `presetId: null` is still correct (it should be, since the random design mixes presets and variants).

**Step 1: Verify getRandomDesign still works**

Read `lib/presets.ts` and confirm `getRandomDesign` references `PRESETS` (not a hardcoded list). It should already work since it uses `PRESETS[Math.floor(Math.random() * PRESETS.length)]`.

No code changes needed if it's already generic. Just verify the build works end-to-end.

**Step 2: Final build verification**

```bash
cd /Users/james/Projects/Coding/fun-projects/vibe && npm run build
```

**Step 3: Commit (only if changes were needed)**

If no changes needed, skip this commit.

---

## Summary

| # | Type | Description | Files touched |
|---|------|-------------|---------------|
| 1 | Foundation | Add mood group system & expand PresetId types | 2 |
| 2 | Content | Add 8 new mood presets | 1 |
| 3 | Content | Add color & typography variants for new presets | 1 |
| 4 | UI | Update MoodPicker with grouped layout | 1 |
| 5 | UI | Create Welcome screen component | 1 (new) |
| 6 | UI | Create Guided Flow wizard | 1 (new) |
| 7 | UI | Restructure controls panel (mood-first, customize toggle) | 1 |
| 8 | Integration | Wire welcome screen & guided flow into page.tsx | 1 |
| 9 | Verification | Verify getRandomDesign works with expanded presets | 1 |
