"use client";

import { useCallback, useState, type ComponentType } from "react";
import type { OgResponse } from "@/lib/types";
import { UrlInput } from "@/components/url-input";
import { PreviewGrid } from "@/components/preview-grid";
import { DiagnosticsPanel } from "@/components/diagnostics";
import { MetaTags } from "@/components/meta-tags";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { PreviewDisclaimer } from "@/components/preview-disclaimer";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  FileCode2,
  Image as ImageIcon,
  Link2,
  MonitorSmartphone,
  ScanSearch,
} from "lucide-react";

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

const SURFACES = ["X", "WhatsApp", "Slack"];

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getReadiness(data: OgResponse) {
  const errors = data.diagnostics.filter((d) => d.status === "error").length;
  const warnings = data.diagnostics.filter((d) => d.status === "warn").length;
  const passes = data.diagnostics.filter((d) => d.status === "pass").length;
  const baseScore = Math.round(
    (passes / Math.max(data.diagnostics.length, 1)) * 100
  );
  const score = Math.max(
    0,
    Math.min(100, baseScore - errors * 18 - warnings * 4)
  );
  const hasImage = Boolean(
    data.image?.url ?? data.meta.ogImage ?? data.meta.twitterImage
  );
  const label =
    errors > 0 ? "Needs fixes" : warnings > 0 ? "Review" : "Ready";

  return { errors, warnings, passes, score, hasImage, label };
}

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
        setState({
          phase: "error",
          message: json.error ?? "Something went wrong.",
        });
        return;
      }

      setState({ phase: "success", data: json as OgResponse });
    } catch {
      setState({
        phase: "error",
        message: "Network error. Please check your connection and try again.",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#101216] text-zinc-100">
      <header className="border-b border-white/10 bg-[#101216]/95">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md border border-white/12 bg-white/[0.04]">
              <Link2 className="h-4 w-4 text-sky-200" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">OG Previewer</p>
              <p className="hidden text-[11px] text-zinc-500 sm:block">
                Link QA cockpit
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live fetcher
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6">
        <section className="rounded-lg border border-white/10 bg-[#181b21] p-3 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ScanSearch className="h-4 w-4 text-sky-200" />
                  <h1 className="text-sm font-semibold">Check a share link</h1>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SURFACES.map((surface) => (
                    <span
                      key={surface}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-zinc-400"
                    >
                      {surface}
                    </span>
                  ))}
                </div>
              </div>
              <UrlInput onSubmit={handleSubmit} isLoading={state.phase === "loading"} />
            </div>
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-3">
              <TopMetric label="Rules" value="9" />
              <TopMetric label="Mode" value="Read" />
              <TopMetric label="Tags" value="OG" />
            </div>
          </div>
        </section>

        <section className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 self-start rounded-lg border border-white/10 bg-white p-3 text-zinc-950 shadow-sm sm:p-4">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Preview bench
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-normal sm:text-2xl">
                  See the actual card before it ships.
                </h2>
              </div>
              <StateBadge state={state.phase} />
            </div>

            {state.phase === "idle" && <IdlePreviewBench />}
            {state.phase === "loading" && <LoadingSkeleton />}
            {state.phase === "error" && <ErrorPanel message={state.message} />}
            {state.phase === "success" && <SuccessPreview data={state.data} />}
          </div>

          <aside className="grid gap-4">
            <section className="rounded-lg border border-white/10 bg-[#181b21] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Inspector
              </p>
              <div className="mt-4 space-y-3">
                <InspectorRow
                  icon={MonitorSmartphone}
                  label="Surfaces"
                  value="X, WhatsApp, Slack"
                />
                <InspectorRow
                  icon={ImageIcon}
                  label="Image health"
                  value="Presence, size, protocol"
                />
                <InspectorRow
                  icon={FileCode2}
                  label="Metadata"
                  value="OG, Twitter, canonical"
                />
                <InspectorRow
                  icon={ClipboardList}
                  label="Output"
                  value="Copy exact tag values"
                />
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#f2efe7] p-4 text-zinc-950">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Fast samples
              </p>
              <div className="mt-3 space-y-2">
                {EXAMPLE_URLS.map((url) => (
                  <button
                    key={url}
                    onClick={() => handleSubmit(url)}
                    className="group flex w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-950"
                  >
                    <span className="truncate">
                      {url.replace("https://", "")}
                    </span>
                    <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-zinc-400 group-hover:text-zinc-950" />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

function StateBadge({ state }: { state: State["phase"] }) {
  const label = {
    idle: "Waiting",
    loading: "Fetching",
    success: "Scanned",
    error: "Blocked",
  }[state];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600">
      <CircleDot className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function IdlePreviewBench() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {SURFACES.map((surface, index) => (
        <div
          key={surface}
          className="rounded-lg border border-zinc-200 bg-zinc-50 p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              {surface}
            </span>
            <span className="h-2 w-2 rounded-full bg-zinc-300" />
          </div>
          <div
            className={`h-32 rounded-md border ${
              index === 0
                ? "border-sky-200 bg-sky-50"
                : index === 1
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-amber-200 bg-amber-50"
            }`}
          />
          <div className="mt-3 space-y-2">
            <div className="h-2.5 w-2/3 rounded-full bg-zinc-200" />
            <div className="h-2.5 w-full rounded-full bg-zinc-200" />
            <div className="h-2.5 w-4/5 rounded-full bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SuccessPreview({ data }: { data: OgResponse }) {
  const readiness = getReadiness(data);
  const host = getHost(data.url);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Current scan
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="truncate text-xl font-semibold">{host}</h3>
            <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-xs text-zinc-600">
              {readiness.label}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <ResultMetric label="Score" value={`${readiness.score}%`} />
          <ResultMetric label="Pass" value={String(readiness.passes)} />
          <ResultMetric label="Warn" value={String(readiness.warnings)} />
          <ResultMetric label="Image" value={readiness.hasImage ? "Yes" : "No"} />
        </div>
      </div>

      <PreviewDisclaimer />
      <PreviewGrid data={data} />
      <DiagnosticsPanel diagnostics={data.diagnostics} />
      <MetaTags meta={data.meta} />
    </div>
  );
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white p-2">
      <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        <CheckCircle2 className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-zinc-950">{value}</p>
    </div>
  );
}

function InspectorRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-sky-200" />
      <div>
        <p className="text-xs font-semibold text-zinc-200">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-zinc-500">{value}</p>
      </div>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-4 text-red-950">
      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
      <div>
        <p className="text-sm font-semibold">Unable to fetch this URL</p>
        <p className="mt-1 text-sm text-red-700">{message}</p>
      </div>
    </div>
  );
}
