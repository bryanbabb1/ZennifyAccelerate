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
- `app/src/components/EcosystemOverview.tsx` — the whole page, in order: hero, value
  pillars, interactive lifecycle rail (with per-stage topline value), **Value section**
  ("Six outcomes, backed by real capabilities" — moved ABOVE the catalog; each of the 6
  benefit cards lists real capabilities with before→after, original value in GREEN, new
  AI-enabled value in ORANGE), filterable capability catalog (**starts collapsed** behind
  a "Show all N" toggle; auto-expands on search/filter) + detail drawer, footer.
  **Coverage matrix REMOVED** (2026-07-29) — restore from git history if wanted. On load,
  state hydrates from a `localStorage('eco_items')` cache of the last live fetch, then
  revalidates in the background (kills the baked→live count flip on reloads).
- `app/src/data/ecosystem.ts` — **baked fallback** capability data + STAGES / STAGE_VALUE
  / **STAGE_IMPACT** / PILLARS / KPIS. Used only if the live endpoint is unset/unreachable.
  `STAGE_IMPACT` is the **stage-level topline value** (stat / label / basis) shown heads-up
  on each lifecycle rail button + in the dark stage detail card. It's **editorial copy
  maintained in code** (like STAGE_VALUE), NOT sheet-driven — per-capability time units are
  heterogeneous and can't be honestly summed, so each stage has one authored directional
  headline. Edit it here, not in the CMS.
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
- **Session 2026-07-29 shipped to `main`:** hero headline → "Every stage of your
  engagement, accelerated by AI." (dropped "Salesforce"); hero subhead → "proven **sales
  and delivery** methodology"; STAGE_VALUE descriptions rewritten outcome-centric;
  per-stage topline `STAGE_IMPACT`; Value section reworked + moved above catalog with
  green(before)/orange(after) metrics; catalog collapsed-by-default; coverage matrix
  removed; localStorage caching of live data.
- **ACTION FOR USER — deploy the new `Code.gs`** (handed 2026-07-29): adds `CacheService`
  (6-hr cache) to fix the ~10s endpoint lag that made counts flip 35→81 on load. Paste
  over the current Apps Script, redeploy the web app (same `/exec` URL, no site rebuild),
  and optionally Run ▸ `installEditTrigger` once so edits auto-clear the cache. This
  `Code.gs` ALSO emits metric/before/after/headline/basis (supersedes the 07-28 one).
- **Session 2026-09-29 — CMS reconciliation + Operations lane (shipped to `main` + live Sheet):**
  reconciled the CMS against the ZAIDI board, the Auctor skill library, and the GitHub
  `Zennify/claude-skills-catalog`. User approved all 88 changes (23 adds, 2 removals,
  13 framework reworks for the new 5-living-doc framework, 33 platform → "Auctor + Claude",
  hides for 5 story-less Roadmap agents). Result: 108 rows, 98 visible externally.
  Added an **Operations** lane: stages `o1` Forecast & Staff, `o2` Govern the Portfolio,
  `o3` Protect Scope & Margin, `o4` Learn & Improve (STAGES lane = 'Operations'). An
  Operations stage renders only when it has ≥1 externally visible capability — O1's tools
  (utilization, capacity, resource sync) are all Visible = No, so O1 is hidden publicly.
  The baked fallback `ecosystem.ts` was regenerated from the approved catalog (98 rows).
- **Operating model (agreed 2026-09-29): Claude maintains the CMS, the user is the checkpoint.**
  Claude proposes a delta (reconciliation workbook, one row per change, with source
  evidence), the user approves, then Claude applies it. Never write unapproved changes to
  the live Sheet — it feeds the client-facing site immediately. Recurring work is tracked
  in ZAIDI-59.
- **Done 2026-09-29:** Google Sheets connector enabled; the approved delta was written in place
  (108 rows, 0 cell mismatches on read-back; new rows formatted like the rows above, filter
  extended to row 109, Visible = No cells filled light orange). Dev branch merged to `main`
  (`e2a4820`) and deployed. The live bundle inlines the `/exec` URL — read it from
  `assets/index-*.js` to query the feed directly with curl (headless Chromium here rejects
  the sandbox proxy CA; curl trusts it).
- **Endpoint cache (fixed 2026-09-29).** The deployed script is now in the repo at `cms/Code.gs`
  (reference copy; the live one is bound to the Sheet). Cache key `ecosystem_json_v3`, TTL
  **5 minutes**, so Sheets-API writes go live within ~5 min; hand edits clear it at once via the
  installed onEdit trigger. To discard a stuck cache immediately, bump `CACHE_KEY` and redeploy
  (Manage deployments ▸ Edit ▸ New version — never "New deployment", which changes the URL).
  Deployment ID `AKfycbx94-duJ4Vs5ml28lqGz4dzqKPSczA6VLo79EqqwIHEC0PmRlSQyJOPmB84pGaWHLUU`
  (public anyway — inlined into the site bundle). Verified live 2026-09-29: 98 items, O-codes
  pass through, Operations lane renders O2·10 / O3·2 / O4·3.
- **Monthly reconciliation — run MANUALLY** (user's choice 2026-09-29; the scheduled routine was
  dropped because org routines can't carry connectors). Runbook: `cms/MONTHLY_RECONCILIATION.md`.
  Trigger by saying "run the monthly reconciliation". Board + Auctor + Claude catalog → review
  workbook → **stop for Bryan's approval** → write Sheet → regenerate fallback → merge to `main` →
  verify live → comment on ZAIDI-59. **Last monthly reconciliation: 2026-09-29** (88 approved
  changes, 108 rows / 98 visible, Operations lane added).
- **Auctor MCP connector showed "needs reconnect" on 2026-09-29** — reconnect it in claude.ai
  connector settings before the next run, or the Auctor half of the reconciliation is blocked.
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
intentionally excluded; lifecycle (Sales S1–S5, Delivery D1–D8, Operations O1–O4 added
2026-09-29) is the spine.
