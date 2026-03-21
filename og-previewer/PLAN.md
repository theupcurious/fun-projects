# OG Previewer — Social Card Preview Tool

**Date:** 2026-03-20
**Status:** Plan
**Purpose:** Portfolio showcase for Upcurious — demonstrates API integration, product thinking, and polished frontend craft.
**Product stance:** Visually polished approximation tool. The goal is to give a strong, familiar preview of how a link will likely read on major platforms, not to guarantee pixel-perfect parity with live platform renderers.
**Deploy target:** Vercel or another server-capable host

---

## Concept

Paste any public URL and instantly see a polished approximation of how it may appear when shared on X, LinkedIn, and Slack. The tool fetches the page metadata server-side, renders familiar platform-style cards, and highlights likely issues such as missing tags or weak image metadata.

The value proposition is practical and easy to understand:

- one input
- three recognizable previews
- useful metadata inspection
- lightweight diagnostics

This is not a compliance validator and should not claim to exactly emulate the platforms.

---

## Product Scope

### MVP goal

Ship a single-page tool that:

- accepts one URL at a time
- fetches public metadata safely on the server
- renders three visually similar platform-style previews
- shows extracted tags and heuristic diagnostics
- feels fast and polished enough to stand alone in a portfolio

### Explicit non-goals for v1

- exact reproduction of live X, LinkedIn, or Slack rendering behavior
- guaranteed truncation parity with each platform
- public API productization
- support for authenticated pages
- browser execution or JS-rendered scraping for SPA-only sites

---

## Core Features

### 1. URL input + preview

- Single prominent input field
- Paste or type a URL -> press Enter or click "Preview"
- Server fetches the page HTML to avoid browser CORS issues
- Renders three platform-style preview cards:

| Platform | Rendering goal | Key fields |
|----------|----------------|------------|
| **X** | recognizable summary card approximation | `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site` |
| **LinkedIn** | recognizable link preview approximation | `og:title`, `og:description`, `og:image`, `og:url`, domain |
| **Slack** | recognizable unfurl approximation | `og:title`, `og:description`, `og:image`, `og:site_name`, favicon |

### 2. Tag inspector

- Expandable panel below the previews showing extracted tags
- Raw tag list includes `og:*`, `twitter:*`, standard description/title, canonical URL, and favicon
- Each tag shows the normalized value plus the original source node when available

### 3. Diagnostics panel

Diagnostics are explicitly labeled as **heuristics**, not authoritative platform rules.

| Check | Condition | Severity |
|-------|-----------|----------|
| Missing share image | No `og:image` and no `twitter:image` | Error |
| Missing title | No `og:title`, no `twitter:title`, and no `<title>` | Error |
| Missing description | No `og:description` and no standard description | Warning |
| Image likely too small | image dimensions below common large-card targets | Warning |
| Title likely too long | title exceeds conservative display threshold | Warning |
| Description likely too long | description exceeds conservative display threshold | Warning |
| Missing Twitter card type | no `twitter:card` tag | Warning |
| Insecure image URL | image uses `http://` | Warning |
| Missing favicon | no icon found | Info |

### 4. History (local)

- Recent URLs stored in localStorage (last 10)
- Clickable pills below the input for quick re-check

---

## Accuracy Model

### What "similar enough" means

The previews should be:

- visually familiar at a glance
- structurally aligned with the real card family
- close in spacing, hierarchy, border treatment, and image ratio
- honest about where behavior is estimated

### What the UI should say

Use explicit language in the interface such as:

- "Approximate preview"
- "Heuristic diagnostics"
- "Actual platform rendering may differ"

### Validation approach

- Collect a small reference set of real shared URLs and screenshots
- Match high-level composition first: image ratio, padding, title hierarchy, metadata placement
- Accept "very similar" instead of chasing pixel-perfect parity
- Snapshot the three card components locally so visual regressions are caught during iteration

---

## Screens & UI

### Layout

Single page, vertically stacked:

