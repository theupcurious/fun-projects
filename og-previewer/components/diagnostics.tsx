"use client";

import type { Diagnostic, DiagnosticStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

interface DiagnosticsProps {
  diagnostics: Diagnostic[];
}

const STATUS_CONFIG: Record<
  DiagnosticStatus,
  {
    icon: React.ReactNode;
    label: string;
    badgeClass: string;
    rowClass: string;
  }
> = {
  pass: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    label: "Pass",
    badgeClass: "border-emerald-800 text-emerald-400 bg-emerald-950/40",
    rowClass: "",
  },
  warn: {
    icon: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
    label: "Warning",
    badgeClass: "border-amber-800 text-amber-400 bg-amber-950/40",
    rowClass: "bg-amber-950/10",
  },
  error: {
    icon: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
    label: "Error",
    badgeClass: "border-red-800 text-red-400 bg-red-950/40",
    rowClass: "bg-red-950/10",
  },
  info: {
    icon: <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />,
    label: "Info",
    badgeClass: "border-blue-800 text-blue-400 bg-blue-950/40",
    rowClass: "",
  },
};

const RULE_LABELS: Record<string, string> = {
  share_image_present: "Share image present",
  title_present: "Title present",
  description_present: "Description present",
  image_size_estimate: "Image dimensions",
  title_length_estimate: "Title length",
  description_length_estimate: "Description length",
  twitter_card_type: "Twitter card type",
  image_url_secure: "Image URL security",
  favicon_present: "Favicon present",
};

export function DiagnosticsPanel({ diagnostics }: DiagnosticsProps) {
  const errors = diagnostics.filter((d) => d.status === "error");
  const warnings = diagnostics.filter((d) => d.status === "warn");
  const passes = diagnostics.filter((d) => d.status === "pass");

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-zinc-200">Diagnostics</h2>
          <span className="text-xs text-zinc-400">— heuristics, not authoritative rules</span>
        </div>
        <div className="flex items-center gap-2">
          {errors.length > 0 && (
            <span className="text-xs font-medium text-red-400">
              {errors.length} error{errors.length > 1 ? "s" : ""}
            </span>
          )}
          {warnings.length > 0 && (
            <span className="text-xs font-medium text-amber-400">
              {warnings.length} warning{warnings.length > 1 ? "s" : ""}
            </span>
          )}
          {errors.length === 0 && warnings.length === 0 && (
            <span className="text-xs font-medium text-emerald-400">
              {passes.length} passed
            </span>
          )}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-zinc-700">
        {diagnostics.map((d) => {
          const cfg = STATUS_CONFIG[d.status];
          return (
            <div
              key={d.rule}
              className={`flex items-start gap-3 px-4 py-2.5 ${cfg.rowClass}`}
            >
              <div className="mt-0.5">{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-zinc-200">
                    {RULE_LABELS[d.rule] ?? d.rule}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-4 font-semibold ${cfg.badgeClass}`}
                  >
                    {cfg.label}
                  </Badge>
                </div>
                {d.message && (
                  <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
                    {d.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
