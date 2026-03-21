"use client";

import type { OgMeta } from "@/lib/types";

interface WhatsAppCardProps {
  meta: OgMeta;
  imageUrl: string | null;
}

function truncate(str: string | null | undefined, len: number): string {
  if (!str) return "";
  return str.length > len ? str.slice(0, len - 1) + "…" : str;
}

export function WhatsAppCard({ meta, imageUrl }: WhatsAppCardProps) {
  const title = truncate(meta.ogTitle ?? meta.twitterTitle ?? meta.title, 100);
  const description = truncate(
    meta.ogDescription ?? meta.twitterDescription ?? meta.description,
    160
  );

  let domain = "";
  try {
    domain = new URL(meta.ogUrl ?? meta.canonical ?? "https://example.com")
      .hostname.replace(/^www\./, "");
  } catch {
    domain = "example.com";
  }

  return (
    <div className="flex flex-col">
      <div className="text-xs font-semibold text-zinc-500 mb-2 tracking-wide uppercase">
        WhatsApp
      </div>

      {/* Simulate a WhatsApp chat bubble with a link preview inside */}
      <div className="max-w-[320px]">
        {/* Outer bubble — received message style (white) */}
        <div className="bg-white dark:bg-[#1f2c34] rounded-[7.5px] rounded-tl-none shadow-sm overflow-hidden border border-zinc-200 dark:border-zinc-700 relative">
          {/* Green left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#25D366]" />

          <div className="pl-3">
            {/* Image */}
            {imageUrl ? (
              <div className="relative w-full aspect-[1.91/1] bg-zinc-100 dark:bg-zinc-800 -ml-3 w-[calc(100%+0.75rem)]">
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
            ) : null}

            {/* Text content */}
            <div className="px-2 pt-2 pb-2">
              {title && (
                <p className="text-sm font-semibold text-zinc-900 dark:text-[#e9edef] leading-snug">
                  {title}
                </p>
              )}
              {description && (
                <p className="text-xs text-zinc-500 dark:text-[#8696a0] mt-0.5 leading-snug line-clamp-2">
                  {description}
                </p>
              )}
              <p className="text-[10px] text-[#25D366] dark:text-[#25D366] mt-1 font-medium truncate">
                {domain}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp + tick — WhatsApp UI detail */}
        <div className="flex justify-end mt-0.5 pr-1">
          <span className="text-[10px] text-zinc-400">12:34 ✓✓</span>
        </div>
      </div>

    </div>
  );
}
