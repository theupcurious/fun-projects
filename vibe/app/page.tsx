"use client";

import { useEffect, useMemo, useState } from "react";
import type { DesignLanguage, PresetId, ThemeMode } from "@/lib/types";
import { DEFAULT_DESIGN, getPreset, getRandomDesign } from "@/lib/presets";
import { useHistory } from "@/lib/use-history";
import { readDesignFromUrl } from "@/lib/url-state";
import { MoodPicker } from "@/components/mood-picker";
import { ColorSection } from "@/components/controls/color-section";
import { TypographySection } from "@/components/controls/typography-section";
import { ShapeSection } from "@/components/controls/shape-section";
import { ComponentSection } from "@/components/controls/component-section";
import { ThemeSection } from "@/components/controls/theme-section";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { PreviewNav } from "@/components/preview/preview-nav";
import { PreviewHero } from "@/components/preview/preview-hero";
import { PreviewCards } from "@/components/preview/preview-cards";
import { PreviewQuote } from "@/components/preview/preview-quote";
import { PreviewCta } from "@/components/preview/preview-cta";
import { PreviewFooter } from "@/components/preview/preview-footer";
import { ExportBar } from "@/components/export-bar";
import { FontLoader } from "@/components/font-loader";
import { WelcomeScreen } from "@/components/welcome-screen";
import { GuidedFlow } from "@/components/guided-flow";
import { cn } from "@/lib/utils";
import { invertPalette } from "@/lib/contrast";
import { getColorVariants, getTypographyVariants } from "@/lib/variants";

type CustomizeSection = "color" | "type" | "shape" | "components" | "theme";

const CUSTOMIZE_SECTIONS: { id: CustomizeSection; label: string }[] = [
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "shape", label: "Shape" },
  { id: "components", label: "Components" },
  { id: "theme", label: "Theme" },
];

