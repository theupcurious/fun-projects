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
