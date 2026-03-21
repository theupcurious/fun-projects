"use client";

import { useState } from "react";
import type { OgMeta } from "@/lib/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Copy, Check } from "lucide-react";

interface MetaTagsProps {
  meta: OgMeta;
}

type TagEntry = { key: string; value: string };

function buildTagList(meta: OgMeta): TagEntry[] {
  const entries: Array<[string, string | null]> = [
    ["og:title", meta.ogTitle],
    ["og:description", meta.ogDescription],
    ["og:image", meta.ogImage],
    ["og:url", meta.ogUrl],
    ["og:type", meta.ogType],
    ["og:site_name", meta.ogSiteName],
    ["twitter:card", meta.twitterCard],
    ["twitter:title", meta.twitterTitle],
    ["twitter:description", meta.twitterDescription],
    ["twitter:image", meta.twitterImage],
    ["twitter:site", meta.twitterSite],
    ["<title>", meta.title],
    ["description", meta.description],
    ["canonical", meta.canonical],
    ["favicon", meta.favicon],
  ];
  return entries
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([key, value]) => ({ key, value: value as string }));
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleCopy}
      className="text-zinc-600 hover:text-zinc-300 transition-colors flex-shrink-0"
      title="Copy value"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export function MetaTags({ meta }: MetaTagsProps) {
  const [open, setOpen] = useState(false);
  const tags = buildTagList(meta);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-xl border border-zinc-700 bg-zinc-800 overflow-hidden">
        <CollapsibleTrigger className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-700/50 transition-colors">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-200">Meta Tags</h2>
            <span className="text-xs text-zinc-400">
              {tags.length} tag{tags.length !== 1 ? "s" : ""} found
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-zinc-700 divide-y divide-zinc-700">
            {tags.length === 0 ? (
              <p className="px-4 py-3 text-sm text-zinc-500">No meta tags found.</p>
            ) : (
              tags.map(({ key, value }) => (
                <div key={key} className="flex items-start gap-3 px-4 py-2 group">
                  <span className="text-xs font-mono text-indigo-400 flex-shrink-0 w-40 truncate pt-0.5">
                    {key}
                  </span>
                  <span className="text-xs text-zinc-300 flex-1 break-all leading-relaxed">
                    {value}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                    <CopyButton value={value} />
                  </div>
                </div>
              ))
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
