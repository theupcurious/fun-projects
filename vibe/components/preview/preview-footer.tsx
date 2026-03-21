"use client";

import type { DesignLanguage } from "@/lib/types";

export function PreviewFooter({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;

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
        Studio
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {["Privacy", "Terms", "Contact"].map((link) => (
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
        © 2026 Studio. All rights reserved.
      </div>
    </footer>
  );
}
