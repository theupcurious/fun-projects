export type GeneratedGrid = {
  size: number;
  oddIndex: number;
  baseColor: string;
  oddColor: string;
  colors: string[];
  hue: number;
  background: string;
};

const MIN_LIGHTNESS = 18;
const MAX_LIGHTNESS = 82;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const randomHue = (): number => Math.floor(Math.random() * 360);

export const hslToHex = (h: number, s: number, l: number): string => {
  const normalizedLightness = l / 100;
  const alpha = (s * Math.min(normalizedLightness, 1 - normalizedLightness)) / 100;

  const toChannel = (n: number): number => {
    const k = (n + h / 30) % 12;
    const color = normalizedLightness - alpha * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };

  const rgb = [toChannel(0), toChannel(8), toChannel(4)];
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

export const complementaryBg = (hue: number): string => {
  const complimentHue = (hue + 180) % 360;
  return `hsl(${complimentHue} 28% 11%)`;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
};

const toLinearChannel = (channel: number): number => {
  const sRgb = channel / 255;
  if (sRgb <= 0.04045) {
    return sRgb / 12.92;
  }

  return ((sRgb + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  const red = toLinearChannel(r);
  const green = toLinearChannel(g);
  const blue = toLinearChannel(b);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (a: string, b: string): number => {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const light = Math.max(first, second);
  const dark = Math.min(first, second);
  return (light + 0.05) / (dark + 0.05);
};

const minContrastForDelta = (delta: number): number => {
  if (delta >= 10) {
    return 1.18;
  }
  if (delta >= 7) {
    return 1.14;
  }
  if (delta >= 5) {
    return 1.11;
  }
  if (delta >= 3) {
    return 1.095;
  }
  return 1.085;
};

const pickLightnessPair = (lightness: number, delta: number): [number, number] => {
  const add = clamp(lightness + delta, MIN_LIGHTNESS, MAX_LIGHTNESS);
  const subtract = clamp(lightness - delta, MIN_LIGHTNESS, MAX_LIGHTNESS);

  const addDistance = Math.abs(add - lightness);
  const subtractDistance = Math.abs(lightness - subtract);

  if (addDistance === subtractDistance) {
    return Math.random() < 0.5 ? [lightness, add] : [lightness, subtract];
  }

  return addDistance > subtractDistance ? [lightness, add] : [lightness, subtract];
};

export const generateGrid = (size: number, delta: number, incomingHue?: number): GeneratedGrid => {
  const hue = incomingHue ?? randomHue();
  const saturation = 70 + Math.floor(Math.random() * 18);
  const baseLightness = 38 + Math.floor(Math.random() * 26);
  const minimumContrast = minContrastForDelta(delta);
  const hueSensitivityBoost = hue >= 90 && hue <= 170 ? 1 : 0;

  let baseColor = hslToHex(hue, saturation, baseLightness);
  let oddColor = hslToHex(hue, saturation, clamp(baseLightness + delta, MIN_LIGHTNESS, MAX_LIGHTNESS));
  let bestContrast = contrastRatio(baseColor, oddColor);

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const extraDelta = Math.floor(attempt / 4) + hueSensitivityBoost;
    const [lightness, oddLightness] = pickLightnessPair(baseLightness, delta + extraDelta);

    const nextBaseColor = hslToHex(hue, saturation, lightness);
    const nextOddColor = hslToHex(hue, saturation, oddLightness);
    const nextContrast = contrastRatio(nextBaseColor, nextOddColor);

    if (nextContrast > bestContrast) {
      baseColor = nextBaseColor;
      oddColor = nextOddColor;
      bestContrast = nextContrast;
    }

    if (nextBaseColor !== nextOddColor && nextContrast >= minimumContrast) {
      baseColor = nextBaseColor;
      oddColor = nextOddColor;
      break;
    }
  }

  const totalTiles = size * size;
  const oddIndex = Math.floor(Math.random() * totalTiles);

  const colors = Array.from({ length: totalTiles }, (_, index) => {
    return index === oddIndex ? oddColor : baseColor;
  });

  return {
    size,
    oddIndex,
    baseColor,
    oddColor,
    colors,
    hue,
    background: complementaryBg(hue)
  };
};
