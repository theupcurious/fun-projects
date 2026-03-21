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
                      className="mt-0.5 text-[9px] leading-snug opacity-70 line-clamp-1"
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
