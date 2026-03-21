import type { OgMeta, Diagnostic, ImageProbe } from "./types";

// Conservative display thresholds (heuristics, not authoritative)
const TITLE_WARN_LENGTH = 70;
const DESCRIPTION_WARN_LENGTH = 200;
const IMAGE_MIN_WIDTH = 600;
const IMAGE_MIN_HEIGHT = 315;

export function runDiagnostics(meta: OgMeta, image: ImageProbe | null): Diagnostic[] {
  const results: Diagnostic[] = [];

  // --- Errors ---

  const hasImage = !!(meta.ogImage || meta.twitterImage);
  results.push({
    rule: "share_image_present",
    status: hasImage ? "pass" : "error",
    message: hasImage ? undefined : "No og:image or twitter:image found. Most platforms won't show an image card.",
    confidence: "heuristic",
  });

  const hasTitle = !!(meta.ogTitle || meta.twitterTitle || meta.title);
  results.push({
    rule: "title_present",
    status: hasTitle ? "pass" : "error",
    message: hasTitle ? undefined : "No title tag found. A title is required for all platform cards.",
    confidence: "heuristic",
  });

  // --- Warnings ---

  const hasDescription = !!(meta.ogDescription || meta.description);
  results.push({
    rule: "description_present",
    status: hasDescription ? "pass" : "warn",
    message: hasDescription ? undefined : "No og:description or meta description found. Cards may show little or no body text.",
    confidence: "heuristic",
  });

  if (image) {
    const tooSmall = image.width < IMAGE_MIN_WIDTH || image.height < IMAGE_MIN_HEIGHT;
    results.push({
      rule: "image_size_estimate",
      status: tooSmall ? "warn" : "pass",
      message: tooSmall
        ? `Image is ${image.width}×${image.height}. Large-card formats typically expect at least ${IMAGE_MIN_WIDTH}×${IMAGE_MIN_HEIGHT}.`
        : undefined,
      value: `${image.width}×${image.height}`,
      confidence: "heuristic",
    });
  }

  const effectiveTitle = meta.ogTitle ?? meta.twitterTitle ?? meta.title ?? "";
  if (effectiveTitle) {
    const titleLong = effectiveTitle.length > TITLE_WARN_LENGTH;
    results.push({
      rule: "title_length_estimate",
      status: titleLong ? "warn" : "pass",
      message: titleLong
        ? `Title is ${effectiveTitle.length} characters, which may be truncated on some platforms (threshold: ~${TITLE_WARN_LENGTH}).`
        : undefined,
      value: effectiveTitle.length,
      confidence: "heuristic",
    });
  }

  const effectiveDesc = meta.ogDescription ?? meta.description ?? "";
  if (effectiveDesc) {
    const descLong = effectiveDesc.length > DESCRIPTION_WARN_LENGTH;
    results.push({
      rule: "description_length_estimate",
      status: descLong ? "warn" : "pass",
      message: descLong
        ? `Description is ${effectiveDesc.length} characters, which may be truncated (threshold: ~${DESCRIPTION_WARN_LENGTH}).`
        : undefined,
      value: effectiveDesc.length,
      confidence: "heuristic",
    });
  }

  results.push({
    rule: "twitter_card_type",
    status: meta.twitterCard ? "pass" : "warn",
    message: meta.twitterCard ? undefined : "No twitter:card tag found. X may fall back to a minimal link preview.",
    confidence: "heuristic",
  });

  const imageUrl = meta.ogImage ?? meta.twitterImage ?? "";
  if (imageUrl) {
    const insecure = imageUrl.startsWith("http://");
    results.push({
      rule: "image_url_secure",
      status: insecure ? "warn" : "pass",
      message: insecure ? "Image URL uses http://. Some platforms may block or downgrade insecure image URLs." : undefined,
      confidence: "heuristic",
    });
  }

  // --- Info ---

  results.push({
    rule: "favicon_present",
    status: meta.favicon ? "pass" : "info",
    message: meta.favicon ? undefined : "No favicon found. Slack and some other surfaces display a favicon with link previews.",
    confidence: "heuristic",
  });

  return results;
}
