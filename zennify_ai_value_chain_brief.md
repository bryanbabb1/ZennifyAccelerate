# Zennify AI Value Chain — Claude Code Handoff Brief

**Program:** ZennifyAccelerate
**Owners:** Kevin Murray, Bryan Babb
**Status:** V2 concept validated in Claude artifact mode · ready for real build
**Seed data:** `zennify_ai_value_chain_seed.json`

---

## What we're building

An interactive, editable diagram of Zennify's AI-assisted business process — pre-sales through delivery — that ZennifyAccelerate leadership uses as a live working tool to identify gaps, drive workstream prioritization, and onboard new team members into the program.

Not a slide. Not a static image. A working internal tool.

## Why

The program spans 9 workstreams, 8 process stages, 20+ named agents, 16+ frameworks, and 17+ deliverables. Leadership needs a single visual surface that makes the whole system legible, lets them annotate and mark gaps in real time, and evolves as the program does. Static decks go stale the day they ship; a tool compounds.

## The mental model

A horizontal **trunk** (the 8 process stages, spine-dominant). **Branches fan up** to the tech stack that powers each stage (agents + orchestration + frameworks). **Branches fan down** to deliverables produced. **Rails** (Sales Brain, Delivery Brain) span multiple stages as shared infrastructure. **Personas** are universal — every persona engages every stage. Deliverables **flow forward** into the next stage where they're ingested as inputs. Institutional IP **loops back** from delivery to pre-sales.

## Current state

V2 SVG prototype exists (Claude Code can find it in the project Drive). It validates the visual model. It's not the real thing — it's hardcoded, can't be edited, and doesn't persist. Replace it.

---

## Stack recommendation

**React + Vite + Tailwind + TypeScript.** Why:

- React because the component model maps cleanly to nodes, branches, rails
- Vite because fast dev loop, zero config, good DX
- Tailwind because Zennify brand colors (teal / purple / amber) as tokens, fast styling
- TypeScript because the data model is rich and worth typing

For the diagram itself, **React Flow** (reactflow.dev) is the strong default. Built for node-and-edge diagrams, handles pan / zoom / drag / selection out of the box, and lets us do custom node types per layer (agent, stage, deliverable, rail). Alternative: raw SVG if we want more visual control — but React Flow gets us to a working tool faster.

Persistence: **localStorage** for v1 (single user, no backend) → **Supabase or equivalent** when we go multi-user.

Hosting: **Zennify-internal only.** Vercel, Cloudflare Pages, or internal hosting. Not client-facing. All external positioning material comes later via WS9.

---

## Phased feature plan

### Phase 0 — foundation (1–2 days)
Build the static version of what we already have, but from JSON.

- Load `zennify_ai_value_chain_seed.json` as data source
- Render 8-stage spine (big, colored, visually dominant — teal pre-sales, purple delivery)
- Render agents above each stage, deliverables below, with branch lines connecting
- Render Sales Brain + Delivery Brain as horizontal rails with handoff bridge between them
- Render universal personas band at top
- Horizontal scroll / pan / zoom
- Click any node → detail panel on the right

### Phase 1 — editable (2–3 days)
Turn it into a working tool.

- Add / edit / remove agents, deliverables, frameworks from any stage
- Drag to reposition (within reason — keep the spine horizontal)
- Inline editing of names and descriptions
- Persist all state to localStorage (and export / import as JSON)
- Undo / redo

### Phase 2 — gap hunting (2–3 days)
This is the whole point.

- Status markers per agent: `production` / `in-development` / `concept` / `unknown`. Color-coded (green / amber / gray / red). Filter by status.
- Gap annotation layer: click anywhere to drop a pin with a note. Pins render as small flags next to the element.
- Deliverable flow arrows: thin arcs from each deliverable to the stage that ingests it. Toggle on / off. Red arc = missing / broken handoff.
- Comments thread per node (Slack-style). Ties to `#fy26-v2mom-zennify-accelerate`.

### Phase 3 — overlays (3–5 days)
Make the chain tell different stories.

