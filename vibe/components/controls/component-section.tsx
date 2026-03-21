"use client";

import type { ComponentStyle, ButtonStyle, CardStyle, InputStyle, LinkTreatment } from "@/lib/types";
import { cn } from "@/lib/utils";
import { COMPONENT_VARIANTS, componentMatch } from "@/lib/variants";
import { RadioRow } from "./radio-row";

interface ComponentSectionProps {
  components: ComponentStyle;
  onChange: (c: ComponentStyle) => void;
}

export function ComponentSection({ components, onChange }: ComponentSectionProps) {
  function update<K extends keyof ComponentStyle>(key: K, value: ComponentStyle[K]) {
    onChange({ ...components, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-white/40">Presets</div>
        <div className="flex gap-1.5">
          {COMPONENT_VARIANTS.map((v) => {
            const active = componentMatch(components, v.values);
            return (
              <button
                key={v.name}
                onClick={() => onChange(v.values)}
                className={cn(
                  "flex-1 rounded-md border px-2 py-2 text-center transition-colors",
                  active
                    ? "border-white/30 bg-white/10"
                    : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                )}
              >
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
      <RadioRow<ButtonStyle>
        label="Button style"
        value={components.buttonStyle}
        options={[
          { value: "filled", label: "Filled" },
          { value: "outline", label: "Outline" },
          { value: "ghost", label: "Ghost" },
          { value: "underline", label: "Underline" },
        ]}
        onChange={(v) => update("buttonStyle", v)}
      />

      <RadioRow<CardStyle>
        label="Card style"
        value={components.cardStyle}
        options={[
          { value: "flat", label: "Flat" },
          { value: "bordered", label: "Bordered" },
          { value: "elevated", label: "Elevated" },
          { value: "glass", label: "Glass" },
        ]}
        onChange={(v) => update("cardStyle", v)}
      />

      <RadioRow<InputStyle>
        label="Input style"
        value={components.inputStyle}
        options={[
          { value: "underline", label: "Underline" },
          { value: "bordered", label: "Bordered" },
          { value: "filled", label: "Filled" },
        ]}
        onChange={(v) => update("inputStyle", v)}
      />

      <RadioRow<LinkTreatment>
        label="Link treatment"
        value={components.linkTreatment}
        options={[
          { value: "underline", label: "Underline" },
          { value: "color-only", label: "Color only" },
          { value: "arrow", label: "→ Arrow" },
        ]}
        onChange={(v) => update("linkTreatment", v)}
      />
    </div>
  );
}
