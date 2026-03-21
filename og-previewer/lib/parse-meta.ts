import * as cheerio from "cheerio";
import type { OgMeta } from "./types";

function resolveUrl(value: string | null | undefined, baseUrl: string): string | null {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export function parseMeta(html: string, pageUrl: string): OgMeta {
  const $ = cheerio.load(html);

  const meta = (name: string): string | null =>
    $(`meta[property="${name}"]`).attr("content") ??
    $(`meta[name="${name}"]`).attr("content") ??
    null;

  const trim = (v: string | null | undefined): string | null =>
    v?.trim() || null;

  // Favicon: try link[rel~="icon"] variants, then /favicon.ico fallback
  let favicon: string | null = null;
  const iconSelectors = [
    'link[rel="shortcut icon"]',
    'link[rel="icon"]',
    'link[rel="apple-touch-icon"]',
  ];
  for (const sel of iconSelectors) {
    const href = trim($(sel).first().attr("href"));
    if (href) {
      favicon = resolveUrl(href, pageUrl);
      break;
    }
  }
  if (!favicon) {
    try {
      const base = new URL(pageUrl);
      favicon = `${base.protocol}//${base.host}/favicon.ico`;
    } catch {
      favicon = null;
    }
  }

  const canonical = trim($('link[rel="canonical"]').attr("href")) ?? trim(meta("og:url"));

  const ogImage = trim(meta("og:image")) ?? trim(meta("og:image:url"));
  const twitterImage = trim(meta("twitter:image")) ?? trim(meta("twitter:image:src"));

  return {
    title: trim($("title").first().text()) ?? trim(meta("og:title")),
    description: trim(meta("description")),
    ogTitle: trim(meta("og:title")),
    ogDescription: trim(meta("og:description")),
    ogImage: ogImage ? resolveUrl(ogImage, pageUrl) : null,
    ogUrl: trim(meta("og:url")),
    ogType: trim(meta("og:type")),
    ogSiteName: trim(meta("og:site_name")),
    twitterCard: trim(meta("twitter:card")),
    twitterTitle: trim(meta("twitter:title")),
    twitterDescription: trim(meta("twitter:description")),
    twitterImage: twitterImage ? resolveUrl(twitterImage, pageUrl) : null,
    twitterSite: trim(meta("twitter:site")),
    favicon,
    canonical,
  };
}
