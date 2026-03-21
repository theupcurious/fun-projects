"use client";

import type { DesignLanguage } from "@/lib/types";
import { SHADOW_CSS_MAP } from "@/lib/types";
import { getFontByName } from "@/lib/fonts";

// Build CSS custom properties from DesignLanguage
function buildCSSVars(lang: DesignLanguage): React.CSSProperties {
  const { colors, typography, shape } = lang;

  const headingMeta = getFontByName(typography.headingFont);
  const bodyMeta = getFontByName(typography.bodyFont);
  const monoMeta = getFontByName(typography.monoFont);

  const borderMap: Record<string, string> = {
    none: "0px",
    hairline: "1px",
    medium: "2px",
    heavy: "3px",
  };

  const spacingMap: Record<string, string> = {
    compact: "0.6",
    default: "1",
    generous: "1.4",
  };

  return {
    "--vp-primary": colors.primary,
    "--vp-secondary": colors.secondary,
    "--vp-accent": colors.accent,
    "--vp-bg": colors.background,
    "--vp-surface": colors.surface,
    "--vp-text": colors.text,
    "--vp-text-muted": colors.textMuted,
    "--vp-border": colors.border,
    "--vp-heading-font": headingMeta?.family ?? `'${typography.headingFont}', sans-serif`,
    "--vp-body-font": bodyMeta?.family ?? `'${typography.bodyFont}', sans-serif`,
    "--vp-mono-font": monoMeta?.family ?? `'${typography.monoFont}', monospace`,
    "--vp-heading-weight": String(typography.headingWeight),
    "--vp-body-size": `${typography.bodySize}px`,
    "--vp-letter-spacing": `${(typography.letterSpacing * 0.02).toFixed(2)}em`,
    "--vp-heading-transform":
      typography.headingTransform === "uppercase"
        ? "uppercase"
        : typography.headingTransform === "italic"
        ? "none"
        : "none",
    "--vp-heading-style":
      typography.headingTransform === "italic" ? "italic" : "normal",
    "--vp-radius": `${shape.borderRadius}px`,
    "--vp-shadow": SHADOW_CSS_MAP[shape.shadowStyle],
    "--vp-border-width": borderMap[shape.borderWeight],
    "--vp-spacing": spacingMap[shape.spacingDensity],
  } as React.CSSProperties;
}

interface PreviewFrameProps {
  lang: DesignLanguage;
  children: React.ReactNode;
}

export function PreviewFrame({ lang, children }: PreviewFrameProps) {
  const cssVars = buildCSSVars(lang);

  return (
    <div
      data-vibe-preview
      style={{
        ...cssVars,
        background: "var(--vp-bg)",
        color: "var(--vp-text)",
        fontFamily: "var(--vp-body-font)",
        fontSize: "var(--vp-body-size)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
      className="h-full w-full overflow-y-auto text-[length:var(--vp-body-size)]"
    >
      <style>{`
  [data-vibe-preview] * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
`}</style>
      {children}
    </div>
  );
}
