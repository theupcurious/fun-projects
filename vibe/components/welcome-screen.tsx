"use client";

import { useEffect, useState } from "react";
import { PRESETS } from "@/lib/presets";
import type { Preset } from "@/lib/presets";
import type { PresetId } from "@/lib/types";

const GALLERY_PRESETS: PresetId[] = ["neon", "editorial", "brutalist", "candy", "luxury", "organic", "cyberpunk", "handcraft", "monochrome"];

interface WelcomeScreenProps {
  onStartGuided: () => void;
  onSkip: () => void;
  onSelectPreset: (id: PresetId) => void;
}

function GalleryCard({ preset, delay, onClick }: { preset: Preset; delay: number; onClick: () => void }) {
  const { colors, typography, shape, components } = preset.values;
  const isFilled = components.buttonStyle === "filled";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <button
      onClick={onClick}
      className="flex flex-col justify-between overflow-hidden p-5 transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-xl cursor-pointer text-left w-full"
      style={{
        backgroundColor: colors.background,
        borderRadius: `${Math.max(shape.borderRadius, 8)}px`,
        border: `1px solid ${colors.border}`,
        minHeight: 180,
        opacity: visible ? 1 : 0,
        transform: visible ? undefined : "translateY(20px)",
        boxShadow: `0 2px 12px ${colors.primary}10`,
      }}
    >
      <div>
        <div
          className="mb-3 text-lg font-bold leading-tight"
          style={{
            color: colors.text,
            fontFamily: typography.headingFont,
            fontWeight: typography.headingWeight,
            textTransform: typography.headingTransform === "uppercase" ? "uppercase" : undefined,
            letterSpacing: `${typography.letterSpacing * 0.1}em`,
          }}
        >
          {preset.name}
        </div>
        <div className="mb-4 flex gap-1.5">
          {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
            <div key={i} className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
        <p
          className="text-xs leading-relaxed"
          style={{ color: colors.textMuted, fontFamily: typography.bodyFont }}
        >
          {preset.description}
        </p>
      </div>
      <div
        className="mt-4 w-full py-2 text-center text-[11px] font-semibold"
        style={{
          backgroundColor: isFilled ? colors.primary : "transparent",
          color: isFilled ? colors.background : colors.primary,
          border: isFilled ? "none" : `1.5px solid ${colors.primary}`,
          borderRadius: `${shape.borderRadius}px`,
          fontFamily: typography.bodyFont,
        }}
      >
        Get started
      </div>
    </button>
  );
}

export function WelcomeScreen({ onStartGuided, onSkip, onSelectPreset }: WelcomeScreenProps) {
  const presets = GALLERY_PRESETS.map((id) => PRESETS.find((p) => p.id === id)!);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    setHeaderVisible(true);
    const timer = setTimeout(() => setCtaVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto bg-[#0d0d0d] px-6 py-10">
      {/* Branding — fades in first */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "none" : "translateY(-10px)",
        }}
      >
        <div className="mb-1 text-center text-3xl font-bold tracking-tight text-white">
          Vibe
        </div>
        <p className="mb-8 text-center text-sm text-white/50">
          Pick a style, and get the prompt for the design
        </p>
      </div>

      {/* Gallery grid — cards stagger in */}
      <div className="mb-10 grid w-full max-w-2xl grid-cols-2 gap-3 md:grid-cols-3">
        {presets.map((preset, i) => (
          <GalleryCard key={preset.id} preset={preset} delay={150 + i * 100} onClick={() => onSelectPreset(preset.id)} />
        ))}
      </div>

      {/* CTAs — fade in after cards */}
      <div
        className="flex w-full max-w-xs flex-col gap-2.5 transition-all duration-700 ease-out"
        style={{
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "none" : "translateY(10px)",
        }}
      >
        <button
          onClick={onStartGuided}
          className="rounded-lg border border-white/15 px-6 py-3 text-sm text-white/50 transition-colors hover:border-white/30 hover:text-white/80"
        >
          Get more styles
        </button>
        <button
          onClick={onSkip}
          className="py-2 text-xs text-white/25 transition-colors hover:text-white/50"
        >
          Start fresh
        </button>
        <p className="mt-2 text-center text-[11px] text-white/20">by Upcurious</p>
      </div>
    </div>
  );
}
