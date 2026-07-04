import type { DesignLanguage, PromptFormat } from "./types";
import { SHADOW_CSS_MAP } from "./types";
import { getPreset } from "./presets";
import {
  avoidanceLabel,
  avoidancePrompt,
  describeTone,
  designPillars,
  getBrief,
  languageName,
  projectLabel,
} from "./design-brief";

const RADIUS_DESC: Record<string, string> = {
  "0": "sharp corners (0px radius)",
  "2": "barely-rounded corners (2px radius)",
  "4": "slightly rounded corners (4px radius)",
  "6": "softly rounded corners (6px radius)",
  "8": "rounded corners (8px radius)",
  "12": "generously rounded corners (12px radius)",
  "16": "very rounded corners (16px radius)",
  "20": "pill-approaching corners (20px radius)",
  "24": "pill-shaped corners (24px radius)",
};

function radiusDesc(r: number): string {
  const nearest = Object.keys(RADIUS_DESC)
    .sort((a, b) => Math.abs(Number(a) - r) - Math.abs(Number(b) - r))[0];
  return nearest ? RADIUS_DESC[nearest] : `${r}px border radius`;
}

function shadowDesc(style: string): string {
  if (style === "none") return "no shadows";
  return SHADOW_CSS_MAP[style as keyof typeof SHADOW_CSS_MAP] ?? "no shadows";
}

const BORDER_CSS: Record<string, string> = {
  none: "no borders",
  hairline: "1px solid",
  medium: "2px solid",
  heavy: "3px solid",
};

const SPACING_DESC: Record<string, string> = {
  compact: "compact (use tight padding — ~8-12px for cards, ~16px for sections)",
  default: "default (standard padding — ~16px for cards, ~48px for sections)",
  generous: "generous (use ample padding — ~24-32px for cards, ~80-100px for sections)",
};

function letterSpacingEm(v: number): string {
  return `${(v * 0.02).toFixed(2)}em`;
}

function headingTransformDesc(t: string): string {
  if (t === "uppercase") return "uppercase, letter-spacing wide";
  if (t === "italic") return "italic";
  return "normal case";
}

export function generatePrompt(
  lang: DesignLanguage,
  format: PromptFormat
): string {
  const preset = lang.presetId ? getPreset(lang.presetId) : null;
  const brief = getBrief(lang);
  const pillars = designPillars(lang);
  const avoidances = brief.avoidances.map(avoidancePrompt);
  const tone = describeTone(brief.tone);
  const aestheticBlurb =
    preset?.aestheticBlurb ??
    `${lang.mode === "dark" ? "Dark" : "Light"} theme with a custom design language.`;

  const body = `## Design Language: ${languageName(lang)}

Use this design language for all UI work in this project. Do not fall back to default AI-generated styles.

### Product Context
- Project type: ${projectLabel(brief.projectType)}
- Use case: Generate UI that feels intentionally designed for a ${projectLabel(brief.projectType).toLowerCase()}, not a generic SaaS template.
- Tone: ${tone.join("; ")}

### Design Principles
${pillars.map((p) => `- ${p}`).join("\n")}

### Avoid
${avoidances.length > 0 ? avoidances.map((a) => `- ${a}`).join("\n") : "- Do not introduce visual patterns that conflict with the design principles above."}

### Color Palette
- Primary: ${lang.colors.primary}
- Secondary: ${lang.colors.secondary}
- Accent: ${lang.colors.accent}
- Background: ${lang.colors.background}
- Surface (cards, panels): ${lang.colors.surface}
- Text: ${lang.colors.text}
- Text muted: ${lang.colors.textMuted}
- Border: ${lang.colors.border}

### Typography
- Heading font: "${lang.typography.headingFont}" (import from Google Fonts), weight ${lang.typography.headingWeight}
- Body font: "${lang.typography.bodyFont}" (import from Google Fonts), weight 400, base size ${lang.typography.bodySize}px
- Mono font: "${lang.typography.monoFont}" (import from Google Fonts)
- Heading style: ${headingTransformDesc(lang.typography.headingTransform)}, letter-spacing ${letterSpacingEm(lang.typography.letterSpacing)}
- Body letter-spacing: normal

### Shape & Spacing
- Border radius: ${radiusDesc(lang.shape.borderRadius)} — apply consistently (${lang.shape.borderRadius}px)
- Spacing density: ${SPACING_DESC[lang.shape.spacingDensity]}
- Shadows: ${shadowDesc(lang.shape.shadowStyle)}
- Borders: ${BORDER_CSS[lang.shape.borderWeight]} using the border color above

### Component Style
- Buttons: ${lang.components.buttonStyle} style
- Cards: ${lang.components.cardStyle} style using the surface color
- Inputs: ${lang.components.inputStyle} style
- Links: ${lang.components.linkTreatment} treatment

### Layout & Hierarchy Rules
- Build the first screen around one dominant idea, not a generic hero/card-grid formula
- Match density to the project type: ${brief.tone.density >= 3 ? "compact, information-rich, and optimized for repeated scanning" : brief.tone.density <= 1 ? "generous, calm, and easy to read" : "balanced, with enough structure for scanning and enough room for hierarchy"}
- Use the heading font for clear hierarchy and the body font for readable product copy
- Keep repeated surfaces consistent: nav, cards, inputs, modals, tables, and CTAs should all share the same geometry and border/shadow logic
- Empty states, loading states, and error states should use the same tone, not default framework styling

### Theme
${lang.mode === "dark" ? "Dark-mode-first design. Do not add a light mode unless explicitly requested." : `Light-mode design. Background is ${lang.colors.background}.`}

### Overall Aesthetic
${aestheticBlurb}

### Implementation Notes
- Import all fonts from Google Fonts using @import or <link> in the head
- Use CSS custom properties (variables) for all color tokens so they can be easily adjusted
- Do not use default Tailwind colors — map these tokens to the palette above
- Avoid Inter, system-ui, or any default sans-serif for headings
- Apply border-radius consistently across all interactive elements
- Before choosing a generic component pattern, check it against the Avoid list: ${brief.avoidances.map(avoidanceLabel).join(", ") || "none"}`;

  if (format === "markdown") {
    return body;
  }

  if (format === "system") {
    return `<system>
You are a frontend developer building a web application. Follow this design language precisely for all UI work. Do not fall back to default styles or generic aesthetics.

${body}
</system>`;
  }

  if (format === "cursorrules") {
    return `# Design Language Rules
# Generated by Vibe — vibe.theupcurious.com

${body}

# Additional Cursor Rules
- Always refer back to these design tokens before choosing colors or fonts
- Never suggest Inter, Roboto, or system-ui as heading fonts
- Never suggest default Tailwind blue or purple unless Primary is that color
- Always import Google Fonts explicitly in the project`;
  }

  return body;
}
