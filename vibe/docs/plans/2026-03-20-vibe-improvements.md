# Vibe Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix 12 code quality, UX, and feature issues across the Vibe design language generator.

**Architecture:** All changes are client-side React. Tasks 1-4 are pure refactors (extract, dedupe, move). Tasks 5-9 are targeted UX fixes in existing components. Tasks 10-12 add new features to page.tsx and export-bar.tsx. No new dependencies required.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui

---

## Task 1: Extract shared `RadioRow` component

**Files:**
- Create: `vibe/components/controls/radio-row.tsx`
- Modify: `vibe/components/controls/shape-section.tsx`
- Modify: `vibe/components/controls/component-section.tsx`

**Step 1: Create shared RadioRow component**

Create `vibe/components/controls/radio-row.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";

interface RadioRowProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function RadioRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: RadioRowProps<T>) {
  return (
    <div>
      <div className="mb-2 text-[11px] text-white/50">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-xs transition-colors",
              value === opt.value
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Step 2: Update shape-section.tsx**

Remove the local `RadioRow` function (lines 13-45). Add import at top:

```tsx
import { RadioRow } from "./radio-row";
```

Remove the local `RadioRow` definition entirely. All existing `<RadioRow>` usages remain unchanged.

**Step 3: Update component-section.tsx**

Remove the local `RadioRow` function (lines 12-44). Add import at top:

```tsx
import { RadioRow } from "./radio-row";
```

Remove the local `RadioRow` definition entirely. All existing `<RadioRow>` usages remain unchanged.

**Step 4: Verify the app builds**

```bash
cd vibe && npm run build
```

Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add vibe/components/controls/radio-row.tsx vibe/components/controls/shape-section.tsx vibe/components/controls/component-section.tsx
git commit -m "refactor: extract shared RadioRow component from shape and component sections"
```

---

## Task 2: Deduplicate shadow CSS map

**Files:**
- Modify: `vibe/lib/prompt-generator.ts`

The duplicate is `SHADOW_CSS` (lines 22-27 in prompt-generator.ts) which duplicates `SHADOW_CSS_MAP` from `vibe/lib/types.ts` (lines 4-9). The prompt generator needs descriptive text for `"none"` though, so it can't just import directly.

**Step 1: Update prompt-generator.ts**

Replace the local `SHADOW_CSS` constant (lines 22-27) with an import-based approach. Add import at top:

```tsx
import { SHADOW_CSS_MAP } from "./types";
```

Replace the `SHADOW_CSS` definition with:

```tsx
function shadowDesc(style: string): string {
  if (style === "none") return "no shadows";
  return SHADOW_CSS_MAP[style as keyof typeof SHADOW_CSS_MAP] ?? "no shadows";
}
```

Then on line 85, change:
```tsx
- Shadows: ${SHADOW_CSS[lang.shape.shadowStyle]}
```
to:
```tsx
- Shadows: ${shadowDesc(lang.shape.shadowStyle)}
```

**Step 2: Verify build**

```bash
cd vibe && npm run build
```

**Step 3: Commit**

```bash
git add vibe/lib/prompt-generator.ts
git commit -m "refactor: deduplicate shadow CSS map in prompt generator"
```

---

## Task 3: Eliminate duplicated spacing scale calculation in preview components

**Files:**
- Modify: `vibe/components/preview/preview-hero.tsx`
- Modify: `vibe/components/preview/preview-cards.tsx`
- Modify: `vibe/components/preview/preview-quote.tsx`
- Modify: `vibe/components/preview/preview-cta.tsx`
- Modify: `vibe/components/preview/preview-footer.tsx`

Every preview component repeats:
```tsx
const spacingScale = shape.spacingDensity === "compact" ? 0.6 : shape.spacingDensity === "generous" ? 1.4 : 1;
```

The preview-frame already sets `--vp-spacing` with these exact values. Replace all inline JS spacing calculations with CSS `calc()` using the existing var.

**Step 1: Update preview-hero.tsx**

Remove lines 8-10 (spacingScale, py, px). Replace inline padding with CSS calc:

