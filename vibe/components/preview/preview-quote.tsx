"use client";

import type { DesignLanguage } from "@/lib/types";
import { previewContent } from "@/lib/design-brief";

export function PreviewQuote({ lang }: { lang: DesignLanguage }) {
  const { colors, shape } = lang;
  const content = previewContent(lang);

  return (
    <section
      style={{
        background: colors.surface,
        padding: `calc(48px * var(--vp-spacing)) calc(24px * var(--vp-spacing))`,
        textAlign: "center",
        borderTop: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
        borderBottom: shape.borderWeight !== "none"
          ? `var(--vp-border-width) solid var(--vp-border)`
          : "none",
      }}
    >
      <div
        style={{
          fontFamily: "var(--vp-heading-font)",
          fontStyle: "italic",
          fontSize: "clamp(1rem, 2vw, 1.35rem)",
          lineHeight: 1.55,
          color: colors.text,
          maxWidth: "600px",
          margin: "0 auto 16px",
          letterSpacing: "var(--vp-letter-spacing)",
        }}
      >
        &ldquo;{content.quote}&rdquo;
      </div>
      <div
        style={{
          color: colors.primary,
          fontSize: "0.8em",
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
        }}
      >
        — {content.quoteBy}
      </div>
    </section>
  );
}
