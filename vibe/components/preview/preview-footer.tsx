"use client";

import type { DesignLanguage } from "@/lib/types";
import { previewContent } from "@/lib/design-brief";

export function PreviewFooter({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;
  const content = previewContent(lang);

  return (
    <footer
      style={{
        background: colors.surface,
        borderTop: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
        padding: `calc(20px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--vp-heading-font)",
          fontWeight: "var(--vp-heading-weight)" as unknown as number,
          fontSize: "0.85em",
          color: colors.text,
          letterSpacing: "var(--vp-letter-spacing)",
        }}
      >
        {content.brand}
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {content.footerLinks.map((link) => (
          <a
            key={link}
            href="#"
            style={{
              color: colors.textMuted,
              fontSize: "0.8em",
              textDecoration: lang.components.linkTreatment === "underline" ? "underline" : "none",
            }}
          >
            {link}
            {lang.components.linkTreatment === "arrow" && " →"}
          </a>
        ))}
      </div>

      <div style={{ color: colors.textMuted, fontSize: "0.78em" }}>
        © 2026 {content.brand}. All rights reserved.
      </div>
    </footer>
  );
}
