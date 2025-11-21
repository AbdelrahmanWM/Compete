# Competitor Tracking

A Next.js TypeScript project for tracking competitor products and pricing using web scraping.
# Compete — Competitor Intelligence

Compete is a Next.js + TypeScript application for tracking competitor storefronts, product prices, and ad funnels. It combines server-side scraping, autonomous browsing agents, and a real-time UI to help teams monitor competitor promotions and reconstruct ad-to-checkout funnels.

This README describes the project's purpose, architecture, key components, how to run it locally, and where to look when debugging.

## High-level features

- Ad Funnel Explorer: run an autonomous browsing agent that simulates a user flow from search (ads) → landing → product → cart → checkout, and returns a structured FunnelRun result.
- Live Feed: synthesizes events (price changes, stock updates, new products) from stored product snapshots.
- Product & Competitor management: add, refresh, and store product snapshots and competitor profiles (with scraping helpers).
- Screenshot proxy: server-side endpoint that forwards requests to a screenshot provider (with endpoint probing and a dev SVG fallback).
- Non-clientable server code: server-only scrapers and Playwright usage live behind API routes to keep client bundles small.

## Tech stack

- Next.js (App Router) — React + server components
- TypeScript
- Tailwind CSS + shadcn UI primitives
- MongoDB (Atlas) via a small connection helper
- Firebase Admin (for token verification)
- Playwright / Browser.Cash (for scraping and autonomous browsing)

## Repository layout (important files)

- `app/` — Next.js routes & pages (app router). Key files:
  - `app/ad-funnels/page.tsx` — Ad Funnel UI and agent run controls.
  - `app/live-feed/page.tsx` — Live feed UI (synthesizes events from product data).
  - `app/api/` — server API routes (products, competitors, ad-funnels, screenshot proxy).
- `components/` — React UI components (graph, tables, modals, UI primitives).
- `lib/` — shared server & client helpers
  - `lib/runFunnelAgent.ts` — orchestrates agent task creation, polling, and JSON extraction.
  - `lib/mongodb.ts` — MongoDB connection helper.
  - `lib/firebaseAdmin.ts` — Firebase admin initialization and token verification.
- `scripts/` — helper scripts (e.g., scraping jobs).
- `types/` — TypeScript ambient types and interfaces.

## Getting started (local development)

1. Install dependencies

```bash
npm install
```

2. Environment variables

Create a `.env.local` (or `.env`) in the repo root with the required keys. Minimum set for core features:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=compete

# Firebase Admin (for server-side auth verification)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional: Agent / Browser provider
BROWSER_API_KEY=your_browser_cash_api_key
AGENT_API_URL=https://api.browser.cash
AGENT_SCREENSHOT_PATH=/v1/screenshot

# Optional dev flags
NODE_ENV=development
```

Notes:
- `lib/firebaseAdmin.ts` now tolerates missing Firebase env vars at import time and throws a clear error only when verifying tokens. This makes local UI development easier when auth isn't configured.
- `lib/mongodb.ts` lazily initializes the Mongo client and will throw a clear message if `MONGODB_URI` is missing when a DB call is attempted.

3. Run the dev server

```bash
npm run dev
```

4. Open the app

Point your browser to http://localhost:3000.

## Key workflows

### Running an Ad Funnel exploration

- From the Ad Funnels page, enter a competitor and search query and click "Run Funnel Exploration".
- The UI will show a non-blocking popover with a spinner while the agent runs (and will retry automatically on certain failures). You can navigate away and come back — a future enhancement persists runIds server-side so runs survive navigation.
- The server route `POST /api/ad-funnels` orchestrates the agent task by calling `lib/runFunnelAgent.ts` and parsing returned JSON into the `FunnelRun` shape.

### Live Feed

- The Live Feed page synthesizes events from products stored in MongoDB (price changes, stock changes, new products). It fetches `/api/products` and `/api/competitors` to build the feed client-side.

### Screenshot proxy

- `app/api/screenshot/route.ts` forwards screenshot requests to the configured provider. It probes multiple endpoint paths, forwards the incoming Authorization header, and returns a dev SVG when the provider is unreachable.

## APIs (high-level)

- `GET /api/products` — returns products scoped to authenticated user.
- `POST/PUT/PATCH /api/products` — create or refresh products (server-side scraping can be triggered here).
- `GET /api/competitors` — returns competitor profiles scoped to user.
- `POST /api/ad-funnels` — create and run an ad funnel agent task (returns FunnelRun on success or an error payload).
- `POST /api/screenshot` — proxy to screenshot provider (returns base64 or data URL). Includes diagnostic `tried` list when probing endpoints.

See `app/api/*` for full route implementations and diagnostic outputs.

## Developer notes & gotchas

- Avoid importing server-only code into client bundles. Playwright and other server deps must only be required inside API routes or server-only modules. Several changes in this repo remove server imports from client components to prevent bundling errors.
- If API routes return 500/502 immediately, check `lib/mongodb.ts` and `lib/firebaseAdmin.ts` initialization — these previously threw at import time when env vars were missing. Restart the dev server after changing env vars.
- Screenshot provider issues: the screenshot proxy probes several endpoints and forwards `Authorization` or `x-api-key`. If you observe provider 404s or null token behavior, enable the diagnostic output in the screenshot route and compare the tried endpoints and headers.

## Testing & validation

- Unit tests: not included by default. Add tests for `lib/runFunnelAgent.ts` parsing helpers (extractFirstJsonBlock) to ensure robust JSON extraction from free-text agent outputs.
- Manual: run the agent from the Ad Funnels UI and inspect server logs (the route logs raw provider responses and diagnostic `tried` endpoints.)

## Future improvements

- Background job runner: persist ad-funnel runs in Mongo (`adFunnelRuns` collection) and return a runId immediately so agent tasks continue after the user navigates away. Add status endpoints and consider SSE/push notifications.
- Robust worker queue: move long-running scraping/agent tasks to a queue (BullMQ/Redis) with a dedicated worker process for reliability.
- Local Puppeteer fallback: for dev-only screenshots when no provider is configured.
- Improve agent heuristics and selector fallbacks when locating sponsored ad nodes (to reduce "No eligible node found" failures).

## Contributing

- Fork, create a feature branch, and open a PR. Focus on small incremental changes.
- When editing server code that depends on env vars, prefer defensive guards so local UI dev isn't blocked.

## Troubleshooting quick guide

- 500/502 from API routes: check server logs. Missing `MONGODB_URI` or misconfigured Firebase credentials are the most common causes.
- Agent failures with "No eligible node found": inspect the raw provider output returned by the ad-funnels API (server logs / diagnostic response). Consider broadening selectors or running the search in a browser to observe markup changes.
- Client bundle issues with Playwright assets: ensure Playwright/browser code is only used server-side (inside `app/api/*` or `lib/` server-only modules).

## License

MIT

---

If you'd like, I can also:
- Add a smaller `CONTRIBUTING.md` with developer environment setup steps.
- Create a quick `dev-check` script that validates required env vars and prints clear guidance.
- Implement the background run persistence (non-blocking runs) so agent tasks continue even when you navigate away.

Tell me which of those you want next and I can implement it.
