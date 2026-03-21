import { validateRedirectUrl } from "./validate-url";

const MAX_HTML_BYTES = 512 * 1024; // 512 KB
const FETCH_TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 5;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; OGPreviewer/1.0; +https://og.upcurious.co)",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

export async function fetchHtml(url: URL): Promise<{ html: string; finalUrl: string; error?: never } | { html?: never; finalUrl?: never; error: string }> {
  let currentUrl = url.toString();
  let redirectCount = 0;

  while (redirectCount <= MAX_REDIRECTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(currentUrl, {
        method: "GET",
        headers: BROWSER_HEADERS,
        redirect: "manual",
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timer);
      const msg = err instanceof Error ? err.message : "Fetch failed";
      if (msg.includes("aborted") || msg.includes("timeout")) {
        return { error: "Request timed out." };
      }
      return { error: `Fetch error: ${msg}` };
    } finally {
      clearTimeout(timer);
    }

    // Handle redirects manually so we can validate each hop
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return { error: "Redirect with no Location header." };

      // Resolve relative redirect URLs
      const redirectUrl = new URL(location, currentUrl).toString();
      const redirectError = validateRedirectUrl(redirectUrl, url.hostname);
      if (redirectError) return { error: redirectError };

      currentUrl = redirectUrl;
      redirectCount++;
      continue;
    }

    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return { error: "URL does not return HTML content." };
    }

    // Stream with a size cap
    const reader = response.body?.getReader();
    if (!reader) return { error: "No response body." };

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        totalBytes += value.byteLength;
        if (totalBytes >= MAX_HTML_BYTES) {
          reader.cancel();
          break;
        }
      }
    }

    const combined = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const html = new TextDecoder().decode(combined);
    return { html, finalUrl: currentUrl };
  }

  return { error: "Too many redirects." };
}