```text
┌─────────────────────────────────────────────┐
│  OG Previewer          by Upcurious      │
├─────────────────────────────────────────────┤
│                                             │
│   [ Paste any URL...              ] [Go]    │
│                                             │
│   Recent: example.com | blog.dev | ...      │
│                                             │
├───────────┬───────────┬─────────────────────┤
│   X-ish   │ LinkedIn  │  Slack-style        │
│   Card    │   Card    │  Card               │
│  (approx) │ (approx)  │ (approx)            │
├───────────┴───────────┴─────────────────────┤
│  Diagnostics     5 passed  2 warnings       │
│  Likely issues, not exact platform rules    │
├─────────────────────────────────────────────┤
│  Meta Tags (expandable)                     │
│  og:title = "..."                           │
│  og:description = "..."                     │
│  og:image = "..."                           │
│  ...                                        │
└─────────────────────────────────────────────┘
```

### Social card mockups

Each card should look convincingly close to the real platform family without claiming exact parity.

**X-style card:**

- large image treatment based on the detected card type
- title, description, and domain hierarchy close to the familiar X summary card
- subdued border and rounded corners

**LinkedIn-style card:**

- large image on top with a light card body
- title + domain treatment similar to a LinkedIn link share
- restrained neutral styling

**Slack-style card:**

- left accent bar
- site name + favicon
- title emphasis and description body
- thumbnail placement that reads like a Slack unfurl

---

## Tech Stack

| Layer        | Choice                          | Why                                      |
|--------------|----------------------------------|------------------------------------------|
| Framework    | Next.js 15 (App Router)          | Server route for metadata fetch + polished UI |
| Styling      | Tailwind CSS                     | Fast iteration, matches stack            |
| Components   | shadcn/ui (input, card, badge, collapsible) | Good primitives for the shell UI |
| Icons        | Lucide React                     | Simple status/icon set                   |
| HTML parsing | cheerio                          | Reliable metadata extraction             |
| Image probe  | probe-image-size                 | Inspect OG image size without full download |
| Validation   | Zod                              | Request/response shaping and safer parsing |
| Deploy       | Vercel                           | Straightforward server deployment        |

### Fonts

- Display: **Plus Jakarta Sans**
- Body: **DM Sans**

---

## API Design

### `POST /api/og`

**Request:**

```json
{ "url": "https://example.com/blog/my-post" }
```

**Response:**

```json
{
  "url": "https://example.com/blog/my-post",
  "meta": {
    "title": "My Blog Post",
    "description": "A short description of the post...",
    "ogTitle": "My Blog Post — Example Blog",
    "ogDescription": "A short description...",
    "ogImage": "https://example.com/images/og.png",
    "ogUrl": "https://example.com/blog/my-post",
    "ogType": "article",
    "ogSiteName": "Example Blog",
    "twitterCard": "summary_large_image",
    "twitterTitle": "My Blog Post",
    "twitterDescription": "A short description...",
    "twitterImage": "https://example.com/images/og.png",
    "twitterSite": "@example",
    "favicon": "https://example.com/favicon.ico"
  },
  "image": {
    "width": 1200,
    "height": 630,
    "type": "png",
    "url": "https://example.com/images/og.png"
  },
  "diagnostics": [
    {
      "rule": "share_image_present",
      "status": "pass"
    },
    {
      "rule": "title_length_estimate",
      "status": "warn",
      "message": "Title is likely long for some social cards",
      "value": 73,
      "confidence": "heuristic"
    }
  ],
  "notes": [
    "Previews are approximate and may differ from live platform rendering"
  ]
}
```

### Server-side logic

1. Validate and normalize the URL
2. Resolve the hostname and reject private, loopback, link-local, reserved, and otherwise non-public IP targets for both IPv4 and IPv6
3. Fetch the page with a browser-like User-Agent, with redirect limits and per-hop validation
4. Read only enough HTML for the head and stop at a safe size cap
5. Parse metadata with cheerio
6. Probe share image dimensions if an image URL exists
7. Run heuristic diagnostics
8. Return normalized metadata plus explicit approximation notes

### Security considerations

- Rate limit requests per IP
- Reject non-HTTP(S) schemes
- Reject local/private/reserved destinations for IPv4 and IPv6
- Re-validate every redirect hop before following it
- Disable or tightly limit redirects
- Enforce a short timeout
- Enforce a max HTML size
- Do not expose arbitrary fetch details back to the client
- Keep the route internal to the app for v1 rather than marketing it as a public API

---

## File Structure

