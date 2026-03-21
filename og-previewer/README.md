# OG Previewer

Paste any public URL to see how it will appear when shared on X, WhatsApp, and Slack.

## Features

- Server-side metadata fetch (no CORS issues)
- Platform-style preview cards for X, WhatsApp, and Slack
- Heuristic diagnostics for common metadata issues
- Raw meta tag inspector
- Last 10 URLs remembered in local storage
- SSRF protection — private/reserved IP ranges blocked, redirect validation, rate limiting

## Stack

- Next.js 16, TypeScript
- Tailwind CSS v4
- shadcn/ui
- cheerio
- probe-image-size
- Zod

## Getting Started

```bash
npm install
npm run dev
```

## API

`POST /api/og`

```json
{ "url": "https://example.com/post" }
```

Returns extracted metadata, image dimensions, and diagnostics. See [`lib/types.ts`](lib/types.ts) for the full response shape.