- **WS4 8-doc overlay:** toggle to show where each of the 8 docs is produced, ingested, and by which agent. Flags docs without agent owners.
- **Workstream overlay:** color-code every element by owning workstream (WS1–WS9). Instantly see what each WS is responsible for.
- **Persona-action overlay:** click a persona, every stage shows what that persona *does* at that node (this is the layer we deliberately skipped in the universal personas band — it's a different view, not the default).
- **Status heatmap:** everything colored by readiness. The red zones are the roadmap.
- **Metric overlay:** lead-to-proposal time, GM %, fixed-price mix per stage — pulls from wherever the data lives.

### Phase 4 — multi-user + live (when it earns its keep)
- Supabase-backed state, multiple concurrent editors
- Comments with @mentions, routed to Slack
- Version history, diff views
- Export to PowerPoint / PDF for board decks (use Anthropic API in-app if we want agent-generated narratives)

---

## Design system

Pull from Zennify brand:

- **Pre-sales spine:** teal 600 fill, teal 900 stroke, white text — `#0F6E56` / `#04342C`
- **Delivery spine:** purple 600 fill, purple 900 stroke, white text — `#534AB7` / `#26215C`
- **Orchestration rails:** amber 200 fill, amber 800 stroke — `#FAC775` / `#854F0B`
- **Branch boxes:** white fill, tertiary stroke
- **Branch lines:** 0.5px, tertiary color, 55% opacity — they should feel like connective tissue, not demand attention
- **Font:** DM Sans (Zennify brand). Fallback Inter.
- **Tone:** flat, clean, no gradients, no drop shadows. Match claude.ai aesthetic — the widget I built is a good reference.

---

## Data model (see `zennify_ai_value_chain_seed.json`)

Top-level keys:
- `personas` — 10 universal personas
- `stages` — 8 process nodes (s1–s5 pre-sales, d1–d3 delivery)
- `agents` — 19 named agents with `stageIds` arrays (so shared agents span stages)
- `orchestration` — rails and shared tools with `spansStageIds`
- `frameworks` — 16 proprietary IP frameworks mapped to stages
- `deliverables` — 17 artifacts with `producedAtStageId` and `ingestedByStageId` (this is the forward-flow edge)
- `ws4EightDocFramework` — separate overlay layer for the 8-doc delivery framework
- `workstreamsMapping` — WS1–WS9 ownership, for filter / overlay purposes

Known gaps captured in the data:
- `ws2.gap: CRITICAL_OPEN_OWNERSHIP` — most important open staffing issue in the program
- Most agents have `status: unknown` — Phase 2 populates this
- `redline-guide.buildStatus: likely-gap` — flagged but needs validation
- WS4 docs 4–7 are placeholders — Bryan will fill these in

---

## What leadership will actually do with this

1. **Weekly stand-up ritual.** Load the tool, scan the chain, identify what moved and what didn't.
2. **Workstream reviews.** Filter by workstream, see exactly what's in scope, what's blocking, what's solved.
3. **New-hire onboarding.** Show the tool, walk the chain. 30-minute explanation instead of 3-hour context dump.
4. **Client conversations.** (Phase 4+) Sanitized version becomes part of the productized offerings story — how Zennify runs deals.
5. **Investment decisions.** See the gap heatmap, ranked by commercial impact. That's the next-quarter roadmap.

---

## Paste-ready Claude Code starter prompt

Copy-paste this into `claude code` to kick off:

> I'm building an interactive value chain diagram for Zennify's ZennifyAccelerate program. It's an internal leadership tool — not client-facing — that visualizes our AI-assisted business process from pre-sales prospect qualification through delivery enablement, with tech stack branches above the spine, deliverables below, orchestration rails spanning multiple stages, and a universal personas band. Leadership uses it to identify gaps in the chain and drive workstream prioritization.
>
> Stack: React + Vite + Tailwind + TypeScript. Use React Flow (reactflow.dev) for the diagram canvas — custom node types for stage, agent, deliverable, rail, persona-band. Persist state to localStorage, export/import as JSON.
>
> I have two files to give you: `zennify_ai_value_chain_brief.md` (this brief) and `zennify_ai_value_chain_seed.json` (the full data model with 8 stages, 19 agents, 16 frameworks, 17 deliverables, orchestration rails, workstream mapping, and WS4 8-doc overlay).
>
> Start with Phase 0: render the chain statically from the JSON. Spine dominant, teal for pre-sales (stages 1–5), purple for delivery (D1–D3), amber for orchestration rails. Branch lines connect agents above each stage and deliverables below. Handoff between Stage 5 and D1 explicitly marked. Click any node → right-side detail panel.
>
> Ship Phase 0 first. I'll give you feedback before we move to Phase 1 (editable), Phase 2 (gap-hunting), Phase 3 (overlays).
>
> Brand colors: teal `#0F6E56`, purple `#534AB7`, amber `#FAC775`. Font DM Sans. Flat, clean, no gradients. Zennify aesthetic.

---

## Open decisions

A few things we haven't locked yet — decide these in the first Claude Code session:

- **Shared agent rendering.** Glengarry appears in s1 and s2; Claude Project in s2, s3, s4; Auctor in d1 and d3. Draw them once as stretched pills spanning multiple stages, or draw separately per stage? Denser but more honest vs. cleaner but misleading.
- **Framework layer.** Tags inside spine boxes, third rail below, or sidebar-only? Currently excluded from the visual for breathing room.
- **Persona-action dimension.** The "what does each persona do at each node" matrix is a separate view. Build it as a modal / second tab / overlay? Definitely not the default view.
- **Export formats.** PNG, SVG, PPTX, JSON? What do you need for the Chris Conant / Aaron Sikorski / Kallen Maher readouts?

---

## Do not

- Do not recreate the v3 pptx capability matrix layout. That's the flat grid. This tool is the web.
- Do not put client-facing branding on it. Internal only until WS9 decides otherwise.
- Do not over-engineer Phase 0. Ship the static render from JSON. Iterate from there.
- Do not pre-mark gaps. Leadership finds them. The tool surfaces structure; humans find the holes.
