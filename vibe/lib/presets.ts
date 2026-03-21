import type { DesignLanguage, MoodGroup, PresetId } from "./types";
import { getColorVariants, getTypographyVariants } from "./variants";

export interface Preset {
  id: PresetId;
  group: MoodGroup;
  name: string;
  description: string;
  reference: string;
  aestheticBlurb: string;
  values: DesignLanguage;
}

export const PRESETS: Preset[] = [
  // ── Professional ──────────────────────────────────────────────────────────
  {
    id: "editorial",
    group: "professional",
    name: "Editorial",
    description: "Serif-forward, magazine-like",
    reference: "Stripe Press, The Outline",
    aestheticBlurb:
      "Editorial and refined. Think Stripe Press — confident serif headings, clean sans-serif body, generous whitespace, restrained color use with one warm accent. Avoid rounded or playful elements. Prefer sharp, intentional composition over gradients.",
    values: {
      presetId: "editorial",
      mode: "light",
      colors: {
        primary: "#1a1a1a",
        secondary: "#c8a96e",
        accent: "#e05a2b",
        background: "#faf8f5",
        surface: "#f0ece4",
        text: "#1a1a1a",
        textMuted: "#6b6560",
        border: "#d4cfc8",
      },
      typography: {
        headingFont: "Playfair Display",
        bodyFont: "Source Serif 4",
        monoFont: "IBM Plex Mono",
        headingWeight: 700,
        bodySize: 17,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 2,
        spacingDensity: "generous",
        shadowStyle: "none",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "bordered",
        inputStyle: "underline",
        linkTreatment: "underline",
      },
    },
  },
  {
    id: "minimal",
    group: "professional",
    name: "Minimal",
    description: "Restrained, clean, lots of air",
    reference: "Apple, Rauno Freiberg",
    aestheticBlurb:
      "True minimalism — not sparse-by-default but intentional restraint. One font, two weights, near-black on white, subtle interactive states. Nothing decorative. Every choice earns its space.",
    values: {
      presetId: "minimal",
      mode: "light",
      colors: {
        primary: "#0a0a0a",
        secondary: "#404040",
        accent: "#0a0a0a",
        background: "#ffffff",
        surface: "#f7f7f7",
        text: "#0a0a0a",
        textMuted: "#888888",
        border: "#e8e8e8",
      },
      typography: {
        headingFont: "Syne",
        bodyFont: "DM Sans",
        monoFont: "JetBrains Mono",
        headingWeight: 700,
        bodySize: 15,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 6,
        spacingDensity: "generous",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "flat",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "dashboard",
    group: "professional",
    name: "Dashboard",
    description: "Dense, functional, data-forward",
    reference: "Vercel, Linear",
    aestheticBlurb:
      "Functional and precise. Dense layout, neutral dark palette, system-like UI. Everything earns its pixel. No decorative whitespace, no personality-driven color. Looks like it was built by engineers who care about craft.",
    values: {
      presetId: "dashboard",
      mode: "dark",
      colors: {
        primary: "#3b82f6",
        secondary: "#6366f1",
        accent: "#10b981",
        background: "#0a0a0f",
        surface: "#111118",
        text: "#e5e7eb",
        textMuted: "#6b7280",
        border: "#1f2028",
      },
      typography: {
        headingFont: "Plus Jakarta Sans",
        bodyFont: "Manrope",
        monoFont: "JetBrains Mono",
        headingWeight: 600,
        bodySize: 14,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 6,
        spacingDensity: "compact",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "bordered",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "corporate",
    group: "professional",
    name: "Corporate",
    description: "Trustworthy, polished, blue-chip",
    reference: "Stripe, Intercom, Slack",
    aestheticBlurb:
      "Corporate polish without the stuffiness. Clean sans-serif typography, a blue-driven palette that conveys trust, well-structured layouts with clear hierarchy. Professional but not boring — think Stripe's confidence, not a bank's rigidity.",
    values: {
      presetId: "corporate",
      mode: "light",
      colors: {
        primary: "#1e40af",
        secondary: "#3b82f6",
        accent: "#0ea5e9",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#0f172a",
        textMuted: "#64748b",
        border: "#e2e8f0",
      },
      typography: {
        headingFont: "Plus Jakarta Sans",
        bodyFont: "DM Sans",
        monoFont: "JetBrains Mono",
        headingWeight: 700,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 8,
        spacingDensity: "default",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "bordered",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "saas",
    group: "professional",
    name: "SaaS",
    description: "Clean, conversion-focused, product-led",
    reference: "Linear, Vercel marketing, Resend",
    aestheticBlurb:
      "Modern SaaS aesthetic — clean lines, purposeful whitespace, a single bold accent color for CTAs. Typography is sharp and readable. Feels fast, focused, and engineered for conversion. Avoid decoration; let the product speak.",
    values: {
      presetId: "saas",
      mode: "light",
      colors: {
        primary: "#111827",
        secondary: "#6366f1",
        accent: "#8b5cf6",
        background: "#ffffff",
        surface: "#f9fafb",
        text: "#111827",
        textMuted: "#6b7280",
        border: "#e5e7eb",
      },
      typography: {
        headingFont: "Space Grotesk",
        bodyFont: "Manrope",
        monoFont: "JetBrains Mono",
        headingWeight: 600,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 10,
        spacingDensity: "generous",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "monochrome",
    group: "professional",
    name: "Monochrome",
    description: "Pure black & white, type-driven",
    reference: "iA Writer, Notion minimal, Bear",
    aestheticBlurb:
      "Stripped to essentials — pure black on white (or white on black). No accent colors, no decoration. Typography hierarchy does all the visual work. Feels authoritative and focused. Every element must earn its place.",
    values: {
      presetId: "monochrome",
      mode: "light",
      colors: {
        primary: "#000000",
        secondary: "#333333",
        accent: "#000000",
        background: "#ffffff",
        surface: "#fafafa",
        text: "#000000",
        textMuted: "#71717a",
        border: "#e4e4e7",
      },
      typography: {
        headingFont: "Space Grotesk",
        bodyFont: "DM Sans",
        monoFont: "IBM Plex Mono",
        headingWeight: 700,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 4,
        spacingDensity: "generous",
        shadowStyle: "none",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "flat",
        inputStyle: "underline",
        linkTreatment: "underline",
      },
    },
  },
  // ── Creative ──────────────────────────────────────────────────────────────
  {
    id: "playful",
    group: "creative",
    name: "Playful",
    description: "Rounded, colorful, bouncy",
    reference: "Linear marketing, Notion",
    aestheticBlurb:
      "Playful and inviting. Rounded everything, bright personality-driven color, soft shadows, and generous spacing. Feels approachable and human. Avoid sharp angles, heavy borders, or anything that feels austere.",
    values: {
      presetId: "playful",
      mode: "light",
      colors: {
        primary: "#6c47ff",
        secondary: "#ff6b6b",
        accent: "#ffc947",
        background: "#ffffff",
        surface: "#f5f3ff",
        text: "#1a1028",
        textMuted: "#7a6fa0",
        border: "#e5e0f5",
      },
      typography: {
        headingFont: "Nunito",
        bodyFont: "DM Sans",
        monoFont: "Fira Code",
        headingWeight: 800,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 16,
        spacingDensity: "generous",
        shadowStyle: "elevated",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "retro",
    group: "creative",
    name: "Retro",
    description: "Warm, vintage, textured",
    reference: "Poolsuite, Teenage Engineering",
    aestheticBlurb:
      "Warm and retro. Earthy palette, vintage typography, a sense of handcraft and texture. Not nostalgic kitsch — more like a confident product from the 1970s that knew what it was doing. Avoid anything that looks modern or polished.",
    values: {
      presetId: "retro",
      mode: "light",
      colors: {
        primary: "#c94f1a",
        secondary: "#4a7c5a",
        accent: "#e8b84b",
        background: "#f5ead5",
        surface: "#ede0c0",
        text: "#2a1f0e",
        textMuted: "#6b5a3a",
        border: "#c4a87a",
      },
      typography: {
        headingFont: "Abril Fatface",
        bodyFont: "Karla",
        monoFont: "Courier Prime",
        headingWeight: 400,
        bodySize: 15,
        headingTransform: "none",
        letterSpacing: 0,
      },
      shape: {
        borderRadius: 4,
        spacingDensity: "default",
        shadowStyle: "dramatic",
        borderWeight: "medium",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "bordered",
        inputStyle: "bordered",
        linkTreatment: "underline",
      },
    },
  },
  {
    id: "brutalist",
    group: "creative",
    name: "Brutalist",
    description: "Raw, high-contrast, monospace",
    reference: "Craigslist meets Virgil Abloh",
    aestheticBlurb:
      "Brutalist and confrontational. Monospace everywhere, maximum contrast, zero decoration. Sharp edges, heavy borders, no shadows. Typography does the design work. Avoid anything soft, rounded, or visually gentle.",
    values: {
      presetId: "brutalist",
      mode: "light",
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        accent: "#ff3333",
        background: "#ffffff",
        surface: "#f0f0f0",
        text: "#000000",
        textMuted: "#555555",
        border: "#000000",
      },
      typography: {
        headingFont: "Space Mono",
        bodyFont: "Space Mono",
        monoFont: "Space Mono",
        headingWeight: 700,
        bodySize: 14,
        headingTransform: "uppercase",
        letterSpacing: 2,
      },
      shape: {
        borderRadius: 0,
        spacingDensity: "compact",
        shadowStyle: "none",
        borderWeight: "heavy",
      },
      components: {
        buttonStyle: "outline",
        cardStyle: "bordered",
        inputStyle: "bordered",
        linkTreatment: "underline",
      },
    },
  },
  {
    id: "studio",
    group: "creative",
    name: "Studio",
    description: "Bold type, confident, agency feel",
    reference: "Pentagram, Collins, Huge Inc",
    aestheticBlurb:
      "Design studio energy — oversized typography, asymmetric confidence, a sense that every pixel was placed with intention. Bold but not loud. Prefers one strong typeface over busy combinations. Avoid cute, playful, or corporate.",
    values: {
      presetId: "studio",
      mode: "light",
      colors: {
        primary: "#1a1a1a",
        secondary: "#e63946",
        accent: "#e63946",
        background: "#f1f0eb",
        surface: "#e8e6df",
        text: "#1a1a1a",
        textMuted: "#6b6b6b",
        border: "#d1d0ca",
      },
      typography: {
        headingFont: "Syne",
        bodyFont: "Barlow",
        monoFont: "Space Mono",
        headingWeight: 800,
        bodySize: 16,
        headingTransform: "uppercase",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 0,
        spacingDensity: "generous",
        shadowStyle: "none",
        borderWeight: "medium",
      },
      components: {
        buttonStyle: "outline",
        cardStyle: "flat",
        inputStyle: "underline",
        linkTreatment: "underline",
      },
    },
  },
  {
    id: "whimsical",
    group: "creative",
    name: "Whimsical",
    description: "Soft, illustrated, storybook warmth",
    reference: "Mailchimp, Dropbox Paper, Duolingo",
    aestheticBlurb:
      "Warm and whimsical — like a well-designed children's book for adults. Soft rounded shapes, warm secondary colors, a font that feels handwritten without being illegible. Approachable without being childish. Avoid anything sharp, dark, or corporate.",
    values: {
      presetId: "whimsical",
      mode: "light",
      colors: {
        primary: "#7c3aed",
        secondary: "#f472b6",
        accent: "#fbbf24",
        background: "#fffbf0",
        surface: "#fef3e2",
        text: "#1f1235",
        textMuted: "#7c6f94",
        border: "#ede4d4",
      },
      typography: {
        headingFont: "Fraunces",
        bodyFont: "Nunito",
        monoFont: "Fira Code",
        headingWeight: 700,
        bodySize: 17,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 16,
        spacingDensity: "generous",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "handcraft",
    group: "creative",
    name: "Handcraft",
    description: "Warm, artisanal, craft-studio feel",
    reference: "Etsy sellers, indie ceramics brands, local bakeries",
    aestheticBlurb:
      "Artisanal and tactile — warm cream backgrounds, terracotta and sage tones, a sense that something was made by hand with care. Rounded humanist type, generous spacing, warmth implied through earthy palette. Avoid anything digital, cold, or corporate.",
    values: {
      presetId: "handcraft",
      mode: "light",
      colors: {
        primary: "#c4622d",
        secondary: "#6b8f71",
        accent: "#d4a853",
        background: "#faf4ec",
        surface: "#f0e8d8",
        text: "#2a1f14",
        textMuted: "#7a6655",
        border: "#d8c8b0",
      },
      typography: {
        headingFont: "Lora",
        bodyFont: "Nunito",
        monoFont: "IBM Plex Mono",
        headingWeight: 600,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 8,
        spacingDensity: "generous",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "underline",
      },
    },
  },
  // ── Bold ──────────────────────────────────────────────────────────────────
  {
    id: "luxury",
    group: "bold",
    name: "Luxury",
    description: "Dark, refined serif, gold accents",
    reference: "Aesop, Bottega Veneta",
    aestheticBlurb:
      "Quiet luxury. Dark background with cream text, gold accent used sparingly. Refined serif headings with tight tracking, generous negative space, no shadows or decorative noise. Every element deliberate and restrained.",
    values: {
      presetId: "luxury",
      mode: "dark",
      colors: {
        primary: "#c9a96e",
        secondary: "#8a7a5a",
        accent: "#e8c97a",
        background: "#0f0d0a",
        surface: "#1a1710",
        text: "#f2ede4",
        textMuted: "#8c8070",
        border: "#2e2a20",
      },
      typography: {
        headingFont: "Cormorant Garamond",
        bodyFont: "EB Garamond",
        monoFont: "Courier Prime",
        headingWeight: 400,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: 3,
      },
      shape: {
        borderRadius: 0,
        spacingDensity: "generous",
        shadowStyle: "none",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "outline",
        cardStyle: "bordered",
        inputStyle: "underline",
        linkTreatment: "underline",
      },
    },
  },
  {
    id: "organic",
    group: "bold",
    name: "Organic",
    description: "Warm tones, natural, grounded",
    reference: "Patagonia, Aesop",
    aestheticBlurb:
      "Grounded and natural. Warm earthy tones, comfortable rounded shapes, a sense of material craft. Feels like something made by hand with good values. Avoid anything cold, digital, or slick.",
    values: {
      presetId: "organic",
      mode: "light",
      colors: {
        primary: "#2d5a27",
        secondary: "#8b6914",
        accent: "#d4622a",
        background: "#f8f4ee",
        surface: "#efe8db",
        text: "#1c2818",
        textMuted: "#6b6050",
        border: "#cec4b4",
      },
      typography: {
        headingFont: "Fraunces",
        bodyFont: "Barlow",
        monoFont: "IBM Plex Mono",
        headingWeight: 600,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 8,
        spacingDensity: "generous",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "underline",
      },
    },
  },
  {
    id: "neon",
    group: "bold",
    name: "Neon",
    description: "Electric, dark, cyberpunk energy",
    reference: "Vercel dark mode, GitHub Universe, Figma Config",
    aestheticBlurb:
      "Electric and futuristic. Deep dark background with neon accents that glow. High contrast, sharp edges, a sense of digital craftsmanship. Typography is clean and modern — the colors do the talking. Avoid warmth, softness, or anything organic.",
    values: {
      presetId: "neon",
      mode: "dark",
      colors: {
        primary: "#00ff88",
        secondary: "#6366f1",
        accent: "#f43f5e",
        background: "#09090b",
        surface: "#18181b",
        text: "#fafafa",
        textMuted: "#71717a",
        border: "#27272a",
      },
      typography: {
        headingFont: "Space Grotesk",
        bodyFont: "DM Sans",
        monoFont: "JetBrains Mono",
        headingWeight: 700,
        bodySize: 15,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 8,
        spacingDensity: "default",
        shadowStyle: "subtle",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "bordered",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "candy",
    group: "bold",
    name: "Candy",
    description: "Pastel, gradient-ready, Gen-Z",
    reference: "Figma, Notion covers, Framer templates",
    aestheticBlurb:
      "Pastel-forward and playful — soft pinks, lavenders, and mints. Generous rounding, light shadows, a sense of delight in every interaction. Typography is clean and modern but friendly. The palette should feel like a Figma template you'd actually want to use.",
    values: {
      presetId: "candy",
      mode: "light",
      colors: {
        primary: "#a855f7",
        secondary: "#ec4899",
        accent: "#06b6d4",
        background: "#fefcff",
        surface: "#faf5ff",
        text: "#1e1b4b",
        textMuted: "#7c71a6",
        border: "#ede9fe",
      },
      typography: {
        headingFont: "Plus Jakarta Sans",
        bodyFont: "Nunito",
        monoFont: "Fira Code",
        headingWeight: 700,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 14,
        spacingDensity: "generous",
        shadowStyle: "elevated",
        borderWeight: "none",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "startup",
    group: "bold",
    name: "Startup",
    description: "High-energy, bold, Series A vibes",
    reference: "Early-stage YC, Product Hunt, Arc browser",
    aestheticBlurb:
      "Startup energy — bold, optimistic, moving fast. A strong primary color that demands attention, clean sans-serif type, and a layout that feels like it was built by a small team that ships every day. Not polished, not rough — just confident.",
    values: {
      presetId: "startup",
      mode: "light",
      colors: {
        primary: "#f97316",
        secondary: "#2563eb",
        accent: "#16a34a",
        background: "#ffffff",
        surface: "#f8f8f8",
        text: "#0a0a0a",
        textMuted: "#737373",
        border: "#e5e5e5",
      },
      typography: {
        headingFont: "Outfit",
        bodyFont: "DM Sans",
        monoFont: "Fira Code",
        headingWeight: 700,
        bodySize: 16,
        headingTransform: "none",
        letterSpacing: -1,
      },
      shape: {
        borderRadius: 10,
        spacingDensity: "default",
        shadowStyle: "elevated",
        borderWeight: "hairline",
      },
      components: {
        buttonStyle: "filled",
        cardStyle: "elevated",
        inputStyle: "bordered",
        linkTreatment: "color-only",
      },
    },
  },
  {
    id: "cyberpunk",
    group: "bold",
    name: "Cyberpunk",
    description: "High contrast, dark, tech-dystopia",
    reference: "Blade Runner UI, sci-fi dashboards, hacker terminals",
    aestheticBlurb:
      "Dark and electric — near-black background with cyan and magenta accents that demand attention. Sharp corners, tight spacing, condensed geometric type with uppercase transforms. Feels like a sci-fi interface from 2049. Avoid warmth, softness, or anything organic.",
    values: {
      presetId: "cyberpunk",
      mode: "dark",
      colors: {
        primary: "#00e5ff",
        secondary: "#ff00aa",
        accent: "#ccff00",
        background: "#07070f",
        surface: "#0f0f1a",
        text: "#e8eaf6",
        textMuted: "#7986cb",
        border: "#1a1a2e",
      },
      typography: {
        headingFont: "Rajdhani",
        bodyFont: "Share Tech Mono",
        monoFont: "Share Tech Mono",
        headingWeight: 700,
        bodySize: 15,
        headingTransform: "uppercase",
        letterSpacing: 2,
      },
      shape: {
        borderRadius: 2,
        spacingDensity: "compact",
        shadowStyle: "none",
        borderWeight: "medium",
      },
      components: {
        buttonStyle: "outline",
        cardStyle: "bordered",
        inputStyle: "underline",
        linkTreatment: "color-only",
      },
    },
  },
];

export const DEFAULT_DESIGN: DesignLanguage = PRESETS[0].values; // Editorial as default

export const MOOD_GROUPS: { id: MoodGroup; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "creative", label: "Creative" },
  { id: "bold", label: "Bold" },
];

export function getPresetsByGroup(): { group: MoodGroup; label: string; presets: Preset[] }[] {
  return MOOD_GROUPS.map(({ id, label }) => ({
    group: id,
    label,
    presets: PRESETS.filter((p) => p.group === id),
  }));
}

export function getPreset(id: PresetId): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export function getRandomDesign(): DesignLanguage {
  const preset = PRESETS[Math.floor(Math.random() * PRESETS.length)];
  const colorVariants = getColorVariants(preset.id);
  const typoVariants = getTypographyVariants(preset.id);

  const colors = colorVariants.length > 0
    ? colorVariants[Math.floor(Math.random() * colorVariants.length)].values
    : preset.values.colors;

  const typography = typoVariants.length > 0
    ? typoVariants[Math.floor(Math.random() * typoVariants.length)].values
    : preset.values.typography;

  return {
    ...preset.values,
    colors,
    typography,
    presetId: null,
  };
}
