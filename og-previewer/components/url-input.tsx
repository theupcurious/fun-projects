"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

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
    setHistory(loadHistory());
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
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste any public URL…"
            className="pl-10 pr-4 h-12 text-base bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500 transition-all"
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
            suppressHydrationWarning
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors disabled:opacity-40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Fetching…
            </span>
          ) : (
            "Preview"
          )}
        </Button>
      </form>

      {/* Recent history pills */}
      {history.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-600 font-medium mr-0.5">Recent:</span>
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
                className="text-xs px-2 py-0.5 rounded-full bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:text-white transition-colors truncate max-w-[160px]"
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={clearHistory}
            className="text-xs text-zinc-500 hover:text-zinc-300 ml-1 flex items-center gap-0.5 transition-colors"
            title="Clear history"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
