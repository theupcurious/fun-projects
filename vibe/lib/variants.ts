import type {
  ColorPalette,
  Typography,
  Shape,
  ComponentStyle,
  PresetId,
} from "./types";

// ---------------------------------------------------------------------------
// Color variants — 3 curated palettes per mood
// ---------------------------------------------------------------------------

export interface ColorVariant {
  name: string;
  values: ColorPalette;
}

const COLOR_VARIANTS: Record<PresetId, ColorVariant[]> = {
  editorial: [
    {
      name: "Warm Cream",
      values: {
        primary: "#1a1a1a", secondary: "#c8a96e", accent: "#e05a2b",
        background: "#faf8f5", surface: "#f0ece4", text: "#1a1a1a",
        textMuted: "#6b6560", border: "#d4cfc8",
      },
    },
    {
      name: "Cool Slate",
      values: {
        primary: "#1a2b3c", secondary: "#5a7a8a", accent: "#4a7b9d",
        background: "#f2f4f6", surface: "#e8ecf0", text: "#1a2b3c",
        textMuted: "#5a6570", border: "#ccd4dc",
      },
    },
    {
      name: "Ink & Paper",
      values: {
        primary: "#2a2520", secondary: "#8a7560", accent: "#b5432a",
        background: "#fefcf9", surface: "#f5f0e8", text: "#2a2520",
        textMuted: "#706050", border: "#ddd5c8",
      },
    },
  ],

  brutalist: [
    {
      name: "Classic",
      values: {
        primary: "#000000", secondary: "#ffffff", accent: "#ff3333",
        background: "#ffffff", surface: "#f0f0f0", text: "#000000",
        textMuted: "#555555", border: "#000000",
      },
    },
    {
      name: "Caution",
      values: {
        primary: "#000000", secondary: "#ffffff", accent: "#e6a817",
        background: "#ffffff", surface: "#f5f5f0", text: "#000000",
        textMuted: "#555555", border: "#000000",
      },
    },
    {
      name: "Electric",
      values: {
        primary: "#000000", secondary: "#ffffff", accent: "#0055ff",
        background: "#ffffff", surface: "#f0f0f5", text: "#000000",
        textMuted: "#555555", border: "#000000",
      },
    },
  ],

  playful: [
    {
      name: "Candy",
      values: {
        primary: "#6c47ff", secondary: "#ff6b6b", accent: "#ffc947",
        background: "#ffffff", surface: "#f5f3ff", text: "#1a1028",
        textMuted: "#7a6fa0", border: "#e5e0f5",
      },
    },
    {
      name: "Ocean",
      values: {
        primary: "#00b8a9", secondary: "#ff6b8a", accent: "#5bc0eb",
        background: "#ffffff", surface: "#f0faf9", text: "#0a2020",
        textMuted: "#5a8a85", border: "#d0eae8",
      },
    },
    {
      name: "Citrus",
      values: {
        primary: "#ff7b2e", secondary: "#7cb518", accent: "#ffc947",
        background: "#fffdf5", surface: "#fff5e8", text: "#1a1208",
        textMuted: "#8a7a50", border: "#e8dcc0",
      },
    },
  ],

  luxury: [
    {
      name: "Gold",
      values: {
        primary: "#c9a96e", secondary: "#8a7a5a", accent: "#e8c97a",
        background: "#0f0d0a", surface: "#1a1710", text: "#f2ede4",
        textMuted: "#8c8070", border: "#2e2a20",
      },
    },
    {
      name: "Silver",
      values: {
        primary: "#a8a9ad", secondary: "#6e7074", accent: "#c0c2c8",
        background: "#0a0a0c", surface: "#141418", text: "#eaebee",
        textMuted: "#808488", border: "#252530",
      },
    },
    {
      name: "Rose",
      values: {
        primary: "#b76e79", secondary: "#c4917c", accent: "#d4a090",
        background: "#0f0a0a", surface: "#1a1214", text: "#f2e8ea",
        textMuted: "#8c7578", border: "#2e2024",
      },
    },
  ],

  retro: [
    {
      name: "Terracotta",
      values: {
        primary: "#c94f1a", secondary: "#4a7c5a", accent: "#e8b84b",
        background: "#f5ead5", surface: "#ede0c0", text: "#2a1f0e",
        textMuted: "#6b5a3a", border: "#c4a87a",
      },
    },
    {
      name: "Olive",
      values: {
        primary: "#5a6e2e", secondary: "#8b6914", accent: "#d4a017",
        background: "#f5f0e0", surface: "#eae5d0", text: "#1a2010",
        textMuted: "#5a6040", border: "#c0b890",
      },
    },
    {
      name: "Denim",
      values: {
        primary: "#4a6fa5", secondary: "#8a6040", accent: "#e8c97a",
        background: "#f0ead8", surface: "#e8e0cc", text: "#1a2030",
        textMuted: "#5a6070", border: "#b8b0a0",
      },
    },
  ],

  minimal: [
    {
      name: "Mono",
      values: {
        primary: "#0a0a0a", secondary: "#404040", accent: "#0a0a0a",
        background: "#ffffff", surface: "#f7f7f7", text: "#0a0a0a",
        textMuted: "#888888", border: "#e8e8e8",
      },
    },
    {
      name: "Warm",
      values: {
        primary: "#2a2420", secondary: "#5a5048", accent: "#2a2420",
        background: "#faf8f5", surface: "#f2efe8", text: "#2a2420",
        textMuted: "#8a8078", border: "#e0dcd5",
      },
    },
    {
      name: "Ink",
      values: {
        primary: "#0f1729", secondary: "#3a4a60", accent: "#0f1729",
        background: "#f5f7fa", surface: "#edf0f5", text: "#0f1729",
        textMuted: "#6a7a8a", border: "#dce2ea",
      },
    },
  ],

  dashboard: [
    {
      name: "Blue",
      values: {
        primary: "#3b82f6", secondary: "#6366f1", accent: "#10b981",
        background: "#0a0a0f", surface: "#111118", text: "#e5e7eb",
        textMuted: "#6b7280", border: "#1f2028",
      },
    },
    {
      name: "Emerald",
      values: {
        primary: "#10b981", secondary: "#06d6a0", accent: "#3b82f6",
        background: "#0a0f0a", surface: "#111814", text: "#e5ebe7",
        textMuted: "#6b8072", border: "#1f2820",
      },
    },
    {
      name: "Amber",
      values: {
        primary: "#f59e0b", secondary: "#fb923c", accent: "#10b981",
        background: "#0f0d0a", surface: "#181510", text: "#ebe7e0",
        textMuted: "#807060", border: "#282018",
      },
    },
  ],

  organic: [
    {
      name: "Forest",
      values: {
        primary: "#2d5a27", secondary: "#8b6914", accent: "#d4622a",
        background: "#f8f4ee", surface: "#efe8db", text: "#1c2818",
        textMuted: "#6b6050", border: "#cec4b4",
      },
    },
    {
      name: "Clay",
      values: {
        primary: "#c2704e", secondary: "#8b6914", accent: "#5a8a40",
        background: "#f8f2ea", surface: "#efe4d5", text: "#2a1810",
        textMuted: "#7a6050", border: "#d0c0aa",
      },
    },
    {
      name: "Sage",
      values: {
        primary: "#7a9a6c", secondary: "#8b7355", accent: "#c4804a",
        background: "#f5f4ee", surface: "#eceadf", text: "#1a2018",
        textMuted: "#6a6858", border: "#ccc8b8",
      },
    },
  ],

  corporate: [
    {
      name: "Blue Chip",
      values: {
        primary: "#1e40af", secondary: "#3b82f6", accent: "#0ea5e9",
        background: "#ffffff", surface: "#f8fafc", text: "#0f172a",
        textMuted: "#64748b", border: "#e2e8f0",
      },
    },
    {
      name: "Slate",
      values: {
        primary: "#334155", secondary: "#64748b", accent: "#0ea5e9",
        background: "#ffffff", surface: "#f8fafc", text: "#0f172a",
        textMuted: "#64748b", border: "#e2e8f0",
      },
    },
    {
      name: "Trust",
      values: {
        primary: "#0f766e", secondary: "#14b8a6", accent: "#0d9488",
        background: "#ffffff", surface: "#f0fdfa", text: "#0f172a",
        textMuted: "#5a7a74", border: "#d1e8e4",
      },
    },
  ],

  saas: [
    {
      name: "Indigo",
      values: {
        primary: "#111827", secondary: "#6366f1", accent: "#8b5cf6",
        background: "#ffffff", surface: "#f9fafb", text: "#111827",
        textMuted: "#6b7280", border: "#e5e7eb",
      },
    },
    {
      name: "Violet",
      values: {
        primary: "#111827", secondary: "#8b5cf6", accent: "#a78bfa",
        background: "#ffffff", surface: "#faf8ff", text: "#111827",
        textMuted: "#6b7280", border: "#ede9fe",
      },
    },
    {
      name: "Emerald",
      values: {
        primary: "#111827", secondary: "#059669", accent: "#34d399",
        background: "#ffffff", surface: "#f0fdf4", text: "#111827",
        textMuted: "#6b7280", border: "#d1fae5",
      },
    },
  ],

  monochrome: [
    {
      name: "Pure",
      values: {
        primary: "#000000", secondary: "#333333", accent: "#000000",
        background: "#ffffff", surface: "#fafafa", text: "#000000",
        textMuted: "#71717a", border: "#e4e4e7",
      },
    },
    {
      name: "Soft",
      values: {
        primary: "#1a1a1a", secondary: "#525252", accent: "#1a1a1a",
        background: "#fafafa", surface: "#f5f5f5", text: "#1a1a1a",
        textMuted: "#737373", border: "#d4d4d4",
      },
    },
    {
      name: "Charcoal",
      values: {
        primary: "#e5e5e5", secondary: "#a3a3a3", accent: "#e5e5e5",
        background: "#171717", surface: "#262626", text: "#e5e5e5",
        textMuted: "#737373", border: "#404040",
      },
    },
  ],

  studio: [
    {
      name: "Red Accent",
      values: {
        primary: "#1a1a1a", secondary: "#e63946", accent: "#e63946",
        background: "#f1f0eb", surface: "#e8e6df", text: "#1a1a1a",
        textMuted: "#6b6b6b", border: "#d1d0ca",
      },
    },
    {
      name: "Ink Blue",
      values: {
        primary: "#1a1a1a", secondary: "#2563eb", accent: "#2563eb",
        background: "#f0f1f3", surface: "#e4e6ea", text: "#1a1a1a",
        textMuted: "#6b6b6b", border: "#cdd0d5",
      },
    },
    {
      name: "Black",
      values: {
        primary: "#fafafa", secondary: "#a3a3a3", accent: "#fafafa",
        background: "#0a0a0a", surface: "#171717", text: "#fafafa",
        textMuted: "#737373", border: "#2a2a2a",
      },
    },
  ],

  whimsical: [
    {
      name: "Lavender",
      values: {
        primary: "#7c3aed", secondary: "#f472b6", accent: "#fbbf24",
        background: "#fffbf0", surface: "#fef3e2", text: "#1f1235",
        textMuted: "#7c6f94", border: "#ede4d4",
      },
    },
    {
      name: "Peach",
      values: {
        primary: "#e11d48", secondary: "#f59e0b", accent: "#8b5cf6",
        background: "#fff7f0", surface: "#ffedd5", text: "#2a1215",
        textMuted: "#8a6a6a", border: "#f5d5c0",
      },
    },
    {
      name: "Meadow",
      values: {
        primary: "#16a34a", secondary: "#eab308", accent: "#7c3aed",
        background: "#f7fff0", surface: "#ecfccb", text: "#14280a",
        textMuted: "#5a7a50", border: "#d4e8c0",
      },
    },
  ],

  neon: [
    {
      name: "Green",
      values: {
        primary: "#00ff88", secondary: "#6366f1", accent: "#f43f5e",
        background: "#09090b", surface: "#18181b", text: "#fafafa",
        textMuted: "#71717a", border: "#27272a",
      },
    },
    {
      name: "Cyan",
      values: {
        primary: "#22d3ee", secondary: "#a855f7", accent: "#f43f5e",
        background: "#09090b", surface: "#18181b", text: "#fafafa",
        textMuted: "#71717a", border: "#27272a",
      },
    },
    {
      name: "Pink",
      values: {
        primary: "#f472b6", secondary: "#818cf8", accent: "#34d399",
        background: "#09090b", surface: "#18181b", text: "#fafafa",
        textMuted: "#71717a", border: "#27272a",
      },
    },
  ],

  candy: [
    {
      name: "Purple",
      values: {
        primary: "#a855f7", secondary: "#ec4899", accent: "#06b6d4",
        background: "#fefcff", surface: "#faf5ff", text: "#1e1b4b",
        textMuted: "#7c71a6", border: "#ede9fe",
      },
    },
    {
      name: "Pink",
      values: {
        primary: "#ec4899", secondary: "#f472b6", accent: "#8b5cf6",
        background: "#fff5f7", surface: "#fce7f3", text: "#1e1b4b",
        textMuted: "#8a6a80", border: "#fbd5e8",
      },
    },
    {
      name: "Mint",
      values: {
        primary: "#2dd4bf", secondary: "#a78bfa", accent: "#f472b6",
        background: "#f0fffc", surface: "#ccfbf1", text: "#0f2b2b",
        textMuted: "#5a8a80", border: "#b0e8d8",
      },
    },
  ],

  startup: [
    {
      name: "Orange",
      values: {
        primary: "#f97316", secondary: "#2563eb", accent: "#16a34a",
        background: "#ffffff", surface: "#f8f8f8", text: "#0a0a0a",
        textMuted: "#737373", border: "#e5e5e5",
      },
    },
    {
      name: "Blue",
      values: {
        primary: "#2563eb", secondary: "#f97316", accent: "#16a34a",
        background: "#ffffff", surface: "#f5f7ff", text: "#0a0a0a",
        textMuted: "#737373", border: "#e0e4f0",
      },
    },
    {
      name: "Green",
      values: {
        primary: "#16a34a", secondary: "#2563eb", accent: "#f97316",
        background: "#ffffff", surface: "#f0fdf4", text: "#0a0a0a",
        textMuted: "#737373", border: "#d5eadb",
      },
    },
  ],

  handcraft: [
    {
      name: "Terracotta",
      values: {
        primary: "#c4622d", secondary: "#6b8f71", accent: "#d4a853",
        background: "#faf4ec", surface: "#f0e8d8", text: "#2a1f14",
        textMuted: "#7a6655", border: "#d8c8b0",
      },
    },
    {
      name: "Sage",
      values: {
        primary: "#5a7a4a", secondary: "#c4622d", accent: "#e8c97a",
        background: "#f5f4ee", surface: "#eceadf", text: "#1a2018",
        textMuted: "#6a6858", border: "#ccc8b8",
      },
    },
    {
      name: "Linen",
      values: {
        primary: "#8b5e3c", secondary: "#b07d54", accent: "#6b8f71",
        background: "#fdf8f2", surface: "#f5eee4", text: "#2a1f14",
        textMuted: "#8a7060", border: "#ddd0bc",
      },
    },
  ],

  cyberpunk: [
    {
      name: "Cyan",
      values: {
        primary: "#00e5ff", secondary: "#ff00aa", accent: "#ccff00",
        background: "#07070f", surface: "#0f0f1a", text: "#e8eaf6",
        textMuted: "#7986cb", border: "#1a1a2e",
      },
    },
    {
      name: "Magenta",
      values: {
        primary: "#ff00aa", secondary: "#00e5ff", accent: "#ffea00",
        background: "#0f070f", surface: "#1a0f1a", text: "#f8e8f6",
        textMuted: "#9c7aab", border: "#2e1a2e",
      },
    },
    {
      name: "Acid",
      values: {
        primary: "#ccff00", secondary: "#00e5ff", accent: "#ff00aa",
        background: "#070f07", surface: "#0f1a0f", text: "#e8f6e8",
        textMuted: "#7ab47a", border: "#1a2e1a",
      },
    },
  ],
};

