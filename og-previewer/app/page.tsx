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
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FileCode2,
  Image as ImageIcon,
  Link2,
  MonitorSmartphone,
  ScanSearch,
  ShieldCheck,
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
    <div className="min-h-screen bg-[#f4f1ea] text-zinc-950">
      <header className="border-b border-zinc-950/10 bg-[#f8f6f0]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md border border-zinc-950/15 bg-white">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">OG Previewer</p>
              <p className="hidden text-[11px] text-zinc-500 sm:block">
                Metadata inspection desk
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-zinc-950/10 bg-white px-3 py-1 text-xs text-zinc-600 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live scanner
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-3 py-4 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:py-5">
        <aside className="space-y-4">
          <section className="rounded-md border border-zinc-950/12 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ScanSearch className="h-4 w-4" />
              <h1 className="text-sm font-semibold">Scan a public URL</h1>
            </div>
            <UrlInput onSubmit={handleSubmit} isLoading={state.phase === "loading"} />
          </section>

          <section className="rounded-md border border-zinc-950/12 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Fast samples
            </p>
            <div className="mt-3 space-y-2">
              {EXAMPLE_URLS.map((url) => (
                <button
                  key={url}
                  onClick={() => handleSubmit(url)}
                  className="group flex w-full items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-left text-sm text-zinc-700 transition-colors hover:border-zinc-950/25 hover:bg-white hover:text-zinc-950"
                >
                  <span className="truncate">{url.replace("https://", "")}</span>
                  <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-zinc-400 group-hover:text-zinc-950" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-zinc-950/12 bg-zinc-950 p-4 text-white shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              What it checks
            </p>
            <div className="mt-4 grid gap-3">
              <SideFact icon={MonitorSmartphone} label="Surfaces" value="X, chat, team unfurls" />
              <SideFact icon={ImageIcon} label="Media" value="Image presence, size, protocol" />
              <SideFact icon={FileCode2} label="Tags" value="OG, Twitter, canonical, favicon" />
            </div>
          </section>
        </aside>

        <section className="min-w-0 space-y-5">
          <div className="rounded-md border border-zinc-950/12 bg-white shadow-sm">
            <div className="grid border-b border-zinc-950/10 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 p-4 sm:p-5 lg:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-2 lg:mb-8">
                  {SURFACES.map((surface) => (
                    <span
                      key={surface}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600"
                    >
                      {surface}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Share readiness console
                </p>
                <h2 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight tracking-normal text-zinc-950 sm:text-3xl lg:text-5xl">
                  Find broken social cards before your launch link goes out.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                  A focused inspector for the practical parts of link sharing:
                  preview cards, extracted metadata, image health, and the
                  warnings that usually cause messy unfurls.
                </p>
              </div>
              <div className="border-t border-zinc-950/10 bg-[#fbfaf6] p-4 lg:border-l lg:border-t-0 lg:p-5">
                <div className="grid gap-3">
                  <Metric icon={BarChart3} label="Checks" value="9" detail="Heuristic rules" />
                  <Metric icon={ShieldCheck} label="Mode" value="Read-only" detail="No page changes" />
                  <Metric icon={ClipboardList} label="Output" value="Tags" detail="Copy exact values" />
                </div>
              </div>
            </div>

            {state.phase === "idle" && <IdleWorkbench />}
            {state.phase === "loading" && (
              <div className="p-4 sm:p-5">
                <LoadingSkeleton />
              </div>
            )}
            {state.phase === "error" && <ErrorPanel message={state.message} />}
            {state.phase === "success" && <Results data={state.data} />}
          </div>
        </section>
      </main>
    </div>
  );
}

function SideFact({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-400" />
      <div>
        <p className="text-xs font-semibold text-zinc-200">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-zinc-400">{value}</p>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-md border border-zinc-950/10 bg-white p-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{detail}</p>
    </div>
  );
}

function IdleWorkbench() {
  return (
    <div className="grid gap-0 border-t border-zinc-950/10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Preview bench</p>
            <p className="text-xs text-zinc-500">Waiting for a URL scan</p>
          </div>
          <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-500">
            Idle
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {SURFACES.map((surface) => (
            <div
              key={surface}
              className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  {surface}
                </span>
                <span className="h-2 w-2 rounded-full bg-zinc-300" />
              </div>
              <div className="space-y-2">
                <div className="h-24 rounded-sm bg-zinc-200" />
                <div className="h-2.5 w-2/3 rounded-full bg-zinc-200" />
                <div className="h-2.5 w-full rounded-full bg-zinc-200" />
                <div className="h-2.5 w-4/5 rounded-full bg-zinc-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-zinc-950/10 bg-[#fbfaf6] p-4 lg:border-l lg:border-t-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
          Run order
        </p>
        <ol className="mt-4 space-y-3 text-sm text-zinc-700">
          <li className="flex gap-3">
            <span className="font-mono text-xs text-zinc-400">01</span>
            Fetch page HTML
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-zinc-400">02</span>
            Extract social tags
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-zinc-400">03</span>
            Probe image health
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-xs text-zinc-400">04</span>
            Render platform cards
          </li>
        </ol>
      </div>
    </div>
  );
}

function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="border-t border-zinc-950/10 p-5">
      <div className="flex max-w-3xl items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-4 text-red-950">
        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
        <div>
          <p className="text-sm font-semibold">Unable to fetch this URL</p>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}

function Results({ data }: { data: OgResponse }) {
  const readiness = getReadiness(data);
  const host = getHost(data.url);

  return (
    <div className="space-y-5 border-t border-zinc-950/10 p-4 sm:p-5">
      <div className="rounded-md border border-zinc-950/10 bg-[#fbfaf6] p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_520px]">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Current scan
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h3 className="truncate text-2xl font-semibold text-zinc-950">
                {host}
              </h3>
              <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600">
                {readiness.label}
              </span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            <ResultMetric label="Score" value={`${readiness.score}%`} />
            <ResultMetric label="Pass" value={String(readiness.passes)} />
            <ResultMetric label="Warn" value={String(readiness.warnings)} />
            <ResultMetric
              label="Image"
              value={readiness.hasImage ? "Yes" : "No"}
            />
          </div>
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
    <div className="rounded-md border border-zinc-950/10 bg-white p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-lg font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
