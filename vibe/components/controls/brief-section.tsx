"use client";

import type { DesignBrief, ProjectType, ToneAxisKey } from "@/lib/types";
import { AVOIDANCE_OPTIONS, PROJECT_TYPES, TONE_AXES } from "@/lib/design-brief";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface BriefSectionProps {
  brief: DesignBrief;
  onChange: (brief: DesignBrief) => void;
  compact?: boolean;
}

export function BriefSection({ brief, onChange, compact = false }: BriefSectionProps) {
  function updateProject(projectType: ProjectType) {
    onChange({ ...brief, projectType });
  }

  function updateTone(key: ToneAxisKey, value: number) {
    onChange({
      ...brief,
      tone: {
        ...brief.tone,
        [key]: value,
      },
    });
  }

  function toggleAvoidance(id: string) {
    const exists = brief.avoidances.includes(id);
    onChange({
      ...brief,
      avoidances: exists
        ? brief.avoidances.filter((item) => item !== id)
        : [...brief.avoidances, id],
    });
  }

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">
          What are you building?
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PROJECT_TYPES.map((project) => (
            <button
              key={project.id}
              onClick={() => updateProject(project.id)}
              className={cn(
                "rounded-md border px-2.5 py-2 text-left transition-colors",
                brief.projectType === project.id
                  ? "border-white/35 bg-white/15 text-white"
                  : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.07] hover:text-white/75"
              )}
            >
              <div className="text-[11px] font-medium">{project.label}</div>
              <div className="mt-0.5 text-[9px] leading-snug text-white/35">
                {project.short}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">
          How should it feel?
        </div>
        <div className="space-y-3">
          {TONE_AXES.map((axis) => (
            <div key={axis.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] text-white/55">{axis.label}</span>
                <span className="text-[10px] text-white/35">
                  {brief.tone[axis.key] <= 1 ? axis.low : brief.tone[axis.key] >= 3 ? axis.high : "Balanced"}
                </span>
              </div>
              <Slider
                min={0}
                max={4}
                step={1}
                value={[brief.tone[axis.key]]}
                onValueChange={(v) => updateTone(axis.key, Array.isArray(v) ? v[0] : v)}
                className="w-full"
              />
              <div className="mt-1 flex justify-between text-[9px] text-white/25">
                <span>{axis.low}</span>
                <span>{axis.high}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-white/40">
          What should it avoid?
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AVOIDANCE_OPTIONS.map((option) => {
            const active = brief.avoidances.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleAvoidance(option.id)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-[11px] transition-colors",
                  active
                    ? "border-white/35 bg-white/15 text-white"
                    : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/[0.07] hover:text-white/70"
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