export function getColorVariants(presetId: PresetId): ColorVariant[] {
  return COLOR_VARIANTS[presetId] ?? [];
}

// ---------------------------------------------------------------------------
// Typography variants — 3 curated font pairings per mood
// ---------------------------------------------------------------------------

export interface TypographyVariant {
  name: string;
  values: Typography;
}

const TYPOGRAPHY_VARIANTS: Record<PresetId, TypographyVariant[]> = {
  editorial: [
    {
      name: "Classic Serif",
      values: {
        headingFont: "Playfair Display", bodyFont: "Source Serif 4", monoFont: "IBM Plex Mono",
        headingWeight: 700, bodySize: 17, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Modern Serif",
      values: {
        headingFont: "Cormorant Garamond", bodyFont: "DM Sans", monoFont: "IBM Plex Mono",
        headingWeight: 500, bodySize: 16, headingTransform: "none", letterSpacing: 2,
      },
    },
    {
      name: "Bold Display",
      values: {
        headingFont: "DM Serif Display", bodyFont: "Barlow", monoFont: "IBM Plex Mono",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  brutalist: [
    {
      name: "Monospace",
      values: {
        headingFont: "Space Mono", bodyFont: "Space Mono", monoFont: "Space Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "uppercase", letterSpacing: 2,
      },
    },
    {
      name: "Impact",
      values: {
        headingFont: "Anton", bodyFont: "Space Mono", monoFont: "Space Mono",
        headingWeight: 400, bodySize: 14, headingTransform: "uppercase", letterSpacing: 1,
      },
    },
    {
      name: "Technical",
      values: {
        headingFont: "IBM Plex Mono", bodyFont: "IBM Plex Mono", monoFont: "IBM Plex Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "uppercase", letterSpacing: 0,
      },
    },
  ],

  playful: [
    {
      name: "Bouncy",
      values: {
        headingFont: "Nunito", bodyFont: "DM Sans", monoFont: "Fira Code",
        headingWeight: 800, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Geometric",
      values: {
        headingFont: "Josefin Sans", bodyFont: "Outfit", monoFont: "Fira Code",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Friendly",
      values: {
        headingFont: "Righteous", bodyFont: "Karla", monoFont: "Fira Code",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
  ],

  luxury: [
    {
      name: "Garamond",
      values: {
        headingFont: "Cormorant Garamond", bodyFont: "EB Garamond", monoFont: "Courier Prime",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: 3,
      },
    },
    {
      name: "Modern Lux",
      values: {
        headingFont: "Syne", bodyFont: "Manrope", monoFont: "Courier Prime",
        headingWeight: 500, bodySize: 15, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Timeless",
      values: {
        headingFont: "Libre Baskerville", bodyFont: "Lora", monoFont: "Courier Prime",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: 1,
      },
    },
  ],

  retro: [
    {
      name: "Display",
      values: {
        headingFont: "Abril Fatface", bodyFont: "Karla", monoFont: "Courier Prime",
        headingWeight: 400, bodySize: 15, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Vintage",
      values: {
        headingFont: "Playfair Display", bodyFont: "Source Serif 4", monoFont: "Courier Prime",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Groovy",
      values: {
        headingFont: "Lobster", bodyFont: "Raleway", monoFont: "Courier Prime",
        headingWeight: 400, bodySize: 15, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  minimal: [
    {
      name: "Geometric",
      values: {
        headingFont: "Syne", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 15, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Grotesk",
      values: {
        headingFont: "Space Grotesk", bodyFont: "Outfit", monoFont: "JetBrains Mono",
        headingWeight: 500, bodySize: 15, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Jakarta",
      values: {
        headingFont: "Plus Jakarta Sans", bodyFont: "Manrope", monoFont: "JetBrains Mono",
        headingWeight: 600, bodySize: 15, headingTransform: "none", letterSpacing: -1,
      },
    },
  ],

  dashboard: [
    {
      name: "Clean",
      values: {
        headingFont: "Plus Jakarta Sans", bodyFont: "Manrope", monoFont: "JetBrains Mono",
        headingWeight: 600, bodySize: 14, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Technical",
      values: {
        headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 500, bodySize: 14, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Code",
      values: {
        headingFont: "JetBrains Mono", bodyFont: "Manrope", monoFont: "JetBrains Mono",
        headingWeight: 500, bodySize: 14, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  organic: [
    {
      name: "Fraunces",
      values: {
        headingFont: "Fraunces", bodyFont: "Barlow", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Lora",
      values: {
        headingFont: "Lora", bodyFont: "Karla", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Baskerville",
      values: {
        headingFont: "Libre Baskerville", bodyFont: "Raleway", monoFont: "IBM Plex Mono",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  corporate: [
    {
      name: "Jakarta",
      values: {
        headingFont: "Plus Jakarta Sans", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Manrope",
      values: {
        headingFont: "Manrope", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Barlow",
      values: {
        headingFont: "Barlow", bodyFont: "DM Sans", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  saas: [
    {
      name: "Grotesk",
      values: {
        headingFont: "Space Grotesk", bodyFont: "Manrope", monoFont: "JetBrains Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Jakarta",
      values: {
        headingFont: "Plus Jakarta Sans", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Outfit",
      values: {
        headingFont: "Outfit", bodyFont: "Manrope", monoFont: "Fira Code",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  monochrome: [
    {
      name: "Grotesk",
      values: {
        headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "IBM Plex Mono",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Serif",
      values: {
        headingFont: "Libre Baskerville", bodyFont: "Source Serif 4", monoFont: "IBM Plex Mono",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "System",
      values: {
        headingFont: "DM Sans", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 15, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  studio: [
    {
      name: "Syne Bold",
      values: {
        headingFont: "Syne", bodyFont: "Barlow", monoFont: "Space Mono",
        headingWeight: 800, bodySize: 16, headingTransform: "uppercase", letterSpacing: -1,
      },
    },
    {
      name: "Bebas",
      values: {
        headingFont: "Bebas Neue", bodyFont: "Barlow", monoFont: "Space Mono",
        headingWeight: 400, bodySize: 16, headingTransform: "uppercase", letterSpacing: 2,
      },
    },
    {
      name: "Grotesk",
      values: {
        headingFont: "Space Grotesk", bodyFont: "Outfit", monoFont: "Space Mono",
        headingWeight: 700, bodySize: 16, headingTransform: "uppercase", letterSpacing: 0,
      },
    },
  ],

  whimsical: [
    {
      name: "Fraunces",
      values: {
        headingFont: "Fraunces", bodyFont: "Nunito", monoFont: "Fira Code",
        headingWeight: 700, bodySize: 17, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Lora",
      values: {
        headingFont: "Lora", bodyFont: "Karla", monoFont: "Fira Code",
        headingWeight: 600, bodySize: 17, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Playfair",
      values: {
        headingFont: "Playfair Display", bodyFont: "Nunito", monoFont: "Fira Code",
        headingWeight: 700, bodySize: 17, headingTransform: "italic", letterSpacing: 0,
      },
    },
  ],

  neon: [
    {
      name: "Grotesk",
      values: {
        headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 15, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Mono",
      values: {
        headingFont: "JetBrains Mono", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Syne",
      values: {
        headingFont: "Syne", bodyFont: "Outfit", monoFont: "JetBrains Mono",
        headingWeight: 800, bodySize: 15, headingTransform: "none", letterSpacing: -1,
      },
    },
  ],

  candy: [
    {
      name: "Jakarta",
      values: {
        headingFont: "Plus Jakarta Sans", bodyFont: "Nunito", monoFont: "Fira Code",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Outfit",
      values: {
        headingFont: "Outfit", bodyFont: "DM Sans", monoFont: "Fira Code",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Nunito",
      values: {
        headingFont: "Nunito", bodyFont: "Karla", monoFont: "Fira Code",
        headingWeight: 800, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
  ],

  startup: [
    {
      name: "Outfit",
      values: {
        headingFont: "Outfit", bodyFont: "DM Sans", monoFont: "Fira Code",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Jakarta",
      values: {
        headingFont: "Plus Jakarta Sans", bodyFont: "Manrope", monoFont: "Fira Code",
        headingWeight: 700, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Grotesk",
      values: {
        headingFont: "Space Grotesk", bodyFont: "DM Sans", monoFont: "JetBrains Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  handcraft: [
    {
      name: "Lora",
      values: {
        headingFont: "Lora", bodyFont: "Nunito", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: -1,
      },
    },
    {
      name: "Fraunces",
      values: {
        headingFont: "Fraunces", bodyFont: "Karla", monoFont: "IBM Plex Mono",
        headingWeight: 600, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
    {
      name: "Libre",
      values: {
        headingFont: "Libre Baskerville", bodyFont: "Raleway", monoFont: "IBM Plex Mono",
        headingWeight: 400, bodySize: 16, headingTransform: "none", letterSpacing: 0,
      },
    },
  ],

  cyberpunk: [
    {
      name: "Rajdhani",
      values: {
        headingFont: "Rajdhani", bodyFont: "Share Tech Mono", monoFont: "Share Tech Mono",
        headingWeight: 700, bodySize: 15, headingTransform: "uppercase", letterSpacing: 2,
      },
    },
    {
      name: "Orbitron",
      values: {
        headingFont: "Orbitron", bodyFont: "Share Tech Mono", monoFont: "Share Tech Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "uppercase", letterSpacing: 3,
      },
    },
    {
      name: "Mono",
      values: {
        headingFont: "JetBrains Mono", bodyFont: "JetBrains Mono", monoFont: "JetBrains Mono",
        headingWeight: 700, bodySize: 14, headingTransform: "uppercase", letterSpacing: 1,
      },
    },
  ],
};

export function getTypographyVariants(presetId: PresetId): TypographyVariant[] {
  return TYPOGRAPHY_VARIANTS[presetId] ?? [];
}

// ---------------------------------------------------------------------------
// Shape variants — universal (not mood-specific)
// ---------------------------------------------------------------------------

export interface ShapeVariant {
  name: string;
  values: Shape;
}

export const SHAPE_VARIANTS: ShapeVariant[] = [
  {
    name: "Sharp",
    values: { borderRadius: 0, spacingDensity: "compact", shadowStyle: "none", borderWeight: "heavy" },
  },
  {
    name: "Clean",
    values: { borderRadius: 6, spacingDensity: "default", shadowStyle: "subtle", borderWeight: "hairline" },
  },
  {
    name: "Soft",
    values: { borderRadius: 12, spacingDensity: "generous", shadowStyle: "elevated", borderWeight: "hairline" },
  },
  {
    name: "Round",
    values: { borderRadius: 20, spacingDensity: "generous", shadowStyle: "elevated", borderWeight: "none" },
  },
];

// ---------------------------------------------------------------------------
// Component style variants — universal (not mood-specific)
// ---------------------------------------------------------------------------

export interface ComponentVariant {
  name: string;
  values: ComponentStyle;
}

export const COMPONENT_VARIANTS: ComponentVariant[] = [
  {
    name: "Solid",
    values: { buttonStyle: "filled", cardStyle: "elevated", inputStyle: "bordered", linkTreatment: "color-only" },
  },
  {
    name: "Outlined",
    values: { buttonStyle: "outline", cardStyle: "bordered", inputStyle: "bordered", linkTreatment: "underline" },
  },
  {
    name: "Minimal",
    values: { buttonStyle: "ghost", cardStyle: "flat", inputStyle: "underline", linkTreatment: "color-only" },
  },
];

// ---------------------------------------------------------------------------
// Deep equality helpers for detecting active variant
// ---------------------------------------------------------------------------

export function colorsMatch(a: ColorPalette, b: ColorPalette): boolean {
  return (
    a.primary === b.primary && a.secondary === b.secondary && a.accent === b.accent &&
    a.background === b.background && a.surface === b.surface && a.text === b.text &&
    a.textMuted === b.textMuted && a.border === b.border
  );
}

export function typographyMatch(a: Typography, b: Typography): boolean {
  return (
    a.headingFont === b.headingFont && a.bodyFont === b.bodyFont && a.monoFont === b.monoFont &&
    a.headingWeight === b.headingWeight && a.bodySize === b.bodySize &&
    a.headingTransform === b.headingTransform && a.letterSpacing === b.letterSpacing
  );
}

export function shapeMatch(a: Shape, b: Shape): boolean {
  return (
    a.borderRadius === b.borderRadius && a.spacingDensity === b.spacingDensity &&
    a.shadowStyle === b.shadowStyle && a.borderWeight === b.borderWeight
  );
}

export function componentMatch(a: ComponentStyle, b: ComponentStyle): boolean {
  return (
    a.buttonStyle === b.buttonStyle && a.cardStyle === b.cardStyle &&
    a.inputStyle === b.inputStyle && a.linkTreatment === b.linkTreatment
  );
}
