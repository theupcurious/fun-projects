"use client";

import { useState } from "react";
import type { DesignBrief, PresetId, ProjectType, ThemeMode, ToneAxisKey, ToneProfile } from "@/lib/types";
import { getPresetsByGroup } from "@/lib/presets";
import { AVOIDANCE_OPTIONS, DEFAULT_BRIEF, PROJECT_TYPES, TONE_AXES, toneForPreset } from "@/lib/design-brief";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface GuidedFlowProps {
  onComplete: (presetId: PresetId, mode: ThemeMode, brief: DesignBrief) => void;
  onBack: () => void;
}

type Step = 1 | 2 | 3 | 4;

export function GuidedFlow({ onComplete, onBack }: GuidedFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [selectedPreset, setSelectedPreset] = useState<PresetId>("editorial");
  const [projectType, setProjectType] = useState<ProjectType>(DEFAULT_BRIEF.projectType);
  const [tone, setTone] = useState<ToneProfile>(DEFAULT_BRIEF.tone);
  const [avoidances, setAvoidances] = useState<string[]>(DEFAULT_BRIEF.avoidances);
  const [mode, setMode] = useState<ThemeMode>("light");

  function updateTone(key: ToneAxisKey, value: number) {
    setTone((current) => ({ ...current, [key]: value }));
  }

  function toggleAvoidance(id: string) {
    setAvoidances((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function goBack() {
    if (step === 1) onBack();
    else setStep((current) => (current - 1) as Step);
  }

  function finish() {
    onComplete(selectedPreset, mode, {
      projectType,
      tone,
      avoidances,
    });
  }

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d]">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <button
          onClick={goBack}
          className="rounded-md px-2 py-1 text-xs text-white/45 transition-colors hover:bg-white/5 hover:text-white/75"
        >
          Back
        </button>
        <div className="flex flex-1 items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                s <= step ? "bg-white/45" : "bg-white/10"
              )}
            />
          ))}
        </div>
        <span className="text-[11px] text-white/35">Step {step} of 4</span>
      </div>

      <div className="flex flex-1 justify-center overflow-y-auto px-5 py-8">
        {step === 1 && (
          <div className="w-full max-w-2xl">
            <h2 className="mb-2 text-lg font-semibold text-white">What are you building?</h2>
            <p className="mb-7 text-sm text-white/45">
              The preview and prompt will adapt to this product shape.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJECT_TYPES.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setProjectType(project.id)}
                  className={cn(
                    "rounded-lg border p-4 text-left transition-colors",
                    projectType === project.id
                      ? "border-white/35 bg-white/15 text-white"
                      : "border-white/10 bg-white/[0.04] text-white/60 hover:bg-white/[0.07] hover:text-white/80"
                  )}
                >
                  <div className="text-sm font-semibold">{project.label}</div>
                  <div className="mt-1 text-xs leading-relaxed text-white/45">
                    {project.description}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-7 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-3xl">
            <h2 className="mb-2 text-lg font-semibold text-white">Pick a starting direction</h2>
            <p className="mb-7 text-sm text-white/45">
              This is only the base layer. The next steps make it yours.
            </p>
            <div className="space-y-7">
              {getPresetsByGroup().map(({ group, label, presets }) => (
                <div key={group}>
                  <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/55">
                    {label}
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {presets.map((preset) => {
                      const { colors, typography } = preset.values;
                      const isSelected = selectedPreset === preset.id;

                      return (
                        <button
                          key={preset.id}
                          onClick={() => {
                            setSelectedPreset(preset.id);
                            setTone(toneForPreset(preset.id));
                          }}
                          className={cn(
                            "group relative overflow-hidden rounded-lg border text-left transition-all duration-150",
                            isSelected
                              ? "border-white/45 ring-2 ring-white/25"
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
                              className="mt-1 line-clamp-1 text-[10px] leading-snug opacity-60"
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
            <div className="mt-7 flex justify-end">
              <button
                onClick={() => setStep(3)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Shape the tone
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full max-w-xl">
            <h2 className="mb-2 text-lg font-semibold text-white">Tune the feel</h2>
            <p className="mb-7 text-sm text-white/45">
              These choices turn the style into reusable design vocabulary.
            </p>
            <div className="space-y-5">
              {TONE_AXES.map((axis) => (
                <div key={axis.key} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{axis.label}</span>
                    <span className="text-xs text-white/45">
                      {tone[axis.key] <= 1 ? axis.low : tone[axis.key] >= 3 ? axis.high : "Balanced"}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={4}
                    step={1}
                    value={[tone[axis.key]]}
                    onValueChange={(v) => updateTone(axis.key, Array.isArray(v) ? v[0] : v)}
                    className="w-full"
                  />
                  <div className="mt-2 flex justify-between text-[10px] text-white/30">
                    <span>{axis.low}</span>
                    <span>{axis.high}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex justify-end">
              <button
                onClick={() => setStep(4)}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Set guardrails
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="w-full max-w-xl">
            <h2 className="mb-2 text-lg font-semibold text-white">What should the AI avoid?</h2>
            <p className="mb-7 text-sm text-white/45">
              Strong negative constraints help coding agents avoid their defaults.
            </p>
            <div className="mb-7 flex flex-wrap gap-2">
              {AVOIDANCE_OPTIONS.map((option) => {
                const active = avoidances.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleAvoidance(option.id)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm transition-colors",
                      active
                        ? "border-white/35 bg-white/15 text-white"
                        : "border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.07] hover:text-white/75"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="mb-7">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/45">
                Theme
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["light", "dark"] as ThemeMode[]).map((value) => (
                  <button
                    key={value}
                    onClick={() => setMode(value)}
                    className={cn(
                      "rounded-lg border px-5 py-5 text-sm font-medium capitalize transition-colors",
                      mode === value
                        ? "border-white/35 bg-white/15 text-white"
                        : "border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.07] hover:text-white/75"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={finish}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
              >
                Generate language
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
