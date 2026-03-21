import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import probeImageSize from "probe-image-size";
import { validateUrl } from "@/lib/validate-url";
import { fetchHtml } from "@/lib/fetch-meta";
import { parseMeta } from "@/lib/parse-meta";
import { runDiagnostics } from "@/lib/diagnostics";
import type { OgResponse, ImageProbe } from "@/lib/types";

const RequestSchema = z.object({
  url: z.string().min(1).max(2048),
});

// Simple in-memory rate limiter: max 20 req/min per IP
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request: url is required." },
      { status: 400 }
    );
  }

  const { url: rawUrl } = parsed.data;

  // Validate + SSRF check
  const validation = await validateUrl(rawUrl);
  if (validation.error) {
    return NextResponse.json({ error: validation.error }, { status: 422 });
  }

  const url = validation.url!;

  // Fetch HTML
  const fetchResult = await fetchHtml(url);
  if (fetchResult.error) {
    return NextResponse.json({ error: fetchResult.error }, { status: 422 });
  }

  const html = fetchResult.html!;
  const finalUrl = fetchResult.finalUrl!;

  // Parse metadata
  const meta = parseMeta(html, finalUrl);

  // Probe image dimensions if available
  let image: ImageProbe | null = null;
  const imageUrl = meta.ogImage ?? meta.twitterImage;
  if (imageUrl) {
    try {
      const probe = await probeImageSize(imageUrl, { timeout: 5000 });
      image = {
        width: probe.width,
        height: probe.height,
        type: probe.type,
        url: imageUrl,
      };
    } catch {
      // Non-fatal: diagnostics will reflect missing dimensions
    }
  }

  // Run diagnostics
  const diagnostics = runDiagnostics(meta, image);

  const response: OgResponse = {
    url: finalUrl,
    meta,
    image,
    diagnostics,
    notes: ["Previews are approximate and may differ from live platform rendering."],
  };

  return NextResponse.json(response);
}
