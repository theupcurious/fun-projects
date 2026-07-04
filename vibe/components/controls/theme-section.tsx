"use client";

import type { ThemeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ThemeSectionProps {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

export function ThemeSection({ mode, onChange }: ThemeSectionProps) {
  return (
    <div>
      <div className="mb-2 text-[11px] text-white/50">Theme mode</div>
      <div className="flex gap-2">
        {(["light", "dark"] as ThemeMode[]).map((m) => (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm transition-colors",
              mode === m
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
            )}
          >
            <span
              className={cn(
                "h-3.5 w-3.5 rounded-full border",
                m === "light" ? "border-neutral-300 bg-white" : "border-white/20 bg-neutral-800"
              )}
            />
            <span className="capitalize">{m}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