```text
apps/og-previewer/
├── app/
│   ├── layout.tsx              # Root layout, fonts, meta tags
│   ├── page.tsx                # Main page (input + previews + diagnostics)
│   └── api/
│       └── og/
│           └── route.ts        # POST handler — fetch URL, parse meta, return data
├── components/
│   ├── url-input.tsx           # URL input with recent history
│   ├── preview-grid.tsx        # Container for the three preview cards
│   ├── cards/
│   │   ├── x-card.tsx          # X-style approximation card
│   │   ├── linkedin-card.tsx   # LinkedIn-style approximation card
│   │   └── slack-card.tsx      # Slack-style approximation card
│   ├── diagnostics.tsx         # Heuristic results with pass/warn/error badges
│   ├── meta-tags.tsx           # Expandable raw meta tag inspector
│   ├── preview-disclaimer.tsx  # Approximation / heuristic language
│   └── loading-skeleton.tsx    # Skeleton UI while fetching
├── lib/
│   ├── parse-meta.ts           # Metadata extraction
│   ├── diagnostics.ts          # Heuristic rule engine
│   ├── validate-url.ts         # URL validation + SSRF protection
│   ├── fetch-meta.ts           # Safe fetch wrapper with redirect checks
│   └── types.ts                # Shared TypeScript types
├── public/
│   └── og-image.png            # OG image for the tool itself
├── package.json
├── tailwind.config.ts
├── next.config.ts
└── PLAN.md
```

---

## Implementation Steps

### Phase 1: Safe metadata pipeline (2-3 hours)

1. **Scaffold** — `npx create-next-app` with TypeScript + Tailwind + App Router
2. **`validate-url.ts`** — normalize input, reject non-public targets, support redirect-hop validation
3. **`fetch-meta.ts`** — safe fetch wrapper with timeout, size cap, and browser-like headers
4. **`parse-meta.ts`** — extract OG, Twitter, title, description, canonical URL, and favicon
5. **`diagnostics.ts`** — heuristic rule engine with explicit confidence/wording
6. **`api/og/route.ts`** — validate -> fetch -> parse -> probe image -> diagnose -> respond
7. **Fixture testing** — test with a small set of known good, weak, and malformed URLs

### Phase 2: Approximate preview cards (2-3 hours)

8. **`x-card.tsx`** — close visual approximation using a few real reference screenshots
9. **`linkedin-card.tsx`** — close visual approximation using real references
10. **`slack-card.tsx`** — close visual approximation using real references
11. **`preview-grid.tsx`** — 3-column desktop layout, stacked on mobile
12. **Snapshot pass** — capture component screenshots so the card styling is stable across iterations

### Phase 3: Page assembly (1-2 hours)

13. **`url-input.tsx`** — main input, submit behavior, loading state, local history
14. **`diagnostics.tsx`** — heuristic summary counts and detail rows
15. **`meta-tags.tsx`** — raw tag list with copy affordances
16. **`preview-disclaimer.tsx`** — clear approximation language near the cards
17. **`page.tsx`** — assemble input, loading state, previews, disclaimer, diagnostics, tag inspector
18. **`loading-skeleton.tsx`** — skeletons for the cards and diagnostics

### Phase 4: Polish + deploy (1-2 hours)

19. **Error states** — invalid URL, blocked URL, fetch failure, timeout, no useful metadata found
20. **Empty state** — example URL or instructional shell before first request
21. **Responsive pass** — mobile and desktop spacing, card scaling, truncation behavior
22. **Tool OG tags** — make the previewer itself share well
23. **Deploy to Vercel**

---

## Acceptance Criteria

- A user can paste a public URL and get a result in one interaction
- The cards read as familiar versions of X, LinkedIn, and Slack at a glance
- The UI clearly states that the previews are approximate
- Diagnostics are framed as heuristics rather than guarantees
- The backend refuses obviously dangerous fetch targets and re-checks redirects
- The tool feels portfolio-quality even when the fetched metadata is sparse

---

## Design Notes

- Keep the shell visually polished and intentional, but do not over-style the platform cards
- Native platform cues matter more than exact typography parity
- Loading and empty states should feel designed, not bolted on
- Fast perceived performance matters: show skeletons immediately
- Accuracy claims should stay modest and precise

---

## Potential Enhancements (post-MVP)

- editable sandbox mode for trying metadata changes inline
- downloadable screenshot of the three preview cards
- multi-URL batch checking
- SPA/headless rendering mode for pages that require JS
- browser extension

---

## Estimated Total Effort

**8-10 hours** from zero to deployed, including a minimal security pass and visual reference matching.
