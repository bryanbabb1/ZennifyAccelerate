# Zennify Accelerate — project memory

## What this app is (current state)
A **client-facing, external** single-page site presenting Zennify's **AI ecosystem**
(skills, agents, Claude Projects, apps, MCPs, tools/platforms) across the
sales-to-delivery lifecycle, plus the value it creates and how it's measured.
It replaced the old internal "AI Value Chain" diagram tool as the primary/only view.

Live production: `zennify-accelerate.vercel.app` (deploys from `main`).

## Stack & deploy
- **Vite + React + TypeScript + Tailwind** SPA. Source in `app/`; build output `app/dist`.
- Vercel: `buildCommand` = `cd app && npm install && npm run build`, output `app/dist`.
- **Production deploys from `main`.** Develop on `claude/value-chain-dashboard-79oa4z`,
  then merge to `main` to ship. (Vercel auto-builds on push to `main`.)
- Brand system = the `zennify-html-artifacts` design system: DM Sans, palette
  `--z-dark #1C4A4D` / `--z-teal #27BBAF`, solid fills, 6px radius, **no gradients,
  no box-shadows, no decorative accent bars**. Ecosystem styles are scoped under `.eco`
  in `app/src/ecosystem.css`.

## Key files
- `app/src/App.tsx` — renders **only** `EcosystemOverview` (tab switcher removed).
- `app/src/components/EcosystemOverview.tsx` — the whole page (hero, value pillars,
  interactive lifecycle rail, filterable capability catalog + detail drawer,
  type-by-stage coverage matrix, outcome scorecard + measurement framework).
- `app/src/data/ecosystem.ts` — **baked fallback** capability data + STAGES / STAGE_VALUE
  / PILLARS / KPIS. Used only if the live endpoint is unset/unreachable.
- `app/src/data/assetsData.ts` — base64 Zennify logos + pillar icons.
- `app/src/ecosystem.css` — scoped (`.eco`) styles.
- `app/src/components/ValueChain.tsx` + `SkillsLibrary.tsx` — **kept as backup** of the
  previous plan; no longer imported/rendered. Restore by re-adding a tab switcher in App.tsx.

## Live content pipeline (working)
Content is maintained in a **private Google Sheet CMS** (do NOT make it public):
- Sheet ID: `1HSFZbCxb0p_7OKfVKdBBgE6XDf8eUeMWbtT47xRBgBk`
  (title: "Zennify Accelerate — AI Ecosystem CMS", owner bryan.babb@zennify.com).
- Columns: Sort, Name, Type, Platform, Maturity, Status (internal), Lifecycle Stages,
  Phase, External Description, Value Statement, Use Cases, Primary Benefit,
  **Metric, Before, After, Headline, Basis**, Link, **Visible Externally**.
  (Metric/Before/After/Headline/Basis replaced the old Metric Name / Metric Target:
  each capability carries a quantified before→after impact. **Basis** is the honesty
  marker — `Measured · Salesforce` = validated, `Directional estimate` = educated guess
  shown as "not yet measured", `Enabler` = qualitative/no time metric. Only Pre-Sales
  Factory (40→14 days) and Estimating Factory (~5%→~1%) are Measured today; the rest
  are directional estimates to refine or replace with real numbers.)
- A **Google Apps Script** bound to the Sheet exposes a read-only `doGet` JSON web app
  (Execute as owner, access Anyone). It returns only rows where `Visible Externally != No`,
  so the Sheet stays private and internal/WIP rows never leave.
- The site reads that endpoint at load via the Vercel build env var
  **`VITE_ECOSYSTEM_URL`** (the Apps Script `/exec` URL), and falls back to the baked data.
- **Update loop:** maintainers edit the Sheet → refresh the site → change appears.
  No code change, no redeploy. Only changing the endpoint URL needs a rebuild
  (env var is build-time). Maturity `Live` shows normally; anything else renders as `Roadmap`.

### How to change things
- **Add / remove / restatus a capability, or move its lifecycle stage** → edit the CMS Sheet.
- **Look / feel / copy / new sections** → edit `EcosystemOverview.tsx` / `ecosystem.css`,
  build, merge to `main`.

## Open follow-ups
- **Ship state (2026-07-28):** quantified before→after impact is live on `main`
  (grid card `.qstat` line + drawer Impact block with measured/estimate/enabler basis).
  Handed the user `cms_refined.xlsx` (87 rows, new columns) + updated Apps Script
  `Code.gs` (emits metric/before/after/headline/basis). **User still needs to:**
  (1) import the refreshed sheet into the live Google Sheet, (2) paste the new `Code.gs`
  over the current Apps Script and redeploy the web app (same `/exec` URL, no rebuild).
  Until then the site serves the baked fallback.
- **Validate the estimates.** All impact numbers except Pre-Sales Factory and Estimating
  Factory are *my* directional estimates — a delivery lead should sanity-check them, then
  replace amber "estimate" rows with measured numbers over time.
- **PARKED — internal "Early Signals / AI Impact" gated view.** Board-grade living version
  of the well-received board slide, fed from Salesforce/Impact Signals (velocity 40→14,
  estimation ~5%→~1%, fixed-price shift, margin, earned-wealth proof). Mockup generator
  is `scratchpad/gen_impact.py`. Not started.
- **Offered — Salesforce POC** to auto-populate a few measured metrics (turn amber→green).
- Scorecard numbers (10x, 95%+) are **illustrative placeholders** — replace with real,
  validated metrics when available.
- If Apps Script CORS ever breaks the live fetch, the fallback is a Vercel serverless
  function reading the Sheet via a Google service account (endpoint on our own domain).

## Data lineage (how the inventory was built)
Reconciled from two sources: the **Auctor Skills Catalog** (54-skill library = the
authoritative Skills list) and the **AI Value Chain JSON export** (its "agent" nodes were
re-classified by their notes into true Agents / Claude Projects / Apps / MCPs / Tools;
its own skill list was treated as outdated). Result: 85 capabilities. Personas were
intentionally excluded; lifecycle (Sales S1–S5, Delivery D1–D8) is the spine.
