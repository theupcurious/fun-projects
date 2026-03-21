export type SpacingDensity = "compact" | "default" | "generous";
export type ShadowStyle = "none" | "subtle" | "elevated" | "dramatic";

export const SHADOW_CSS_MAP: Record<ShadowStyle, string> = {
  none: "none",
  subtle: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
  elevated: "0 4px 16px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
  dramatic: "0 8px 32px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.12)",
};
export type BorderWeight = "none" | "hairline" | "medium" | "heavy";
export type ButtonStyle = "filled" | "outline" | "ghost" | "underline";
export type CardStyle = "flat" | "bordered" | "elevated" | "glass";
export type InputStyle = "underline" | "bordered" | "filled";
export type LinkTreatment = "underline" | "color-only" | "arrow";
export type HeadingTransform = "none" | "uppercase" | "italic";
export type ThemeMode = "light" | "dark";
export type PromptFormat = "markdown" | "system" | "cursorrules";
export type PresetId =
  | "editorial"
  | "minimal"
  | "dashboard"
  | "corporate"
  | "saas"
  | "monochrome"
  | "playful"
  | "retro"
  | "brutalist"
  | "studio"
  | "whimsical"
  | "luxury"
  | "organic"
  | "neon"
  | "candy"
  | "startup"
  | "handcraft"
  | "cyberpunk";

export type MoodGroup = "professional" | "creative" | "bold";

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface Typography {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  headingWeight: number; // 300–900
  bodySize: number; // 14–20
  headingTransform: HeadingTransform;
  letterSpacing: number; // -2 to 4 (tenths of em, so -0.2em to 0.4em)
}

export interface Shape {
  borderRadius: number; // 0–24px
  spacingDensity: SpacingDensity;
  shadowStyle: ShadowStyle;
  borderWeight: BorderWeight;
}

export interface ComponentStyle {
  buttonStyle: ButtonStyle;
  cardStyle: CardStyle;
  inputStyle: InputStyle;
  linkTreatment: LinkTreatment;
}

export interface DesignLanguage {
  presetId: PresetId | null;
  colors: ColorPalette;
  typography: Typography;
  shape: Shape;
  components: ComponentStyle;
  mode: ThemeMode;
}
