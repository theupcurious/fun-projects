"use client";

import { useState, useCallback } from "react";
import type { OgResponse } from "@/lib/types";
import { UrlInput } from "@/components/url-input";
import { PreviewGrid } from "@/components/preview-grid";
import { DiagnosticsPanel } from "@/components/diagnostics";
import { MetaTags } from "@/components/meta-tags";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { PreviewDisclaimer } from "@/components/preview-disclaimer";
import { AlertCircle, Link2 } from "lucide-react";

type State =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; data: OgResponse }
  | { phase: "error"; message: string };

const EXAMPLE_URLS = [
  "https://vercel.com/blog",
  "https://github.com/vercel/next.js",
  "https://tailwindcss.com",
];

export default function Home() {
  const [state, setState] = useState<State>({ phase: "idle" });

  const handleSubmit = useCallback(async (url: string) => {
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (!res.ok) {
        setState({ phase: "error", message: json.error ?? "Something went wrong." });
        return;
      }

      setState({ phase: "success", data: json as OgResponse });
    } catch {
      setState({ phase: "error", message: "Network error. Please check your connection and try again." });
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white tracking-tight text-sm">
              OG Previewer
            </span>
          </div>
          <span className="text-xs text-zinc-400 hidden sm:block">by Upcurious</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 space-y-10">
        {/* Hero — input as focal point */}
        <div className="flex flex-col items-center gap-5 pt-4">
          <p className="text-base text-zinc-200 text-center">
            See how your link looks on X, WhatsApp, and Slack
          </p>
          <UrlInput onSubmit={handleSubmit} isLoading={state.phase === "loading"} />
        </div>

        {/* Idle state */}
        {state.phase === "idle" && (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap gap-2 justify-center items-center">
              <span className="text-xs text-zinc-400">Try:</span>
              {EXAMPLE_URLS.map((url) => (
                <button
                  key={url}
                  onClick={() => handleSubmit(url)}
                  className="text-xs px-3 py-1.5 rounded-full border border-zinc-600 text-zinc-300 hover:border-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {url.replace("https://", "")}
                </button>
              ))}
            </div>

            {/* Ghost card placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2 pointer-events-none select-none">
              {["X (Twitter)", "WhatsApp", "Slack"].map((platform) => (
                <div key={platform} className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-semibold text-zinc-500 tracking-widest uppercase px-1">
                    {platform}
                  </span>
                  <div className="rounded-2xl border-2 border-dashed border-zinc-700 h-44 flex items-center justify-center bg-zinc-800/30">
                    <span className="text-sm text-zinc-600">paste a URL above</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {state.phase === "loading" && <LoadingSkeleton />}

        {/* Error */}
        {state.phase === "error" && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-700/60 bg-red-950/40 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-semibold text-sm text-red-300">Unable to fetch this URL</p>
              <p className="text-sm mt-0.5 text-red-400">{state.message}</p>
            </div>
          </div>
        )}

        {/* Success */}
        {state.phase === "success" && (
          <div className="space-y-8">
            <PreviewDisclaimer />
            <PreviewGrid data={state.data} />
            <DiagnosticsPanel diagnostics={state.data.diagnostics} />
            <MetaTags meta={state.data.meta} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-700 py-4 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-xs text-zinc-400 flex items-center justify-between flex-wrap gap-2">
          <span>OG Previewer by Upcurious</span>
          <span>Previews only — actual rendering may differ</span>
        </div>
      </footer>
    </div>
  );
}
