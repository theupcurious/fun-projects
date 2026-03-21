"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker, HexColorInput } from "react-colorful";
import type { ColorPalette } from "@/lib/types";
import { checkPaletteContrast } from "@/lib/contrast";
import type { ColorVariant } from "@/lib/variants";
import { colorsMatch } from "@/lib/variants";
import { cn } from "@/lib/utils";

interface ColorSectionProps {
  colors: ColorPalette;
  onChange: (colors: ColorPalette) => void;
  variants?: ColorVariant[];
}

const TOKEN_LABELS: { key: keyof ColorPalette; label: string; hint: string }[] = [
  { key: "primary", label: "Primary", hint: "CTAs, key actions" },
  { key: "secondary", label: "Secondary", hint: "Supporting accent" },
  { key: "accent", label: "Accent", hint: "Highlights, badges" },
  { key: "background", label: "Background", hint: "Page background" },
  { key: "surface", label: "Surface", hint: "Cards, panels" },
  { key: "text", label: "Text", hint: "Primary body text" },
  { key: "textMuted", label: "Text muted", hint: "Captions, secondary" },
  { key: "border", label: "Border", hint: "Dividers, outlines" },
];

const PICKER_HEIGHT = 268; // approx height of picker + input

function ColorSwatch({
  value,
  label,
  hint,
  onChange,
}: {
  value: string;
  label: string;
  hint: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || pickerRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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

  return (
    <div>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/5 transition-colors"
      >
        <div
          className="h-6 w-6 flex-shrink-0 rounded border border-white/20"
          style={{ background: value }}
        />
        <div className="min-w-0 flex-1 text-left">
          <div className="text-xs font-medium text-white/90">{label}</div>
          <div className="text-[10px] text-white/40">{hint}</div>
        </div>
        <div className="font-mono text-[10px] text-white/40">{value.toUpperCase()}</div>
      </button>

      {open &&
        createPortal(
          <div
            ref={pickerRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 9999 }}
            className="rounded-lg border border-white/10 bg-[#1a1a1a] p-3 shadow-xl"
          >
            <HexColorPicker color={value} onChange={onChange} />
            <div className="mt-2 flex items-center gap-1.5">
              <span className="font-mono text-xs text-white/40">#</span>
              <HexColorInput
                color={value}
                onChange={onChange}
                prefixed={false}
                className="w-full rounded border border-white/20 bg-white/5 px-2 py-1 font-mono text-xs text-white/90 outline-none focus:border-white/40"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export function ColorSection({ colors, onChange, variants }: ColorSectionProps) {
  const warnings = checkPaletteContrast(colors);

  function update(key: keyof ColorPalette, value: string) {
    onChange({ ...colors, [key]: value });
  }

  return (
    <div className="space-y-1">
      {variants && variants.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Palettes</div>
          <div className="flex gap-1.5">
            {variants.map((v) => {
              const active = colorsMatch(colors, v.values);
              return (
                <button
                  key={v.name}
                  onClick={() => onChange(v.values)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-md border px-2 py-2 transition-colors",
                    active
                      ? "border-white/30 bg-white/10"
                      : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <div className="flex gap-1">
                    {[v.values.primary, v.values.secondary, v.values.accent].map((c, i) => (
                      <div key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className={cn(
                    "text-[10px] leading-tight",
                    active ? "text-white/80" : "text-white/40"
                  )}>
                    {v.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Customize</div>
      {TOKEN_LABELS.map(({ key, label, hint }) => (
        <ColorSwatch
          key={key}
          value={colors[key]}
          label={label}
          hint={hint}
          onChange={(v) => update(key, v)}
        />
      ))}

      {warnings.length > 0 && (
        <div className="mt-3 rounded-md border border-amber-500/20 bg-amber-500/10 px-3 py-2">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
            Contrast warnings
          </div>
          {warnings.map((w) => (
            <div key={w.pair} className="text-[10px] text-amber-300/80">
              {w.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
