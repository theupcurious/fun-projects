"use client";

import type { DesignLanguage } from "@/lib/types";
import { previewContent } from "@/lib/design-brief";
import { getButtonStyles } from "./preview-styles";

export function PreviewHero({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;
  const content = previewContent(lang);

  const primaryBtn = getButtonStyles(lang);
  const outlineBtn: React.CSSProperties = {
    background: "transparent",
    color: colors.text,
    border: `var(--vp-border-width) solid var(--vp-border)`,
    borderRadius: "var(--vp-radius)",
    padding: "8px 20px",
    fontSize: "inherit",
    cursor: "pointer",
  };

  return (
    <section
      style={{
        background: colors.background,
        padding: `calc(64px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`,
        textAlign: "center",
        borderBottom: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: "inline-block",
          background: colors.surface,
          color: colors.primary,
          border: `var(--vp-border-width) solid var(--vp-border)`,
          borderRadius: `calc(var(--vp-radius) * 2)`,
          padding: "3px 12px",
          fontSize: "0.75em",
          marginBottom: "24px",
          letterSpacing: "0.04em",
          textTransform: "uppercase" as const,
        }}
      >
        {content.badge}
      </div>

      <h1
        style={{
          fontFamily: "var(--vp-heading-font)",
          fontWeight: "var(--vp-heading-weight)" as unknown as number,
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          lineHeight: 1.1,
          color: colors.text,
          letterSpacing: "var(--vp-letter-spacing)",
          textTransform: "var(--vp-heading-transform)" as React.CSSProperties["textTransform"],
          fontStyle: "var(--vp-heading-style)" as React.CSSProperties["fontStyle"],
          maxWidth: "720px",
          margin: "0 auto 20px",
        }}
      >
        {content.headline}
      </h1>

      <p
        style={{
          color: colors.textMuted,
          maxWidth: "560px",
          margin: "0 auto 32px",
          lineHeight: 1.65,
          fontSize: "1.05em",
        }}
      >
        {content.subhead}
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button style={{ ...primaryBtn, padding: "10px 24px", fontSize: "0.9em", cursor: "pointer" }}>
          {content.primaryCta}
        </button>
        <button style={{ ...outlineBtn }}>{content.secondaryCta}</button>
      </div>
    </section>
  );
}
