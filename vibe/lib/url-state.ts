import type { DesignLanguage } from "./types";
import { DEFAULT_DESIGN } from "./presets";

function safeEncode(obj: unknown): string {
  try {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
  } catch {
    return "";
  }
}

function safeDecode(str: string): unknown {
  try {
    return JSON.parse(decodeURIComponent(atob(str)));
  } catch {
    return null;
  }
}

export function encodeDesignToHash(lang: DesignLanguage): string {
  return "#v1:" + safeEncode(lang);
}

export function decodeHashToDesign(hash: string): DesignLanguage | null {
  if (!hash.startsWith("#v1:")) return null;
  const encoded = hash.slice(4);
  const decoded = safeDecode(encoded);
  if (!decoded || typeof decoded !== "object") return null;

  // Merge deeply so partial/older hashes keep missing nested tokens from defaults.
  const partial = decoded as Partial<DesignLanguage>;
  return {
    ...DEFAULT_DESIGN,
    ...partial,
    colors: {
      ...DEFAULT_DESIGN.colors,
      ...(partial.colors ?? {}),
    },
    typography: {
      ...DEFAULT_DESIGN.typography,
      ...(partial.typography ?? {}),
    },
    shape: {
      ...DEFAULT_DESIGN.shape,
      ...(partial.shape ?? {}),
    },
    components: {
      ...DEFAULT_DESIGN.components,
      ...(partial.components ?? {}),
    },
  };
}

export function getShareUrl(lang: DesignLanguage): string {
  if (typeof window === "undefined") return "";
  const hash = encodeDesignToHash(lang);
  return `${window.location.origin}${window.location.pathname}${hash}`;
}

export function readDesignFromUrl(): DesignLanguage | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash) return null;
  return decodeHashToDesign(hash);
}
