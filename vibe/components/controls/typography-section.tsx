"use client";

import { useState, useRef, useEffect } from "react";
import { CURATED_FONTS } from "@/lib/fonts";
import type { Typography, HeadingTransform, PresetId } from "@/lib/types";
import { getPreset } from "@/lib/presets";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { TypographyVariant } from "@/lib/variants";
import { typographyMatch } from "@/lib/variants";

interface TypographySectionProps {
  typography: Typography;
  onChange: (t: Typography) => void;
  presetId: PresetId | null;
  variants?: TypographyVariant[];
}

function FontPicker({
  value,
  label,
  onChange,
  recommendedFont,
}: {
  value: string;
  label: string;
  onChange: (v: string) => void;
  recommendedFont?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  const filtered = CURATED_FONTS.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const orderedList = (() => {
    const recFont = recommendedFont
      ? filtered.find((f) => f.name === recommendedFont)
      : undefined;
    const rest = recFont
      ? filtered.filter((f) => f.name !== recommendedFont)
      : filtered;
    return recFont ? [recFont, ...rest] : rest;
  })();

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("button");
      items[highlightIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  const selected = CURATED_FONTS.find((f) => f.name === value);

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-1 text-[11px] text-white/50">{label}</div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-left text-xs text-white/90 hover:bg-white/10 transition-colors"
      >
        <span style={{ fontFamily: selected?.family }}>{value}</span>
        <span className="text-white/30 text-[10px]">{selected?.category}</span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl">
          <div className="border-b border-white/10 p-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightIndex(-1);
              }}
              placeholder="Search fonts…"
              className="w-full bg-transparent text-xs text-white/80 placeholder:text-white/30 outline-none"
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
            />
          </div>
          <div ref={listRef} className="max-h-48 overflow-y-auto">
            {(() => {
              const recFont = recommendedFont
                ? filtered.find((f) => f.name === recommendedFont)
                : undefined;
              const rest = recFont
                ? orderedList.slice(1)
                : orderedList;

              return (
                <>
                  {recFont && (
                    <>
                      <div className="px-3 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wider text-white/30">
                        Recommended
                      </div>
                      <button
                        onClick={() => {
                          onChange(recFont.name);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={cn(
                          "flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors",
                          highlightIndex === 0
                            ? "bg-white/15 text-white"
                            : recFont.name === value
                            ? "text-white hover:bg-white/10"
                            : "text-white/70 hover:bg-white/10"
                        )}
                      >
                        <span style={{ fontFamily: recFont.family }}>{recFont.name}</span>
                        <span className="text-white/30 text-[10px]">{recFont.category}</span>
                      </button>
                      <div className="mx-3 border-t border-white/5" />
                    </>
                  )}
                  {rest.map((f, i) => {
                    const idx = recFont ? i + 1 : i;
                    return (
                      <button
                        key={f.name}
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
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

const TRANSFORM_OPTIONS: { value: HeadingTransform; label: string }[] = [
  { value: "none", label: "Normal" },
  { value: "uppercase", label: "UPPER" },
  { value: "italic", label: "Italic" },
];

export function TypographySection({ typography, onChange, presetId, variants }: TypographySectionProps) {
  const preset = presetId ? getPreset(presetId) : undefined;
  const rec = preset?.values.typography;

  function update<K extends keyof Typography>(key: K, value: Typography[K]) {
    onChange({ ...typography, [key]: value });
  }

  return (
    <div className="space-y-4">
      {variants && variants.length > 0 && (
        <div>
          <div className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Pairings</div>
          <div className="flex gap-1.5">
            {variants.map((v) => {
              const active = typographyMatch(typography, v.values);
              return (
                <button
                  key={v.name}
                  onClick={() => onChange(v.values)}
                  className={cn(
                    "flex flex-1 flex-col gap-0.5 rounded-md border px-2 py-2 text-left transition-colors",
                    active
                      ? "border-white/30 bg-white/10"
                      : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <span className={cn("text-[10px] leading-tight truncate", active ? "text-white/80" : "text-white/40")}>
                    {v.name}
                  </span>
                  <span className="text-[9px] text-white/25 truncate">
                    {v.values.headingFont.split(" ")[0]} + {v.values.bodyFont.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="text-[10px] uppercase tracking-wider text-white/40">Customize</div>
      <FontPicker
        label="Heading font"
        value={typography.headingFont}
        onChange={(v) => update("headingFont", v)}
        recommendedFont={rec?.headingFont}
      />
      <FontPicker
        label="Body font"
        value={typography.bodyFont}
        onChange={(v) => update("bodyFont", v)}
        recommendedFont={rec?.bodyFont}
      />
      <FontPicker
        label="Mono font"
        value={typography.monoFont}
        onChange={(v) => update("monoFont", v)}
        recommendedFont={rec?.monoFont}
      />

      <div>
        <div className="mb-2 flex justify-between">
          <span className="text-[11px] text-white/50">Heading weight</span>
          <span className="font-mono text-[11px] text-white/70">{typography.headingWeight}</span>
        </div>
        <Slider
          min={300}
          max={900}
          step={100}
          value={[typography.headingWeight]}
          onValueChange={(v) => update("headingWeight", Array.isArray(v) ? v[0] : v)}
          className="w-full"
        />
      </div>

      <div>
        <div className="mb-2 flex justify-between">
          <span className="text-[11px] text-white/50">Body size</span>
          <span className="font-mono text-[11px] text-white/70">{typography.bodySize}px</span>
        </div>
        <Slider
          min={13}
          max={20}
          step={1}
          value={[typography.bodySize]}
          onValueChange={(v) => update("bodySize", Array.isArray(v) ? v[0] : v)}
          className="w-full"
        />
      </div>

      <div>
        <div className="mb-2 flex justify-between">
          <span className="text-[11px] text-white/50">Letter spacing</span>
          <span className="font-mono text-[11px] text-white/70">
            {(typography.letterSpacing * 0.02).toFixed(2)}em
          </span>
        </div>
        <Slider
          min={-2}
          max={4}
          step={1}
          value={[typography.letterSpacing]}
          onValueChange={(v) => update("letterSpacing", Array.isArray(v) ? v[0] : v)}
          className="w-full"
        />
      </div>

      <div>
        <div className="mb-2 text-[11px] text-white/50">Heading style</div>
        <div className="flex gap-1.5">
          {TRANSFORM_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("headingTransform", opt.value)}
              className={cn(
                "flex-1 rounded-md border px-2 py-1.5 text-xs transition-colors",
                typography.headingTransform === opt.value
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
