import type { DesignLanguage } from "@/lib/types";
import type React from "react";

export function getButtonStyles(lang: DesignLanguage): React.CSSProperties {
  const { components, colors, shape } = lang;
  const radius = `var(--vp-radius)`;
  const borderW = {
    none: "0px",
    hairline: "1px",
    medium: "2px",
    heavy: "3px",
  }[shape.borderWeight];

  switch (components.buttonStyle) {
    case "filled":
      return {
        background: colors.primary,
        color: colors.background,
        border: "none",
        borderRadius: radius,
        padding: "6px 14px",
        fontSize: "inherit",
      };
    case "outline":
      return {
        background: "transparent",
        color: colors.primary,
        border: `${borderW} solid ${colors.primary}`,
        borderRadius: radius,
        padding: "6px 14px",
        fontSize: "inherit",
      };
    case "ghost":
      return {
        background: "transparent",
        color: colors.primary,
        border: "none",
        borderRadius: radius,
        padding: "6px 14px",
        fontSize: "inherit",
      };
    case "underline":
      return {
        background: "transparent",
        color: colors.primary,
        border: "none",
        borderRadius: 0,
        padding: "4px 0",
        borderBottom: `1px solid ${colors.primary}`,
        fontSize: "inherit",
      };
  }
}
