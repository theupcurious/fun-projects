"use client";

import type { OgMeta } from "@/lib/types";

interface SlackCardProps {
  meta: OgMeta;
  imageUrl: string | null;
}

function truncate(str: string | null | undefined, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

export function SlackCard({ meta, imageUrl }: SlackCardProps) {
  const siteName = truncate(meta.ogSiteName, 60);
  const title = truncate(meta.ogTitle ?? meta.twitterTitle ?? meta.title, 100);
  const description = truncate(
    meta.ogDescription ?? meta.twitterDescription ?? meta.description,
    200
  );

  return (
    <div className="flex flex-col">
      <div className="text-xs font-semibold text-zinc-500 mb-2 tracking-wide uppercase">
        Slack
      </div>

      {/* Slack unfurl: left accent bar, site name + favicon, title, description, thumbnail */}
      <div className="max-w-[460px] rounded-sm overflow-hidden">
        <div className="flex">
          {/* Left accent bar */}
          <div className="w-1 flex-shrink-0 bg-zinc-300 dark:bg-zinc-600 rounded-l-sm" />

          {/* Content */}
          <div className="flex-1 pl-3 py-2 bg-white dark:bg-zinc-900 border border-l-0 border-zinc-200 dark:border-zinc-700 rounded-r-sm min-w-0">
            {/* Site name row */}
            <div className="flex items-center gap-1.5 mb-1">
              {meta.favicon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={meta.favicon}
                  alt=""
                  className="w-4 h-4 rounded-sm object-contain flex-shrink-0"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
              {siteName && (
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  {siteName}
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                {title && (
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 leading-snug line-clamp-2">
                    {title}
                  </p>
                )}
                {description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed line-clamp-3">
                    {description}
                  </p>
                )}
              </div>

              {/* Thumbnail */}
              {imageUrl && (
                <div className="w-[72px] h-[72px] flex-shrink-0 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 mr-2">
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
          </div>
        </div>
      </div>

    </div>
  );
}
