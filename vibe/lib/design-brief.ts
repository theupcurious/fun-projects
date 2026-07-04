import type { DesignBrief, DesignLanguage, PresetId, ProjectType, ToneAxisKey, ToneProfile } from "./types";
import { getPreset } from "./presets";

export const PROJECT_TYPES: {
  id: ProjectType;
  label: string;
  short: string;
  description: string;
}[] = [
  { id: "landing", label: "Landing page", short: "Marketing site", description: "Hero, proof, CTA, and brand-first sections." },
  { id: "dashboard", label: "Dashboard", short: "Data product", description: "Dense navigation, metrics, tables, and repeated workflows." },
  { id: "portfolio", label: "Portfolio", short: "Personal brand", description: "Case studies, biography, work samples, and strong voice." },
  { id: "tool", label: "Creative tool", short: "Interactive app", description: "Controls, live output, focused workspace, and fast iteration." },
  { id: "content", label: "Content site", short: "Reading system", description: "Articles, archives, newsletters, and editorial hierarchy." },
  { id: "commerce", label: "Commerce", short: "Product shop", description: "Product cards, detail surfaces, trust cues, and purchase actions." },
];

export const TONE_AXES: {
  key: ToneAxisKey;
  label: string;
  low: string;
  high: string;
  promptLow: string;
  promptHigh: string;
}[] = [
  { key: "energy", label: "Energy", low: "Calm", high: "Energetic", promptLow: "calm and measured", promptHigh: "high-energy and expressive" },
  { key: "warmth", label: "Temperature", low: "Cool", high: "Warm", promptLow: "cool and precise", promptHigh: "warm and human" },
  { key: "structure", label: "Structure", low: "Expressive", high: "Utilitarian", promptLow: "expressive and art-directed", promptHigh: "structured and task-first" },
  { key: "maturity", label: "Signal", low: "Approachable", high: "Premium", promptLow: "approachable and friendly", promptHigh: "premium and restrained" },
  { key: "density", label: "Density", low: "Airy", high: "Dense", promptLow: "airy with generous negative space", promptHigh: "dense and information-rich" },
];

export const AVOIDANCE_OPTIONS = [
  { id: "ai-saas-default", label: "AI SaaS default", prompt: "generic AI SaaS layouts" },
  { id: "purple-gradients", label: "Purple gradients", prompt: "blue-purple gradient accents" },
  { id: "white-card-grid", label: "White card grids", prompt: "rounded white cards on pale gray backgrounds" },
  { id: "inter-everywhere", label: "Inter everywhere", prompt: "Inter or system fonts as the main personality" },
  { id: "glassmorphism", label: "Glass panels", prompt: "glassmorphism and translucent panels" },
  { id: "beige-minimalism", label: "Beige minimalism", prompt: "safe beige minimalism" },
  { id: "corporate-blue", label: "Corporate blue", prompt: "default corporate blue palettes" },
  { id: "overly-playful", label: "Too playful", prompt: "childish, bubbly, or overly playful styling" },
];

export const DEFAULT_BRIEF: DesignBrief = {
  projectType: "landing",
  tone: {
    energy: 1,
    warmth: 3,
    structure: 1,
    maturity: 3,
    density: 1,
  },
  avoidances: ["ai-saas-default", "purple-gradients", "white-card-grid", "inter-everywhere"],
};

const PRESET_TONE: Partial<Record<PresetId, ToneProfile>> = {
  editorial: { energy: 1, warmth: 3, structure: 1, maturity: 3, density: 1 },
  minimal: { energy: 0, warmth: 1, structure: 3, maturity: 3, density: 0 },
  dashboard: { energy: 1, warmth: 0, structure: 4, maturity: 2, density: 4 },
  corporate: { energy: 1, warmth: 1, structure: 4, maturity: 3, density: 2 },
  saas: { energy: 2, warmth: 1, structure: 3, maturity: 2, density: 1 },
  monochrome: { energy: 0, warmth: 0, structure: 3, maturity: 4, density: 1 },
  playful: { energy: 3, warmth: 4, structure: 1, maturity: 0, density: 1 },
  retro: { energy: 2, warmth: 4, structure: 1, maturity: 2, density: 2 },
  brutalist: { energy: 4, warmth: 0, structure: 2, maturity: 2, density: 3 },
  studio: { energy: 3, warmth: 1, structure: 1, maturity: 3, density: 1 },
  whimsical: { energy: 2, warmth: 4, structure: 0, maturity: 0, density: 1 },
  luxury: { energy: 0, warmth: 3, structure: 2, maturity: 4, density: 0 },
  organic: { energy: 1, warmth: 4, structure: 1, maturity: 2, density: 1 },
  neon: { energy: 4, warmth: 0, structure: 3, maturity: 2, density: 2 },
  candy: { energy: 3, warmth: 3, structure: 1, maturity: 0, density: 1 },
  startup: { energy: 4, warmth: 2, structure: 2, maturity: 1, density: 2 },
  handcraft: { energy: 1, warmth: 4, structure: 1, maturity: 1, density: 1 },
  cyberpunk: { energy: 4, warmth: 0, structure: 3, maturity: 2, density: 3 },
};

