"use client";

import type { OgMeta } from "@/lib/types";

interface XCardProps {
  meta: OgMeta;
  imageUrl: string | null;
}

function truncate(str: string | null | undefined, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

export function XCard({ meta, imageUrl }: XCardProps) {
  const isLargeCard =
    meta.twitterCard === "summary_large_image" ||
    (!meta.twitterCard && !!imageUrl);

  const title = truncate(
    meta.twitterTitle ?? meta.ogTitle ?? meta.title,
    70
  );
  const description = truncate(
    meta.twitterDescription ?? meta.ogDescription ?? meta.description,
    isLargeCard ? 160 : 100
  );

  let domain = "";
  try {
    domain = new URL(meta.ogUrl ?? meta.canonical ?? "https://example.com").hostname.replace(/^www\./, "");
  } catch {
    domain = "example.com";
  }

  return (
    <div className="flex flex-col">
      <div className="text-xs font-semibold text-zinc-500 mb-2 tracking-wide uppercase">
        X (Twitter)
      </div>

      {/* Card shell */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900 max-w-[504px]">
        {isLargeCard && imageUrl ? (
          /* Large card: full-width image on top */
          <>
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
            <div className="px-3 py-2">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{domain}</p>
              {title && (
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">
                  {title}
                </p>
              )}
              {description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                  {description}
                </p>
              )}
            </div>
          </>
        ) : (
          /* Summary card: thumbnail on the right */
          <div className="flex items-stretch">
            <div className="flex-1 px-3 py-2 min-w-0">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{domain}</p>
              {title && (
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug line-clamp-1">
                  {title}
                </p>
              )}
              {description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            {imageUrl && (
              <div className="w-[84px] flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
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
            )}
          </div>
        )}
      </div>

    </div>
  );
}
