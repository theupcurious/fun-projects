export interface FontMeta {
  name: string;
  family: string; // CSS font-family value
  category: "serif" | "sans-serif" | "monospace" | "display";
  weights: number[];
  googleName: string; // URL-encoded name for Google Fonts
}

export const CURATED_FONTS: FontMeta[] = [
  // Serifs
  { name: "Playfair Display", family: "'Playfair Display', serif", category: "serif", weights: [400, 500, 600, 700, 800, 900], googleName: "Playfair+Display" },
  { name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", category: "serif", weights: [300, 400, 500, 600, 700], googleName: "Cormorant+Garamond" },
  { name: "EB Garamond", family: "'EB Garamond', serif", category: "serif", weights: [400, 500, 600, 700, 800], googleName: "EB+Garamond" },
  { name: "Lora", family: "'Lora', serif", category: "serif", weights: [400, 500, 600, 700], googleName: "Lora" },
  { name: "Libre Baskerville", family: "'Libre Baskerville', serif", category: "serif", weights: [400, 700], googleName: "Libre+Baskerville" },
  { name: "Source Serif 4", family: "'Source Serif 4', serif", category: "serif", weights: [300, 400, 600, 700, 900], googleName: "Source+Serif+4" },
  { name: "DM Serif Display", family: "'DM Serif Display', serif", category: "serif", weights: [400], googleName: "DM+Serif+Display" },
  { name: "Fraunces", family: "'Fraunces', serif", category: "serif", weights: [300, 400, 500, 600, 700, 800, 900], googleName: "Fraunces" },

  // Sans-serifs
  { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700], googleName: "Space+Grotesk" },
  { name: "DM Sans", family: "'DM Sans', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700], googleName: "DM+Sans" },
  { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800], googleName: "Plus+Jakarta+Sans" },
  { name: "Syne", family: "'Syne', sans-serif", category: "sans-serif", weights: [400, 500, 600, 700, 800], googleName: "Syne" },
  { name: "Outfit", family: "'Outfit', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700], googleName: "Outfit" },
  { name: "Manrope", family: "'Manrope', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800], googleName: "Manrope" },
  { name: "Barlow", family: "'Barlow', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700], googleName: "Barlow" },
  { name: "Raleway", family: "'Raleway', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800, 900], googleName: "Raleway" },
  { name: "Nunito", family: "'Nunito', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700, 800], googleName: "Nunito" },
  { name: "Karla", family: "'Karla', sans-serif", category: "sans-serif", weights: [300, 400, 500, 600, 700], googleName: "Karla" },
  { name: "Josefin Sans", family: "'Josefin Sans', sans-serif", category: "sans-serif", weights: [300, 400, 600, 700], googleName: "Josefin+Sans" },

  // Monospace
  { name: "JetBrains Mono", family: "'JetBrains Mono', monospace", category: "monospace", weights: [400, 500, 700], googleName: "JetBrains+Mono" },
  { name: "Space Mono", family: "'Space Mono', monospace", category: "monospace", weights: [400, 700], googleName: "Space+Mono" },
  { name: "Fira Code", family: "'Fira Code', monospace", category: "monospace", weights: [300, 400, 500, 700], googleName: "Fira+Code" },
  { name: "IBM Plex Mono", family: "'IBM Plex Mono', monospace", category: "monospace", weights: [400, 500, 700], googleName: "IBM+Plex+Mono" },
  { name: "Courier Prime", family: "'Courier Prime', monospace", category: "monospace", weights: [400, 700], googleName: "Courier+Prime" },

  // Display / Decorative
  { name: "Cabinet Grotesk", family: "'Cabinet Grotesk', sans-serif", category: "display", weights: [300, 400, 500, 700, 800], googleName: "Cabinet+Grotesk" },
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", category: "display", weights: [400], googleName: "Bebas+Neue" },
  { name: "Anton", family: "'Anton', sans-serif", category: "display", weights: [400], googleName: "Anton" },
  { name: "Abril Fatface", family: "'Abril Fatface', serif", category: "display", weights: [400], googleName: "Abril+Fatface" },
  { name: "Righteous", family: "'Righteous', sans-serif", category: "display", weights: [400], googleName: "Righteous" },
  { name: "Lobster", family: "'Lobster', sans-serif", category: "display", weights: [400], googleName: "Lobster" },
];

export function getFontByName(name: string): FontMeta | undefined {
  return CURATED_FONTS.find((f) => f.name === name);
}

export function buildGoogleFontsUrl(fonts: string[]): string {
  const unique = [...new Set(fonts)].filter(Boolean);
  if (unique.length === 0) return "";

  const families = unique
    .map((name) => {
      const meta = getFontByName(name);
      if (!meta) return null;
      const wghts = meta.weights.join(";");
      return `family=${meta.googleName}:wght@${wghts}`;
    })
    .filter(Boolean)
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
