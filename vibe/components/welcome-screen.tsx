"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
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
      className="flex min-h-[172px] w-full cursor-pointer flex-col justify-between overflow-hidden p-5 text-left transition-all duration-700 ease-out hover:-translate-y-1 hover:shadow-xl"
      style={{
        backgroundColor: colors.background,
        borderRadius: `${Math.max(shape.borderRadius, 8)}px`,
        border: `1px solid ${colors.border}`,
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
        className="mt-4 flex w-full items-center justify-center gap-1.5 py-2 text-center text-[11px] font-semibold"
        style={{
          backgroundColor: isFilled ? colors.primary : "transparent",
          color: isFilled ? colors.background : colors.primary,
          border: isFilled ? "none" : `1.5px solid ${colors.primary}`,
          borderRadius: `${shape.borderRadius}px`,
          fontFamily: typography.bodyFont,
        }}
      >
        Start here
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  );
}

function DefaultPreview() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#f7f8fb] p-4 text-[#171717] shadow-2xl shadow-black/30">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-3 w-20 rounded-full bg-slate-300" />
        <div className="h-7 w-20 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-3 h-5 w-3/4 rounded bg-slate-200" />
        <div className="mb-2 h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-2 h-7 w-7 rounded-lg bg-blue-100" />
            <div className="mb-2 h-3 w-16 rounded bg-slate-200" />
            <div className="h-2 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
      <div className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        AI default
      </div>
    </div>
  );
}

function LanguagePreview() {
  return (
    <div className="rounded-xl border border-[#c8a96e]/40 bg-[#faf8f5] p-4 text-[#1a1a1a] shadow-2xl shadow-[#c8a96e]/10">
      <div className="mb-4 flex items-center justify-between border-b border-[#d4cfc8] pb-3">
        <div className="font-serif text-xl font-bold">Editorial restraint</div>
        <div className="border border-[#1a1a1a] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
          Prompt
        </div>
      </div>
      <div className="mb-4">
        <div className="mb-2 font-serif text-3xl font-bold leading-none">
          A designed product, not a generated one.
        </div>
        <p className="text-xs leading-relaxed text-[#6b6560]">
          Serif-led hierarchy, warm neutral surfaces, low-radius components, one confident accent.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {["Visual pillars", "Avoid list", "UI tokens", "Layout rules"].map((item) => (
          <div key={item} className="border border-[#d4cfc8] bg-[#f0ece4] p-3">
            <div className="mb-2 h-1.5 w-10 bg-[#e05a2b]" />
            <div className="font-serif text-sm font-bold">{item}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a7560]">
        Your design language
      </div>
    </div>
  );
}

function ProofPanel() {
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="absolute -left-6 top-10 hidden w-[48%] -rotate-3 opacity-70 blur-[0.2px] md:block">
        <DefaultPreview />
      </div>
      <div className="relative ml-auto w-full md:w-[78%]">
        <LanguagePreview />
      </div>
    </div>
  );
}

function FlowStrip() {
  const steps = [
    ["Answer the brief", "Product type, tone, and what to avoid."],
    ["Preview the language", "See the same system on realistic UI."],
    ["Copy the prompt", "Paste rules into Cursor, Claude, or ChatGPT."],
  ];

  return (
    <div className="grid w-full max-w-4xl gap-2 border-y border-white/10 py-4 md:grid-cols-3">
      {steps.map(([title, body], index) => (
        <div key={title} className="flex gap-3 px-2 py-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-[10px] text-white/55">
            {index + 1}
          </div>
          <div>
            <div className="text-sm font-medium text-white/85">{title}</div>
            <div className="mt-1 text-xs leading-relaxed text-white/40">{body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function WelcomeScreen({ onStartGuided, onSkip, onSelectPreset }: WelcomeScreenProps) {
  const presets = GALLERY_PRESETS.map((id) => PRESETS.find((p) => p.id === id)!);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#0d0d0d] text-white">
      <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">
        <section
          className="mx-auto grid min-h-[calc(100vh-112px)] w-full max-w-6xl items-center gap-10 pb-10 md:grid-cols-[0.92fr_1.08fr]"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(12px)",
            transition: "opacity 700ms ease, transform 700ms ease",
          }}
        >
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-white/35">
              Upcurious Presents
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.95] tracking-tight text-white md:text-7xl">
              Your AI app does not need to look AI-made.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/55 md:text-lg">
              Vibe turns a few product and taste choices into a design-language prompt your coding tools can actually follow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onStartGuided}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/90"
              >
                <Sparkles className="h-4 w-4" />
                Find my style
              </button>
              <a
                href="#starting-points"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/65 transition-colors hover:border-white/30 hover:text-white"
              >
                Browse presets
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-xs text-white/45">
              <div>
                <div className="text-lg font-semibold text-white">60 sec</div>
                <div>from blank taste to direction</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">6</div>
                <div>project preview types</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white">1 prompt</div>
                <div>for your coding agent</div>
              </div>
            </div>
          </div>

          <ProofPanel />
        </section>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10">
          <FlowStrip />

          <section id="starting-points" className="w-full pb-12">
            <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/30">
                  Starting points
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Pick a direction or let the interview find one.
                </h2>
              </div>
              <button
                onClick={onSkip}
                className="self-start rounded-lg border border-white/10 px-4 py-2 text-xs text-white/45 transition-colors hover:border-white/25 hover:text-white/75 md:self-auto"
              >
                Start fresh
              </button>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {presets.map((preset, i) => (
                <GalleryCard key={preset.id} preset={preset} delay={150 + i * 80} onClick={() => onSelectPreset(preset.id)} />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/5 py-3 text-center">
        <a
          href="https://theupcurious.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs tracking-[0.2em] text-white/30 transition-colors hover:text-white/60"
        >
          by Upcurious
        </a>
      </div>
    </div>
  );
}
