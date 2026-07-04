"use client";

import type { DesignLanguage } from "@/lib/types";
import { AVOIDANCE_OPTIONS, avoidanceLabel, designPillars, getBrief, languageName, projectLabel } from "@/lib/design-brief";

export function LanguageSummary({ lang }: { lang: DesignLanguage }) {
  const brief = getBrief(lang);
  const pillars = designPillars(lang).slice(0, 4);
  const avoidances = brief.avoidances.length > 0
    ? brief.avoidances.slice(0, 4).map(avoidanceLabel)
    : AVOIDANCE_OPTIONS.slice(0, 2).map((a) => a.label);

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/35">
            Your design language
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {languageName(lang)}
          </div>
        </div>
        <div className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/50">
          {projectLabel(brief.projectType)}
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-white/30">Pillars</div>
          <ul className="space-y-1">
            {pillars.map((pillar) => (
              <li key={pillar} className="text-[11px] leading-snug text-white/65">
                {pillar}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1 text-[10px] uppercase tracking-wider text-white/30">Avoid</div>
          <div className="flex flex-wrap gap-1">
            {avoidances.map((avoidance) => (
              <span
                key={avoidance}
                className="rounded border border-white/10 bg-black/20 px-1.5 py-0.5 text-[10px] text-white/50"
              >
                {avoidance}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