export function toneForPreset(presetId: PresetId): ToneProfile {
  return PRESET_TONE[presetId] ?? DEFAULT_BRIEF.tone;
}

export function getBrief(lang: DesignLanguage): DesignBrief {
  const presetTone = lang.presetId ? toneForPreset(lang.presetId) : undefined;
  return {
    ...DEFAULT_BRIEF,
    ...(lang.designBrief ?? {}),
    tone: {
      ...DEFAULT_BRIEF.tone,
      ...(presetTone ?? {}),
      ...(lang.designBrief?.tone ?? {}),
    },
    avoidances: lang.designBrief?.avoidances ?? DEFAULT_BRIEF.avoidances,
  };
}

export function projectLabel(projectType: ProjectType): string {
  return PROJECT_TYPES.find((p) => p.id === projectType)?.label ?? "Landing page";
}

export function avoidanceLabel(id: string): string {
  return AVOIDANCE_OPTIONS.find((a) => a.id === id)?.label ?? id;
}

export function avoidancePrompt(id: string): string {
  return AVOIDANCE_OPTIONS.find((a) => a.id === id)?.prompt ?? id;
}

function axisPhrase(axis: ToneAxisKey, value: number): string {
  const item = TONE_AXES.find((a) => a.key === axis);
  if (!item) return "";
  if (value <= 1) return item.promptLow;
  if (value >= 3) return item.promptHigh;
  return `balanced between ${item.low.toLowerCase()} and ${item.high.toLowerCase()}`;
}

export function describeTone(tone: ToneProfile): string[] {
  return TONE_AXES.map((axis) => axisPhrase(axis.key, tone[axis.key]));
}

export function languageName(lang: DesignLanguage): string {
  const preset = lang.presetId ? getPreset(lang.presetId) : null;
  const brief = getBrief(lang);
  const base = preset?.name ?? "Custom";
  if (brief.tone.structure >= 3 && brief.tone.density >= 3) return `${base} utility`;
  if (brief.tone.maturity >= 3 && brief.tone.energy <= 1) return `${base} restraint`;
  if (brief.tone.energy >= 3 && brief.tone.warmth >= 3) return `${base} spark`;
  if (brief.tone.warmth >= 3) return `${base} warmth`;
  if (brief.tone.energy >= 3) return `${base} charge`;
  return `${base} system`;
}

export function designPillars(lang: DesignLanguage): string[] {
  const brief = getBrief(lang);
  const preset = lang.presetId ? getPreset(lang.presetId) : null;
  const pillars = [
    `${projectLabel(brief.projectType)}-ready layout decisions`,
    preset ? `${preset.name} visual direction` : "Custom visual direction",
    axisPhrase("structure", brief.tone.structure),
    axisPhrase("density", brief.tone.density),
    `${lang.shape.borderRadius <= 4 ? "crisp" : lang.shape.borderRadius >= 14 ? "soft" : "controlled"} component geometry`,
  ];
  return pillars;
}

export interface PreviewContent {
  brand: string;
  nav: string[];
  navCta: string;
  badge: string;
  headline: string;
  subhead: string;
  primaryCta: string;
  secondaryCta: string;
  sectionTitle: string;
  cards: { title: string; body: string }[];
  quote: string;
  quoteBy: string;
  ctaTitle: string;
  ctaBody: string;
  ctaAction: string;
  footerLinks: string[];
}

