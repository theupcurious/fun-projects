"use client";

import type { DesignLanguage } from "@/lib/types";
import { previewContent } from "@/lib/design-brief";
import { getButtonStyles } from "./preview-styles";

function getInputStyle(lang: DesignLanguage): React.CSSProperties {
  const { colors } = lang;
  const radius = `var(--vp-radius)`;
  const base: React.CSSProperties = {
    padding: "8px 14px",
    fontSize: "inherit",
    outline: "none",
    color: colors.text,
    background: colors.surface,
    flex: 1,
    minWidth: 0,
  };

  switch (lang.components.inputStyle) {
    case "underline":
      return {
        ...base,
        background: "transparent",
        border: "none",
        borderBottom: `var(--vp-border-width) solid var(--vp-border)`,
        borderRadius: 0,
      };
    case "bordered":
      return {
        ...base,
        border: `var(--vp-border-width) solid var(--vp-border)`,
        borderRadius: radius,
      };
    case "filled":
      return {
        ...base,
        border: "none",
        borderRadius: radius,
        background: colors.surface,
      };
  }
}

export function PreviewCta({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;
  const content = previewContent(lang);

  const btnStyle = getButtonStyles(lang);
  const inputStyle = getInputStyle(lang);

  return (
    <section
      style={{
        background: colors.background,
        padding: `calc(56px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`,
        textAlign: "center",
        borderBottom: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--vp-heading-font)",
          fontWeight: "var(--vp-heading-weight)" as unknown as number,
          fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
          color: colors.text,
          letterSpacing: "var(--vp-letter-spacing)",
          textTransform: "var(--vp-heading-transform)" as React.CSSProperties["textTransform"],
          fontStyle: "var(--vp-heading-style)" as React.CSSProperties["fontStyle"],
          marginBottom: "10px",
        }}
      >
        {content.ctaTitle}
      </h2>
      <p style={{ color: colors.textMuted, marginBottom: "28px", fontSize: "0.9em" }}>
        {content.ctaBody}
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          maxWidth: "420px",
          margin: "0 auto",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <input
          type="email"
          placeholder="you@example.com"
          style={inputStyle}
          readOnly
        />
        <button style={{ ...btnStyle, padding: "8px 20px", cursor: "pointer", whiteSpace: "nowrap" as const }}>
          {content.ctaAction}
        </button>
      </div>
    </section>
  );
}
