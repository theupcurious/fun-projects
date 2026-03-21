"use client";

import type { Shape, SpacingDensity, ShadowStyle, BorderWeight } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { SHAPE_VARIANTS, shapeMatch } from "@/lib/variants";
import { RadioRow } from "./radio-row";

interface ShapeSectionProps {
  shape: Shape;
  onChange: (s: Shape) => void;
}

export function ShapeSection({ shape, onChange }: ShapeSectionProps) {
  function update<K extends keyof Shape>(key: K, value: Shape[K]) {
    onChange({ ...shape, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Presets</div>
        <div className="flex gap-1.5">
          {SHAPE_VARIANTS.map((v) => {
            const active = shapeMatch(shape, v.values);
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
                <div
                  className="h-5 w-8 border border-white/25"
                  style={{ borderRadius: `${v.values.borderRadius}px` }}
                />
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

      <div className="text-[10px] uppercase tracking-wider text-white/40">Customize</div>
      <div>
        <div className="mb-2 flex justify-between">
          <span className="text-[11px] text-white/50">Border radius</span>
          <span className="font-mono text-[11px] text-white/70">{shape.borderRadius}px</span>
        </div>
        <Slider
          min={0}
          max={24}
          step={2}
          value={[shape.borderRadius]}
          onValueChange={(v) => update("borderRadius", Array.isArray(v) ? v[0] : v)}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-[9px] text-white/25">
          <span>Sharp</span>
          <span>Pill</span>
        </div>
      </div>

      <RadioRow<SpacingDensity>
        label="Spacing density"
        value={shape.spacingDensity}
        options={[
          { value: "compact", label: "Compact" },
          { value: "default", label: "Default" },
          { value: "generous", label: "Generous" },
        ]}
        onChange={(v) => update("spacingDensity", v)}
      />

      <RadioRow<ShadowStyle>
        label="Shadows"
        value={shape.shadowStyle}
        options={[
          { value: "none", label: "None" },
          { value: "subtle", label: "Subtle" },
          { value: "elevated", label: "Elevated" },
          { value: "dramatic", label: "Dramatic" },
        ]}
        onChange={(v) => update("shadowStyle", v)}
      />

      <RadioRow<BorderWeight>
        label="Border weight"
        value={shape.borderWeight}
        options={[
          { value: "none", label: "None" },
          { value: "hairline", label: "Hairline" },
          { value: "medium", label: "Medium" },
          { value: "heavy", label: "Heavy" },
        ]}
        onChange={(v) => update("borderWeight", v)}
      />
    </div>
  );
}
