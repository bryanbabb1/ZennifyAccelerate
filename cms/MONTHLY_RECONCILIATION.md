# Monthly CMS reconciliation — runbook

Run manually once a month (tracked in Jira **ZAIDI-59**). Start a Claude session on this repo and
say **"run the monthly reconciliation"**. Claude proposes; Bryan approves; Claude applies.
First run: 2026-09-29 (manual) — 88 approved changes, 108 rows / 98 visible, Operations lane added.

## 0. Setup
- Work on branch `claude/value-chain-dashboard-79oa4z`; first bring it level with `origin/main`.
- Read `CLAUDE.md` in full. Use its "Last monthly reconciliation" date as "since last run".
- Attach `Zennify/claude-skills-catalog` read-only (add_repo) and shallow-clone it.
- Confirm the Atlassian, Auctor MCP, Google Drive, and Google Sheets connectors are loaded. If one
  is missing or needs reconnecting, say which and what it blocks; continue with the rest.

## 1. Gather (read-only)
- **Jira ZAIDI board** (cloudId `zennify.atlassian.net`): `project = ZAIDI AND statusCategory != "To Do"`,
  plus anything created/updated since the last run. Epics: ZAIDI-23 Delivery, ZAIDI-24 Sales,
  ZAIDI-25 Operations. Results are large — request only needed fields; parse saved results with jq.
- **Auctor** (org space `0ded5552-db00-4539-bdca-231b2c780c5d`): skill docs are in folder
  `60f225e0-ec55-4c69-8c14-835227172691` (Delivery Resources > Agent Resources > Skills).
  `auctor_list_artifacts` can't filter by folder — page all artifacts (limit 50) and filter by
  `folder_ids`. "ARCHIVED" = retired. The skill library itself isn't listable via MCP; use the
  latest "Auctor Use Cases" doc's Skill Index as a proxy. Run this in a subagent.
- **Claude skills catalog**: every `SKILL.md` under `skills/` and `plugins/`.
- **CMS Sheet** `1HSFZbCxb0p_7OKfVKdBBgE6XDf8eUeMWbtT47xRBgBk`, tab `AI Ecosystem CMS`, A:S — save as
  the baseline snapshot.

## 2. Reconcile
One row per change with source evidence: Add / Update / Rename-rework / Re-stage / Remove / Hide /
Update platform.
- Stages: Sales S1–S5, Delivery D1–D8, Operations O1–O4 (see CLAUDE.md).
- Unshipped → `Roadmap`. Archived Auctor skills → remove or rework.
- Internal-only (utilization, capacity, margin, commercial, internal comms) → `Visible Externally = No`.
- Never invent metrics on new rows (leave Metric/Before/After/Headline blank). `Measured · Salesforce`
  only where actually measured.
- Roadmap agents with no board story → propose Hide.
- Copy in Zennify voice: sentence case, outcome-centric, no hype.
- No changes → comment "no changes this month" on ZAIDI-59 and stop.

## 3. Checkpoint — stop for approval
Review workbook (.xlsx, Arial): Read me · Summary (COUNTIF formulas, recalculated) · CMS changes
(yellow Approve Y/N) · Board → value chain. Send it with a short summary and any CONFIRM questions.
**No Sheet write, commit, or deploy until Bryan approves.** Apply only approved rows.

## 4. Apply
- Load the google-workspace skill; read its Sheets reference first.
- Re-read the Sheet; if it changed since the baseline, re-apply the delta on top of current state.
- Write in place (same file/tab/header/column order). Sort as numbers; other cells as text (prefix `'`
  for anything the parser would turn into a number/date/formula). Chunk ~36 rows per write.
- Conventions: new rows copy the row-above format (copyPaste PASTE_FORMAT); extend the basic filter
  to the last row; `Visible Externally` bold, light green for Yes, light orange `#FDE9D6` for No.
- Read the whole tab back and diff: **0 mismatches** before continuing.

## 5. Deploy
- Regenerate baked fallback `ITEMS` in `app/src/data/ecosystem.ts` from visible rows; add
  STAGES / STAGE_VALUE / STAGE_IMPACT only for new stage codes.
- `cd app && npm install && npm run build`; check with `npx vite preview` + Playwright
  (`/opt/node22/lib/node_modules/playwright/index.mjs`, `executablePath: '/opt/pw-browsers/chromium'`,
  unlock with `localStorage.za_unlocked = '1'`).
- Commit on the branch, push, `git merge --no-ff` into `main`, push (Vercel deploys `main`).
- Verify live with curl (headless Chromium rejects the sandbox proxy CA): new bundle at
  https://zennify-accelerate.vercel.app/, and the feed
  `https://script.google.com/macros/s/AKfycbx94-duJ4Vs5ml28lqGz4dzqKPSczA6VLo79EqqwIHEC0PmRlSQyJOPmB84pGaWHLUU/exec`
  matches the Sheet's visible rows within ~5 minutes (Code.gs cache TTL). If it's stuck, bump
  `CACHE_KEY` in `cms/Code.gs` and redeploy (Manage deployments ▸ Edit ▸ New version).

## 6. Record
- Update CLAUDE.md "Last monthly reconciliation" (date + 3–5 line summary); commit, merge to main.
- Comment on ZAIDI-59: what changed and the live verification result.
