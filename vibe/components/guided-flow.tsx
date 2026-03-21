"use client";

import { useState } from "react";
import type { PresetId, ThemeMode } from "@/lib/types";
import { getPresetsByGroup } from "@/lib/presets";
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
          <div className="w-full max-w-xl">
            <h2 className="mb-2 text-lg font-semibold text-white">Pick a vibe</h2>
            <p className="mb-8 text-sm text-white/40">
              Choose the aesthetic that fits your project.
            </p>
            <div className="space-y-8">
              {getPresetsByGroup().map(({ group, label, presets }) => (
                <div key={group}>
                  <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/60">
                    {label}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {presets.map((preset) => {
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
                          <div className="p-3.5">
                            <div className="mb-2.5 flex gap-1.5">
                              {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
                                <div key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
                              ))}
                            </div>
                            <div
                              className="text-xs font-bold leading-tight"
                              style={{
                                color: colors.text,
                                fontFamily: typography.headingFont,
                                textTransform: typography.headingTransform === "uppercase" ? "uppercase" : undefined,
                              }}
                            >
                              {preset.name}
                            </div>
                            <div
                              className="mt-1 text-[10px] leading-snug opacity-60"
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
              ))}
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
