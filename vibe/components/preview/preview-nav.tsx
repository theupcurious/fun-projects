"use client";

import type { DesignLanguage } from "@/lib/types";
import { previewContent } from "@/lib/design-brief";
import { getButtonStyles } from "./preview-styles";

export function PreviewNav({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;
  const content = previewContent(lang);
  const spacing = parseFloat(String(lang.shape.spacingDensity === "compact" ? "12" : lang.shape.spacingDensity === "generous" ? "24" : "18"));
  const btnStyle = getButtonStyles(lang);

  return (
    <nav
      style={{
        background: colors.background,
        borderBottom: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
        padding: `${spacing * 0.7}px ${spacing * 1.5}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: "var(--vp-heading-font)",
          fontWeight: "var(--vp-heading-weight)" as unknown as number,
          fontSize: "1.1em",
          color: colors.text,
          letterSpacing: "var(--vp-letter-spacing)",
          textTransform: "var(--vp-heading-transform)" as React.CSSProperties["textTransform"],
          fontStyle: "var(--vp-heading-style)" as React.CSSProperties["fontStyle"],
        }}
      >
        {content.brand}
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: spacing + "px", alignItems: "center" }}>
        {content.nav.map((item) => (
          <a
            key={item}
            href="#"
            style={{
              color: colors.textMuted,
              fontSize: "0.85em",
              textDecoration: lang.components.linkTreatment === "underline" ? "underline" : "none",
            }}
          >
            {item}
            {lang.components.linkTreatment === "arrow" && " →"}
          </a>
        ))}
        <button style={{ ...btnStyle, fontSize: "0.8em" }}>{content.navCta}</button>
      </div>
    </nav>
  );
}
