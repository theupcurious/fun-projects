"use client";

import type { DesignLanguage } from "@/lib/types";
import { SHADOW_CSS_MAP } from "@/lib/types";
import { previewContent } from "@/lib/design-brief";

const ICONS = ["◈", "⊕", "⊞"];

function getCardStyle(lang: DesignLanguage): React.CSSProperties {
  const { colors, shape } = lang;

  switch (lang.components.cardStyle) {
    case "flat":
      return {
        background: colors.surface,
        border: "none",
        borderRadius: "var(--vp-radius)",
        boxShadow: "none",
      };
    case "bordered":
      return {
        background: colors.surface,
        border: `var(--vp-border-width) solid var(--vp-border)`,
        borderRadius: "var(--vp-radius)",
        boxShadow: "none",
      };
    case "elevated":
      return {
        background: colors.surface,
        border: "none",
        borderRadius: "var(--vp-radius)",
        boxShadow: SHADOW_CSS_MAP[shape.shadowStyle] !== "none" ? SHADOW_CSS_MAP[shape.shadowStyle] : SHADOW_CSS_MAP.elevated,
      };
    case "glass":
      return {
        background: colors.surface + "cc",
        border: `var(--vp-border-width) solid ${colors.border}55`,
        borderRadius: "var(--vp-radius)",
        backdropFilter: "blur(12px)",
        boxShadow: SHADOW_CSS_MAP[shape.shadowStyle],
      };
  }
}

export function PreviewCards({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;
  const cardStyle = getCardStyle(lang);
  const content = previewContent(lang);

  return (
    <section
      style={{
        background: colors.background,
        padding: `calc(48px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`,
        borderBottom: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--vp-heading-font)",
          fontWeight: "var(--vp-heading-weight)" as unknown as number,
          fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
          color: colors.text,
          letterSpacing: "var(--vp-letter-spacing)",
          textTransform: "var(--vp-heading-transform)" as React.CSSProperties["textTransform"],
          fontStyle: "var(--vp-heading-style)" as React.CSSProperties["fontStyle"],
          textAlign: "center",
          marginBottom: "32px",
        }}
      >
        {content.sectionTitle}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: `calc(16px * var(--vp-spacing))`,
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {content.cards.map((card, index) => (
          <div key={card.title} style={{ ...cardStyle, padding: `calc(20px * var(--vp-spacing))` }}>
            <div
              style={{
                fontSize: "1.5em",
                color: colors.primary,
                marginBottom: "12px",
              }}
            >
              {ICONS[index] ?? "◈"}
            </div>
            <h3
              style={{
                fontFamily: "var(--vp-heading-font)",
                fontWeight: "var(--vp-heading-weight)" as unknown as number,
                fontSize: "0.95em",
                color: colors.text,
                letterSpacing: "var(--vp-letter-spacing)",
                textTransform: "var(--vp-heading-transform)" as React.CSSProperties["textTransform"],
                marginBottom: "8px",
              }}
            >
              {card.title}
            </h3>
            <p style={{ color: colors.textMuted, fontSize: "0.85em", lineHeight: 1.55 }}>
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
