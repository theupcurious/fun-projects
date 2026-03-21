export interface OgMeta {
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogSiteName: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  twitterSite: string | null;
  favicon: string | null;
  canonical: string | null;
}

export interface ImageProbe {
  width: number;
  height: number;
  type: string;
  url: string;
}

export type DiagnosticStatus = "pass" | "warn" | "error" | "info";

export interface Diagnostic {
  rule: string;
  status: DiagnosticStatus;
  message?: string;
  value?: string | number;
  confidence: "heuristic" | "definitive";
}

export interface OgResponse {
  url: string;
  meta: OgMeta;
  image: ImageProbe | null;
  diagnostics: Diagnostic[];
  notes: string[];
}

export interface OgRequest {
  url: string;
}