function SectionHeader({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs font-semibold uppercase tracking-widest transition-colors",
        active ? "text-white" : "text-white/40 hover:text-white/70"
      )}
    >
      {label}
      <svg
        viewBox="0 0 10 10"
        className={cn("h-3 w-3 transition-transform", active ? "rotate-180" : "")}
        fill="none"
      >
        <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function Page() {
  const { state: lang, set: setLang, undo, redo, canUndo, canRedo } = useHistory<DesignLanguage>(DEFAULT_DESIGN);
  const [showCustomize, setShowCustomize] = useState(false);
  const [openCustomizeSection, setOpenCustomizeSection] = useState<CustomizeSection | null>(null);
  const [mobileTab, setMobileTab] = useState<"controls" | "preview">("controls");

  type AppView = "welcome" | "guided" | "editor";
  const [view, setView] = useState<AppView>("welcome");

  useEffect(() => {
    const fromUrl = readDesignFromUrl();
    if (fromUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang(fromUrl);
      setView("editor");
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const scripts = Array.from(document.querySelectorAll("script"));
    const unexpected = scripts.filter((el) => {
      const src = el.getAttribute("src");
      if (!src) return false; // ignore inline Next data scripts
      return !src.includes("/_next/") && !src.startsWith(window.location.origin);
    });

    if (unexpected.length > 0) {
      console.warn(
        "[Vibe] Non-Next scripts detected (likely extension/devtool injection):",
        unexpected.map((el) => el.getAttribute("src"))
      );
    }
  }, []);

  function selectPreset(id: PresetId) {
    const preset = getPreset(id);
    if (preset) {
      setLang(preset.values);
    }
  }

  function resetToDefault() {
    setLang(DEFAULT_DESIGN);
  }

  function randomize() {
    setLang(getRandomDesign());
  }

  function handleGuidedComplete(presetId: PresetId, mode: ThemeMode) {
    const preset = getPreset(presetId);
    if (preset) {
      const design = { ...preset.values };
      if (mode !== design.mode) {
        design.mode = mode;
        design.colors = invertPalette(design.colors, mode === "dark");
      }
      setLang(design);
    }
    setView("editor");
  }

  const activeFonts = useMemo(
    () => [lang.typography.headingFont, lang.typography.bodyFont, lang.typography.monoFont],
    [lang.typography.headingFont, lang.typography.bodyFont, lang.typography.monoFont]
  );

  if (view === "welcome") {
    return (
      <div className="h-screen bg-[#0d0d0d]">
        <WelcomeScreen
          onStartGuided={() => setView("guided")}
          onSkip={() => setView("editor")}
        />
      </div>
    );
  }

  if (view === "guided") {
    return (
      <div className="h-screen bg-[#0d0d0d]">
        <GuidedFlow
          onComplete={handleGuidedComplete}
          onBack={() => setView("welcome")}
        />
      </div>
    );
  }

  return (
    <>
      <FontLoader fonts={activeFonts} />

      <div className="flex h-screen flex-col bg-[#0d0d0d] text-white">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-tight text-white">Vibe</span>
            <span className="text-xs text-white/50">Design Language Generator</span>
            <div className="flex items-center gap-0.5 ml-2 border-l border-white/10 pl-3">
              <button
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Cmd+Z)"
                className={cn(
                  "rounded p-1 transition-colors",
                  canUndo ? "text-white/50 hover:text-white hover:bg-white/10" : "text-white/15 cursor-default"
                )}
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <path d="M4 7h8a3 3 0 0 1 0 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 4L4 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Cmd+Shift+Z)"
                className={cn(
                  "rounded p-1 transition-colors",
                  canRedo ? "text-white/50 hover:text-white hover:bg-white/10" : "text-white/15 cursor-default"
                )}
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <path d="M12 7H4a3 3 0 0 0 0 6h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <button
              onClick={randomize}
              title="Surprise me — random preset + variant"
              className="rounded-md border border-white/10 px-2.5 py-1 text-[11px] text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
            >
              Surprise me
            </button>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/30">
            <span>by</span>
            <span className="text-white/50">Upcurious</span>
          </div>
        </header>

        {/* Mobile tab bar */}
        <div className="flex border-b border-white/10 md:hidden">
          {(["controls", "preview"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-xs font-medium capitalize transition-colors",
                mobileTab === tab ? "text-white border-b border-white" : "text-white/40"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Controls panel */}
          <aside
            className={cn(
              "flex flex-col overflow-hidden border-r border-white/10 bg-[#111111]",
              "w-full md:w-80 lg:w-[320px]",
              mobileTab === "preview" ? "hidden md:flex" : "flex"
            )}
          >
            <div className="flex-1 overflow-y-auto">
              {/* Instruction */}
              <div className="border-b border-white/10 px-3 py-3">
                <p className="text-[11px] leading-relaxed text-white/50">
                  Pick a mood, then{" "}
                  <span className="text-white/80">Copy prompt</span>{" "}
                  to paste into Cursor, Claude, or ChatGPT.
                </p>
              </div>

              {/* Mood picker — always visible */}
              <div className="border-b border-white/5 px-3 py-3">
                <MoodPicker
                  selectedId={lang.presetId}
                  onSelect={selectPreset}
                />
              </div>

              {/* Customize toggle */}
              <div className="border-b border-white/5">
                <button
                  onClick={() => setShowCustomize((p) => !p)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-xs transition-colors",
                    showCustomize ? "text-white/60" : "text-white/30 hover:text-white/50"
                  )}
                >
                  <span className="font-medium">Customize</span>
                  <svg
                    viewBox="0 0 10 10"
                    className={cn("h-3 w-3 transition-transform", showCustomize ? "rotate-180" : "")}
                    fill="none"
                  >
                    <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* Customization sections — hidden by default */}
              {showCustomize && (
                <>
                  {CUSTOMIZE_SECTIONS.map(({ id, label }) => (
                    <div key={id} className="border-b border-white/5">
                      <SectionHeader
                        label={label}
                        active={openCustomizeSection === id}
                        onClick={() =>
                          setOpenCustomizeSection(openCustomizeSection === id ? null : id)
                        }
                      />
                      {openCustomizeSection === id && (
                        <div className="px-3 pb-4">
                          {id === "color" && (
                            <ColorSection
                              colors={lang.colors}
                              onChange={(c) => setLang((l) => ({ ...l, colors: c }))}
                              variants={lang.presetId ? getColorVariants(lang.presetId) : undefined}
                            />
                          )}
                          {id === "type" && (
                            <TypographySection
                              typography={lang.typography}
                              onChange={(t) => setLang((l) => ({ ...l, typography: t }))}
                              presetId={lang.presetId}
                              variants={lang.presetId ? getTypographyVariants(lang.presetId) : undefined}
                            />
                          )}
                          {id === "shape" && (
                            <ShapeSection
                              shape={lang.shape}
                              onChange={(s) => setLang((l) => ({ ...l, shape: s }))}
                            />
                          )}
                          {id === "components" && (
                            <ComponentSection
                              components={lang.components}
                              onChange={(c) => setLang((l) => ({ ...l, components: c }))}
                            />
                          )}
                          {id === "theme" && (
                            <ThemeSection
                              mode={lang.mode}
                              onChange={(m) =>
                                setLang((l) => {
                                  if (m === l.mode) return l;
                                  const toDark = m === "dark";
                                  return {
                                    ...l,
                                    mode: m,
                                    colors: invertPalette(l.colors, toDark),
                                    presetId: null,
                                  };
                                })
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </aside>

          {/* Preview panel */}
          <main
            className={cn(
              "flex flex-1 flex-col overflow-hidden",
              mobileTab === "controls" ? "hidden md:flex" : "flex"
            )}
          >
            <div className="flex-1 overflow-hidden">
              <PreviewFrame lang={lang}>
                <PreviewNav lang={lang} />
                <PreviewHero lang={lang} />
                <PreviewCards lang={lang} />
                <PreviewQuote lang={lang} />
                <PreviewCta lang={lang} />
                <PreviewFooter lang={lang} />
              </PreviewFrame>
            </div>
            <ExportBar lang={lang} onReset={resetToDefault} />
          </main>
        </div>
      </div>
    </>
  );
}
