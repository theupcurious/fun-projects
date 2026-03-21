"use client";

import type { OgMeta } from "@/lib/types";

interface LinkedInCardProps {
  meta: OgMeta;
  imageUrl: string | null;
}

function truncate(str: string | null | undefined, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

export function LinkedInCard({ meta, imageUrl }: LinkedInCardProps) {
  const title = truncate(meta.ogTitle ?? meta.twitterTitle ?? meta.title, 120);
  const description = truncate(
    meta.ogDescription ?? meta.twitterDescription ?? meta.description,
    200
  );

  let domain = "";
  try {
    domain = new URL(meta.ogUrl ?? meta.canonical ?? "https://example.com")
      .hostname.replace(/^www\./, "")
      .toUpperCase();
  } catch {
    domain = "EXAMPLE.COM";
  }

  return (
    <div className="flex flex-col">
      <div className="text-xs font-semibold text-zinc-500 mb-2 tracking-wide uppercase">
        LinkedIn
      </div>

      {/* Card shell — LinkedIn uses a clean white card with light border */}
      <div className="rounded border border-zinc-300 dark:border-zinc-600 overflow-hidden bg-white dark:bg-zinc-900 max-w-[522px] shadow-sm">
        {/* Large image on top */}
        {imageUrl ? (
          <div className="relative w-full aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="w-full aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-400 text-sm">No image</span>
          </div>
        )}

        {/* Card body */}
        <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50">
          {title && (
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
              {title}
            </p>
          )}
          {description && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug line-clamp-2">
              {description}
            </p>
          )}
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
            {domain}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-zinc-400 mt-1.5">Approximate preview</p>
    </div>
  );
}
