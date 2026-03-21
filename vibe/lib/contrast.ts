// WCAG relative luminance + contrast ratio helpers

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6 && clean.length !== 3) return null;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const r = srgbToLinear(rgb.r);
  const g = srgbToLinear(rgb.g);
  const b = srgbToLinear(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

export interface ContrastWarning {
  pair: string;
  ratio: number;
  min: number;
  message: string;
}

// --- HSL utilities for palette inversion ---

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const rgb = hexToRgb(hex);
  if (!rgb) return { h: 0, s: 0, l: 0 };
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function setLightness(hex: string, targetL: number, satScale = 1): string {
  const { h, s } = hexToHsl(hex);
  return hslToHex(h, Math.min(100, s * satScale), targetL);
}

export interface ColorPaletteForInvert {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

/**
 * Derive an inverted palette: light→dark or dark→light.
 * Structural colors (bg, surface, text, border) are remapped to new lightness
 * ranges while preserving hue. Brand colors (primary, secondary, accent) are
 * kept but adjusted if they'd lack contrast against the new background.
 */
export function invertPalette(
  colors: ColorPaletteForInvert,
  toDark: boolean
): ColorPaletteForInvert {
  const bgHsl = hexToHsl(colors.background);
  const surfHsl = hexToHsl(colors.surface);

  let newColors: ColorPaletteForInvert;

  if (toDark) {
    newColors = {
      background: setLightness(colors.background, 5, 0.4),
      surface: setLightness(colors.surface, 10 + (surfHsl.l - bgHsl.l) * 0.1, 0.5),
      text: setLightness(colors.text, 94),
      textMuted: setLightness(colors.textMuted, 52),
      border: setLightness(colors.border, 18, 0.5),
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
    };
  } else {
    newColors = {
      background: setLightness(colors.background, 98),
      surface: setLightness(colors.surface, 95 - (bgHsl.l - surfHsl.l) * 0.1),
      text: setLightness(colors.text, 8),
      textMuted: setLightness(colors.textMuted, 42),
      border: setLightness(colors.border, 88),
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
    };
  }

  const newBg = newColors.background;
  for (const key of ["primary", "secondary", "accent"] as const) {
    const ratio = contrastRatio(newColors[key], newBg);
    if (ratio < 3) {
      const { h, s } = hexToHsl(newColors[key]);
      newColors[key] = hslToHex(h, s, toDark ? 65 : 35);
    }
  }

  return newColors;
}

export function checkPaletteContrast(colors: {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}): ContrastWarning[] {
  const warnings: ContrastWarning[] = [];

  const checks: { a: string; b: string; label: string; min: number }[] = [
    { a: colors.text, b: colors.background, label: "Text on Background", min: 4.5 },
    { a: colors.text, b: colors.surface, label: "Text on Surface", min: 4.5 },
    { a: colors.textMuted, b: colors.background, label: "Muted text on Background", min: 3 },
    { a: colors.primary, b: colors.background, label: "Primary on Background", min: 3 },
  ];

  for (const { a, b, label, min } of checks) {
    const ratio = contrastRatio(a, b);
    if (ratio < min) {
      warnings.push({
        pair: label,
        ratio: Math.round(ratio * 10) / 10,
        min,
        message: `${label}: ${Math.round(ratio * 10) / 10}:1 (needs ${min}:1)`,
      });
    }
  }

  return warnings;
}