const PROJECT_CONTENT: Record<ProjectType, PreviewContent> = {
  landing: {
    brand: "Northstar",
    nav: ["Product", "Proof", "Pricing"],
    navCta: "Get started",
    badge: "Launch-ready positioning",
    headline: "A sharper way to explain what you are building",
    subhead: "Turn scattered product ideas into a confident page with a point of view, clear hierarchy, and a visual system that feels intentional.",
    primaryCta: "Start the project",
    secondaryCta: "See examples",
    sectionTitle: "Why it works",
    cards: [
      { title: "Clear promise", body: "The first screen makes the product's value legible before asking for attention." },
      { title: "Proof rhythm", body: "Sections alternate between claims, evidence, and focused calls to action." },
      { title: "Memorable system", body: "Type, color, and components reinforce the same tone across the page." },
    ],
    quote: "A page feels premium when every choice repeats the same argument.",
    quoteBy: "Brand review",
    ctaTitle: "Ready to ship a stronger first impression?",
    ctaBody: "Use the generated language as the brief for your next AI coding session.",
    ctaAction: "Build the page",
    footerLinks: ["Privacy", "Terms", "Contact"],
  },
  dashboard: {
    brand: "PulseOps",
    nav: ["Overview", "Signals", "Reports"],
    navCta: "New report",
    badge: "Live operating view",
    headline: "Know what needs attention before the meeting starts",
    subhead: "A work-focused interface for scanning metrics, comparing changes, and moving from signal to action without visual noise.",
    primaryCta: "Review signals",
    secondaryCta: "Open report",
    sectionTitle: "Operational surface",
    cards: [
      { title: "Priority queue", body: "Dense cards show what changed, why it matters, and who owns the next step." },
      { title: "Fast comparison", body: "Consistent spacing and labels make repeated scanning feel predictable." },
      { title: "Action clarity", body: "Primary actions stay obvious without turning the dashboard into a marketing page." },
    ],
    quote: "The interface should disappear until something needs a decision.",
    quoteBy: "Ops lead",
    ctaTitle: "Turn this language into a usable dashboard",
    ctaBody: "Export the rules and ask your coding tool to apply them to every table, card, and state.",
    ctaAction: "Generate dashboard",
    footerLinks: ["Status", "Docs", "Support"],
  },
  portfolio: {
    brand: "J. Studio",
    nav: ["Work", "Writing", "About"],
    navCta: "Contact",
    badge: "Independent practice",
    headline: "Selected work with a point of view",
    subhead: "A portfolio system that makes the person, the taste, and the quality of thinking visible before the reader opens a case study.",
    primaryCta: "View work",
    secondaryCta: "Read notes",
    sectionTitle: "Portfolio rhythm",
    cards: [
      { title: "Strong entries", body: "Case cards signal topic, role, and outcome without becoming decorative tiles." },
      { title: "Editorial voice", body: "Typography and spacing make the archive feel authored rather than templated." },
      { title: "Personal signal", body: "Small brand details build memory without overpowering the work." },
    ],
    quote: "Taste shows up in what you leave out.",
    quoteBy: "Portfolio note",
    ctaTitle: "Shape a portfolio people remember",
    ctaBody: "Use the prompt to keep future sections consistent with the same visual voice.",
    ctaAction: "Draft the system",
    footerLinks: ["Email", "LinkedIn", "Archive"],
  },
  tool: {
    brand: "CanvasKit",
    nav: ["Create", "Library", "Settings"],
    navCta: "Export",
    badge: "Focused workspace",
    headline: "A creative tool that keeps decisions close to the output",
    subhead: "Controls, preview, and export live in one focused surface so users can experiment quickly without losing confidence.",
    primaryCta: "Try controls",
    secondaryCta: "Open library",
    sectionTitle: "Tooling patterns",
    cards: [
      { title: "Direct feedback", body: "Every adjustment visibly changes the output so users learn the system by doing." },
      { title: "Stable controls", body: "Inputs, tabs, and toggles keep dimensions fixed to avoid layout jumps." },
      { title: "Export confidence", body: "The final artifact explains what changed and how to reuse it." },
    ],
    quote: "Good tools make the next decision feel smaller.",
    quoteBy: "Product designer",
    ctaTitle: "Turn taste into a working control surface",
    ctaBody: "Export rules that describe both the interface and the generated output.",
    ctaAction: "Copy tool brief",
    footerLinks: ["Shortcuts", "Changelog", "Feedback"],
  },
  content: {
    brand: "Fieldnotes",
    nav: ["Essays", "Briefs", "Archive"],
    navCta: "Subscribe",
    badge: "Reading-first system",
    headline: "A publication that feels edited before it feels designed",
    subhead: "A content language for long-form reading, strong archives, and subscription moments that respect attention.",
    primaryCta: "Read latest",
    secondaryCta: "Browse archive",
    sectionTitle: "Editorial building blocks",
    cards: [
      { title: "Readable hierarchy", body: "Headings, decks, bylines, and captions have clear jobs and consistent spacing." },
      { title: "Archive memory", body: "Lists and cards help readers compare topics without losing editorial tone." },
      { title: "Quiet conversion", body: "Subscription modules feel native to the reading system." },
    ],
    quote: "The layout should make the argument easier to finish.",
    quoteBy: "Editor note",
    ctaTitle: "Create a publication language",
    ctaBody: "Use the prompt to keep articles, archives, and signup surfaces in the same voice.",
    ctaAction: "Write the brief",
    footerLinks: ["RSS", "Archive", "About"],
  },
  commerce: {
    brand: "Object Room",
    nav: ["Shop", "Journal", "Stores"],
    navCta: "Cart",
    badge: "Product-first storefront",
    headline: "Products that feel considered before they feel sold",
    subhead: "A commerce system for browsing, comparing, and buying with strong material cues and restrained persuasion.",
    primaryCta: "Shop new arrivals",
    secondaryCta: "View story",
    sectionTitle: "Storefront patterns",
    cards: [
      { title: "Material signal", body: "Color, type, and surfaces should make product quality feel tangible." },
      { title: "Calm purchase path", body: "CTAs are clear without making every product card shout." },
      { title: "Trust details", body: "Shipping, sizing, and return cues are integrated into the visual system." },
    ],
    quote: "A good store lets the object carry the drama.",
    quoteBy: "Retail director",
    ctaTitle: "Design a storefront with restraint",
    ctaBody: "Export a prompt that keeps product pages, cards, and checkout surfaces aligned.",
    ctaAction: "Build storefront",
    footerLinks: ["Shipping", "Returns", "Care"],
  },
};

export function previewContent(lang: DesignLanguage): PreviewContent {
  return PROJECT_CONTENT[getBrief(lang).projectType];
}
