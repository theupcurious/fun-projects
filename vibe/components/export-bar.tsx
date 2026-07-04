"use client";

import { useState, useMemo } from "react";
import type { DesignLanguage, PromptFormat } from "@/lib/types";
import { generatePrompt } from "@/lib/prompt-generator";
import { getShareUrl } from "@/lib/url-state";
import { cn } from "@/lib/utils";

interface ExportBarProps {
  lang: DesignLanguage;
  onReset: () => void;
}

const FORMAT_OPTIONS: { value: PromptFormat; label: string; hint: string }[] = [
  { value: "markdown", label: "Markdown", hint: "Claude, ChatGPT" },
  { value: "system", label: "System prompt", hint: "API / system role" },
  { value: "cursorrules", label: "Cursor rules", hint: ".cursorrules file" },
];

type CopyState = "idle" | "copied-prompt" | "copied-url" | "failed";

export function ExportBar({ lang, onReset }: ExportBarProps) {
  const [format, setFormat] = useState<PromptFormat>("markdown");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [showPrompt, setShowPrompt] = useState(false);

  const promptText = useMemo(() => generatePrompt(lang, format), [lang, format]);

  async function copyToClipboard(text: string, kind: "prompt" | "url") {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        setCopyState("failed");
        setTimeout(() => setCopyState("idle"), 2000);
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopyState(kind === "prompt" ? "copied-prompt" : "copied-url");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  async function copyPrompt() {
    await copyToClipboard(promptText, "prompt");
  }

  async function copyShareUrl() {
    const url = getShareUrl(lang);
    await copyToClipboard(url, "url");
  }

  function downloadAsFile() {
    const text = generatePrompt(lang, "cursorrules");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".cursorrules";
    a.click();
    URL.revokeObjectURL(url);
  }

  const promptCopied = copyState === "copied-prompt";
  const urlCopied = copyState === "copied-url";
  const failed = copyState === "failed";

  return (
    <div className="flex flex-col border-t border-white/10 bg-[#0d0d0d]">
      {/* Prompt preview panel */}
      {showPrompt && (
        <div className="fixed inset-0 z-50 flex flex-col border-b border-white/10 bg-[#111111] sm:relative sm:inset-auto sm:z-auto">
          <div className="flex shrink-0 items-center justify-between border-b border-white/5 px-4 py-3 sm:py-2">
            <div className="text-[11px] uppercase tracking-wider text-white/40">
              Generated prompt
              <span className="ml-2 hidden text-white/20 sm:inline">
                — paste into Cursor, Claude, or ChatGPT
              </span>
            </div>
            <button
              onClick={() => setShowPrompt(false)}
              className="rounded-md p-2 text-white/35 transition-colors hover:bg-white/5 hover:text-white/70"
              aria-label="Close prompt preview"
            >
              <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
                <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:max-h-64 sm:flex-none">
            <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-white/70">
              {promptText}
            </pre>
          </div>
          <div className="flex shrink-0 items-center gap-2 border-t border-white/5 px-4 py-3 sm:py-2">
            <button
              onClick={copyPrompt}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-all",
                promptCopied
                  ? "bg-green-500/20 text-green-400"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              )}
            >
              {promptCopied ? "✓ Copied" : "Copy to clipboard"}
            </button>
            <span className="text-[10px] text-white/20">
              {promptText.length} chars
            </span>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Format selector with visible hints */}
        <div className="flex items-center gap-1">
          {FORMAT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={cn(
                "flex flex-col items-center rounded-md px-2.5 py-1.5 transition-colors",
                format === opt.value
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              <span className="text-xs">{opt.label}</span>
              <span className={cn(
                "text-[9px] leading-tight",
                format === opt.value ? "text-white/40" : "text-white/20"
              )}>
                {opt.hint}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
          >
            Reset
          </button>

          {/* Share */}
          <button
            onClick={copyShareUrl}
            className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white/80"
          >
            {urlCopied ? "✓ Copied!" : "Share link"}
          </button>

          {format === "cursorrules" && (
            <button
              onClick={downloadAsFile}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white/80"
            >
              Download .cursorrules
            </button>
          )}

          {/* Show prompt */}
          <button
            onClick={() => setShowPrompt((p) => !p)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs transition-colors",
              showPrompt
                ? "border-white/30 bg-white/10 text-white"
                : "border-white/10 text-white/60 hover:border-white/25 hover:text-white/80"
            )}
          >
            {showPrompt ? "Hide prompt" : "Show prompt"}
          </button>

          {/* Copy prompt */}
          <button
            onClick={copyPrompt}
            className={cn(
              "relative flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-150",
              promptCopied
                ? "bg-green-500/20 text-green-400"
                : failed
                ? "bg-red-500/20 text-red-400"
                : "bg-white text-black hover:bg-white/90"
            )}
          >
            {promptCopied ? (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied!
              </>
            ) : failed ? (
              "Copy failed"
            ) : (
              <>
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Copy prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
