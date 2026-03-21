"use client";

import type { OgResponse } from "@/lib/types";
import { XCard } from "@/components/cards/x-card";
import { WhatsAppCard } from "@/components/cards/whatsapp-card";
import { SlackCard } from "@/components/cards/slack-card";

interface PreviewGridProps {
  data: OgResponse;
}

const PLATFORMS = [
  { key: "x", label: "X (Twitter)", Card: XCard },
  { key: "whatsapp", label: "WhatsApp", Card: WhatsAppCard },
  { key: "slack", label: "Slack", Card: SlackCard },
] as const;

export function PreviewGrid({ data }: PreviewGridProps) {
  const imageUrl = data.image?.url ?? data.meta.ogImage ?? data.meta.twitterImage ?? null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PLATFORMS.map(({ key, label, Card }) => (
        <div key={key} className="flex flex-col gap-2.5">
          <span className="text-[11px] font-semibold text-zinc-500 tracking-widest uppercase px-1">
            {label}
          </span>
          <div className="rounded-2xl ring-1 ring-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            <Card meta={data.meta} imageUrl={imageUrl} />
          </div>
        </div>
      ))}
    </div>
  );
}