```tsx
style={{
  background: colors.background,
  padding: `calc(64px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`,
  textAlign: "center",
  ...
}}
```

Do the same for the marginBottom on the badge (keep as-is, it's a fixed value).

**Step 2: Update preview-cards.tsx**

Remove lines 62-65 (spacingScale, py, px, cardPad). Replace:

```tsx
// Section padding:
padding: `calc(48px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`

// Card padding:
padding: `calc(20px * var(--vp-spacing))`

// Grid gap:
gap: `calc(16px * var(--vp-spacing))`
```

**Step 3: Update preview-quote.tsx**

Remove lines 7-9 (spacingScale, py, px). Replace:

```tsx
padding: `calc(48px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`
```

**Step 4: Update preview-cta.tsx**

Remove lines 46-48 (spacingScale, py, px). Replace:

```tsx
padding: `calc(56px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`
```

**Step 5: Update preview-footer.tsx**

Remove lines 7-9 (spacingScale, py, px). Replace:

```tsx
padding: `calc(20px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`
```

**Step 6: Verify build**

```bash
cd vibe && npm run build
```

**Step 7: Commit**

```bash
git add vibe/components/preview/
git commit -m "refactor: use --vp-spacing CSS var instead of duplicated JS spacing calculation"
```

---

## Task 4: Move `getButtonStyles` to its own utility file

**Files:**
- Create: `vibe/components/preview/preview-styles.ts`
- Modify: `vibe/components/preview/preview-nav.tsx`
- Modify: `vibe/components/preview/preview-hero.tsx`
- Modify: `vibe/components/preview/preview-cta.tsx`

**Step 1: Create preview-styles.ts**

Extract `getButtonStyles` from preview-nav.tsx (lines 5-54) into a new file:

```tsx
import type { DesignLanguage } from "@/lib/types";

export function getButtonStyles(lang: DesignLanguage): React.CSSProperties {
  const { components, colors, shape } = lang;
  const radius = `var(--vp-radius)`;
  const borderW = {
    none: "0px",
    hairline: "1px",
    medium: "2px",
    heavy: "3px",
  }[shape.borderWeight];

  switch (components.buttonStyle) {
    case "filled":
      return {
        background: colors.primary,
        color: colors.background,
        border: "none",
        borderRadius: radius,
        padding: "6px 14px",
        fontSize: "inherit",
      };
    case "outline":
      return {
        background: "transparent",
        color: colors.primary,
        border: `${borderW} solid ${colors.primary}`,
        borderRadius: radius,
        padding: "6px 14px",
        fontSize: "inherit",
      };
    case "ghost":
      return {
        background: "transparent",
        color: colors.primary,
        border: "none",
        borderRadius: radius,
        padding: "6px 14px",
        fontSize: "inherit",
      };
    case "underline":
      return {
        background: "transparent",
        color: colors.primary,
        border: "none",
        borderRadius: 0,
        padding: "4px 0",
        borderBottom: `1px solid ${colors.primary}`,
        fontSize: "inherit",
      };
  }
}
```

**Step 2: Update preview-nav.tsx**

Remove the local `getButtonStyles` function (lines 5-54) and the `export { getButtonStyles }` at line 112. Add import:

```tsx
import { getButtonStyles } from "./preview-styles";
```

**Step 3: Update preview-hero.tsx**

Change import from:
```tsx
import { getButtonStyles } from "./preview-nav";
```
to:
```tsx
import { getButtonStyles } from "./preview-styles";
```

**Step 4: Update preview-cta.tsx**

Same import change as Step 3.

**Step 5: Verify build**

```bash
cd vibe && npm run build
```

**Step 6: Commit**

```bash
git add vibe/components/preview/
git commit -m "refactor: extract getButtonStyles to shared preview-styles utility"
```

---

## Task 5: Make preview cards grid responsive

**Files:**
- Modify: `vibe/components/preview/preview-cards.tsx`

**Step 1: Fix the grid**

In preview-cards.tsx, change the grid container style (around line 97):

From:
```tsx
gridTemplateColumns: "repeat(3, 1fr)",
```

To:
```tsx
gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
```

This gracefully collapses to 2 or 1 column when the preview panel is narrow.

**Step 2: Verify build**

```bash
cd vibe && npm run build
```

**Step 3: Commit**

```bash
git add vibe/components/preview/preview-cards.tsx
git commit -m "fix: make preview cards grid responsive with auto-fit"
```

---

## Task 6: Add smooth transitions to preview frame

**Files:**
- Modify: `vibe/components/preview/preview-frame.tsx`

**Step 1: Add transition property to the preview container**

In preview-frame.tsx, add a `transition` property to the inline style object (around line 70):

```tsx
style={{
  ...cssVars,
  background: "var(--vp-bg)",
  color: "var(--vp-text)",
  fontFamily: "var(--vp-body-font)",
  fontSize: "var(--vp-body-size)",
  transition: "background-color 0.3s ease, color 0.3s ease",
}}
```

Also add a CSS class or extend the className to include transition for child elements. The simplest approach: add a `<style>` tag inside the preview frame scoped to its children:

In the return JSX, add before `{children}`:

```tsx
<style>{`
  [data-vibe-preview] * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
`}</style>
```

And add `data-vibe-preview` to the container div.

**Step 2: Verify build**

```bash
cd vibe && npm run build
```

**Step 3: Commit**

```bash
git add vibe/components/preview/preview-frame.tsx
git commit -m "feat: add smooth transitions to preview when design language changes"
```

---

## Task 7: Fix color picker horizontal overflow

**Files:**
- Modify: `vibe/components/controls/color-section.tsx`

**Step 1: Clamp the left coordinate**

In the `handleToggle` function of `ColorSwatch` (around line 66-76), add a horizontal clamp:

```tsx
function handleToggle() {
  if (!open && btnRef.current) {
    const rect = btnRef.current.getBoundingClientRect();
    const pickerWidth = 232; // react-colorful default width + padding
    const flipUp = rect.bottom + PICKER_HEIGHT > window.innerHeight;
    const clampedLeft = Math.min(rect.left, window.innerWidth - pickerWidth - 8);
    setCoords({
      top: flipUp ? rect.top - PICKER_HEIGHT - 4 : rect.bottom + 4,
      left: Math.max(8, clampedLeft),
    });
  }
  setOpen((p) => !p);
}
```

**Step 2: Verify build**

```bash
cd vibe && npm run build
```

**Step 3: Commit**

```bash
git add vibe/components/controls/color-section.tsx
git commit -m "fix: clamp color picker position to prevent horizontal viewport overflow"
```

---

## Task 8: Memoize `generatePrompt` in export bar

**Files:**
- Modify: `vibe/components/export-bar.tsx`

**Step 1: Add useMemo**

Add `useMemo` to the React import (line 3):

```tsx
import { useMemo, useState } from "react";
```

Replace line 27:
```tsx
const promptText = generatePrompt(lang, format);
```
with:
```tsx
const promptText = useMemo(() => generatePrompt(lang, format), [lang, format]);
```

**Step 2: Verify build**

```bash
cd vibe && npm run build
```

**Step 3: Commit**

```bash
git add vibe/components/export-bar.tsx
git commit -m "perf: memoize generatePrompt in ExportBar"
```

---

## Task 9: Add keyboard navigation to font picker

**Files:**
- Modify: `vibe/components/controls/typography-section.tsx`

**Step 1: Add keyboard navigation state and handler**

In the `FontPicker` component, add a `highlightIndex` state and keyboard handler. Replace the existing component internals:

Add state after line 30 (`const [open, setOpen] = useState(false);`):

```tsx
const [highlightIndex, setHighlightIndex] = useState(-1);
```

Reset highlight when query changes -- add after the `filtered` computation (after line 55):

```tsx
// Reset highlight when filter changes
useEffect(() => {
  setHighlightIndex(-1);
}, [query]);
```

**Step 2: Build the ordered list for keyboard nav**

After the `filtered` computation, build the full ordered list that matches the render order:

```tsx
const orderedList = (() => {
  const recFont = recommendedFont
    ? filtered.find((f) => f.name === recommendedFont)
    : undefined;
  const rest = recFont
    ? filtered.filter((f) => f.name !== recommendedFont)
    : filtered;
  return recFont ? [recFont, ...rest] : rest;
})();
```

**Step 3: Add keyboard handler to the search input**

On the `<input>` element (around line 76), add an `onKeyDown` handler:

```tsx
onKeyDown={(e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    setHighlightIndex((i) => Math.min(i + 1, orderedList.length - 1));
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    setHighlightIndex((i) => Math.max(i - 1, 0));
  } else if (e.key === "Enter" && highlightIndex >= 0 && highlightIndex < orderedList.length) {
    e.preventDefault();
    onChange(orderedList[highlightIndex].name);
    setOpen(false);
    setQuery("");
  }
}}
```

**Step 4: Highlight the active item**

Replace the render logic for font items (the IIFE inside the scrollable div). Instead of the existing IIFE, map over `orderedList`:

```tsx
{orderedList.map((f, idx) => (
  <React.Fragment key={f.name}>
    {/* Show "Recommended" header before first item if it's the recommended font */}
    {idx === 0 && recommendedFont && f.name === recommendedFont && (
      <div className="px-3 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wider text-white/30">
        Recommended
      </div>
    )}
    {idx === 1 && recommendedFont && orderedList[0]?.name === recommendedFont && (
      <div className="mx-3 border-t border-white/5" />
    )}
    <button
      onClick={() => {
        onChange(f.name);
        setOpen(false);
        setQuery("");
      }}
      className={cn(
        "flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors",
        highlightIndex === idx
          ? "bg-white/15 text-white"
          : f.name === value
          ? "text-white hover:bg-white/10"
          : "text-white/70 hover:bg-white/10"
      )}
    >
      <span style={{ fontFamily: f.family }}>{f.name}</span>
      <span className="text-white/30 text-[10px]">{f.category}</span>
    </button>
  </React.Fragment>
))}
```

Add `import React from "react"` if not already present (it's not needed in React 19 JSX transform, but `React.Fragment` with key needs it -- alternatively use `<Fragment key={}>` with import from react).

**Step 5: Scroll highlighted item into view**

Add a ref for the scrollable container and scroll on highlight change:

```tsx
const listRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (highlightIndex >= 0 && listRef.current) {
    const items = listRef.current.querySelectorAll("button");
    items[highlightIndex]?.scrollIntoView({ block: "nearest" });
  }
}, [highlightIndex]);
```

Add `ref={listRef}` to the `<div className="max-h-48 overflow-y-auto">` element.

**Step 6: Verify build**

```bash
cd vibe && npm run build
```

**Step 7: Commit**

```bash
git add vibe/components/controls/typography-section.tsx
git commit -m "feat: add arrow key navigation to font picker dropdown"
```

---

## Task 10: Add undo/redo

**Files:**
- Create: `vibe/lib/use-history.ts`
- Modify: `vibe/app/page.tsx`

**Step 1: Create the history hook**

Create `vibe/lib/use-history.ts`:

```tsx
"use client";

import { useState, useCallback, useEffect } from "react";

interface UseHistoryReturn<T> {
  state: T;
  set: (value: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const MAX_HISTORY = 30;

export function useHistory<T>(initial: T): UseHistoryReturn<T> {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setPresent((prev) => {
      const next = typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
      if (next === prev) return prev;
      setPast((p) => [...p.slice(-(MAX_HISTORY - 1)), prev]);
      setFuture([]);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      const newPast = p.slice(0, -1);
      setPresent((curr) => {
        setFuture((f) => [curr, ...f]);
        return previous;
      });
      return newPast;
    });
  }, []);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      const newFuture = f.slice(1);
      setPresent((curr) => {
        setPast((p) => [...p, curr]);
        return next;
      });
      return newFuture;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (isMod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return { state: present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}
```

**Step 2: Wire into page.tsx**

In `vibe/app/page.tsx`, replace the `useState` for `lang` with `useHistory`:

Replace:
```tsx
import { useEffect, useMemo, useState } from "react";
```
with:
```tsx
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "@/lib/use-history";
```

Replace:
```tsx
const [lang, setLang] = useState<DesignLanguage>(DEFAULT_DESIGN);
```
with:
```tsx
const { state: lang, set: setLang, undo, redo, canUndo, canRedo } = useHistory<DesignLanguage>(DEFAULT_DESIGN);
```

**Step 3: Add undo/redo buttons to the header**

In the `<header>` element (around line 122), add undo/redo buttons after the title area:

```tsx
<header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
  <div className="flex items-center gap-3">
    <span className="text-sm font-semibold tracking-tight text-white">Vibe</span>
    <span className="text-xs text-white/50">Design Language Generator</span>
    {/* Undo/Redo */}
    <div className="flex items-center gap-0.5 ml-2 border-l border-white/10 pl-3">
      <button
        onClick={undo}
        disabled={!canUndo}
        title="Undo (Cmd+Z)"
        className={cn(
          "rounded p-1 transition-colors",
          canUndo ? "text-white/50 hover:text-white hover:bg-white/10" : "text-white/15 cursor-default"
        )}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path d="M4 7h8a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 4L4 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        title="Redo (Cmd+Shift+Z)"
        className={cn(
          "rounded p-1 transition-colors",
          canRedo ? "text-white/50 hover:text-white hover:bg-white/10" : "text-white/15 cursor-default"
        )}
      >
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path d="M12 7H4a3 3 0 0 0 0 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  </div>
  <div className="flex items-center gap-2 text-[11px] text-white/30">
    <span>by</span>
    <span className="text-white/50">Upcurious</span>
  </div>
</header>
```

**Step 4: Verify build**

```bash
cd vibe && npm run build
```

**Step 5: Commit**

```bash
git add vibe/lib/use-history.ts vibe/app/page.tsx
git commit -m "feat: add undo/redo with Cmd+Z keyboard shortcuts and header buttons"
```

---

## Task 11: Add download `.cursorrules` file button

**Files:**
- Modify: `vibe/components/export-bar.tsx`

**Step 1: Add download helper function**

Inside `ExportBar`, add a download function after the `copyShareUrl` function (around line 52):

```tsx
function downloadAsFile() {
  const text = generatePrompt(lang, "cursorrules");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = ".cursorrules";
  a.click();
  URL.revokeObjectURL(url);
}
```

**Step 2: Add download button (visible only when cursor rules format is selected)**

In the bottom bar, after the "Share link" button (around line 143), add:

```tsx
{format === "cursorrules" && (
  <button
    onClick={downloadAsFile}
    className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white/80"
  >
    Download .cursorrules
  </button>
)}
```

**Step 3: Verify build**

```bash
cd vibe && npm run build
```

**Step 4: Commit**

```bash
git add vibe/components/export-bar.tsx
git commit -m "feat: add download button for .cursorrules file export"
```

---

## Task 12: Add randomize / "Surprise me" button

**Files:**
- Modify: `vibe/app/page.tsx`
- Modify: `vibe/lib/presets.ts`

**Step 1: Add randomizer function to presets.ts**

At the bottom of `vibe/lib/presets.ts`, add:

```tsx
import { getColorVariants, getTypographyVariants } from "./variants";

export function getRandomDesign(): DesignLanguage {
  const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
  const colorVariants = getColorVariants(preset.id);
  const typoVariants = getTypographyVariants(preset.id);

  const colors = colorVariants.length > 0
    ? colorVariants[Math.floor(Math.random() * colorVariants.length)].values
    : preset.values.colors;

  const typography = typoVariants.length > 0
    ? typoVariants[Math.floor(Math.random() * typoVariants.length)].values
    : preset.values.typography;

  return {
    ...preset.values,
    colors,
    typography,
  };
}
```

**Step 2: Add "Surprise me" button to page.tsx header**

Import the new function:

```tsx
import { DEFAULT_DESIGN, getPreset, getRandomDesign } from "@/lib/presets";
```

Add a handler in the `Page` component:

```tsx
function randomize() {
  setLang(getRandomDesign());
  setOpenSection("color");
}
```

Add the button in the header, after the undo/redo group:

```tsx
<button
  onClick={randomize}
  title="Surprise me — random preset + variant"
  className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
>
  Surprise me
</button>
```

**Step 3: Verify build**

```bash
cd vibe && npm run build
```

**Step 4: Commit**

```bash
git add vibe/lib/presets.ts vibe/app/page.tsx
git commit -m "feat: add Surprise Me button for random preset + variant selection"
```

---

## Summary

| # | Type | Description | Files touched |
|---|------|-------------|---------------|
| 1 | Refactor | Extract shared RadioRow | 3 |
| 2 | Refactor | Deduplicate shadow CSS map | 1 |
| 3 | Refactor | Use CSS var for spacing | 5 |
| 4 | Refactor | Move getButtonStyles to utility | 4 |
| 5 | Fix | Responsive preview cards grid | 1 |
| 6 | UX | Smooth preview transitions | 1 |
| 7 | Fix | Color picker overflow clamp | 1 |
| 8 | Perf | Memoize generatePrompt | 1 |
| 9 | UX | Keyboard nav in font picker | 1 |
| 10 | Feature | Undo/redo with Cmd+Z | 2 |
| 11 | Feature | Download .cursorrules file | 1 |
| 12 | Feature | Surprise me / randomize | 2 |
