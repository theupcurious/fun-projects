"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock3, Search, X } from "lucide-react";

const HISTORY_KEY = "og-previewer-history";
const MAX_HISTORY = 10;

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveHistory(url: string) {
  const existing = loadHistory().filter((u) => u !== url);
  const updated = [url, ...existing].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export function UrlInput({ onSubmit, isLoading }: UrlInputProps) {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setHistory(loadHistory());
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    const url = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    saveHistory(url);
    setHistory(loadHistory());
    onSubmit(url);
  }

  function handleHistoryClick(url: string) {
    setValue(url);
    onSubmit(url);
    inputRef.current?.focus();
  }

  function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }

  return (
    <div className="min-w-0 w-full max-w-full">
      <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-2 lg:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste any public URL..."
            className="h-11 rounded-md border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-950 shadow-none placeholder:text-zinc-400 focus-visible:border-zinc-950 focus-visible:ring-2 focus-visible:ring-zinc-950/10 focus-visible:ring-offset-0"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            suppressHydrationWarning
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="h-11 rounded-md bg-zinc-950 px-4 font-semibold text-white shadow-none transition-colors hover:bg-zinc-800 disabled:opacity-40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
              Fetching...
            </span>
          ) : (
            <>
              Preview
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Recent history pills */}
      {history.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1 text-xs font-medium text-zinc-500">
            <Clock3 className="h-3.5 w-3.5" />
            Recent
          </span>
          {history.map((url) => {
            let label = url;
            try {
              label = new URL(url).hostname.replace(/^www\./, "");
            } catch {/* keep raw */}
            return (
              <button
                key={url}
                onClick={() => handleHistoryClick(url)}
                title={url}
                className="max-w-[170px] truncate rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-950"
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={clearHistory}
            className="ml-1 flex items-center gap-0.5 text-xs text-zinc-500 transition-colors hover:text-zinc-950"
            title="Clear history"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
