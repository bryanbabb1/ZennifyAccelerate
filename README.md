# Zennify AI Value Chain

An interactive canvas tool for mapping Zennify's AI-assisted pre-sales and delivery value chain. Built as an internal leadership sandbox — click any node to explore it, enter Edit mode to customize the diagram, and use the Personas system to map stakeholder journeys.

## Live app

> Deploy to Vercel: connect this repo, set root to `app/`, build command `npm run build`, output `dist/`. No environment variables needed.

## Running locally

```bash
cd app
npm install
npm run dev
# opens at http://localhost:5173
```

Requires Node 18+.

## Stack

| Layer | Tech |
|-------|------|
| UI framework | React 18 + TypeScript |
| Build | Vite 5 |
| Canvas | @xyflow/react (React Flow v12) |
| State | useReducer + React Context |
| Persistence | localStorage (`zennify-chain-v2`) |
| Styling | Inline styles (no CSS modules) |

## Project structure

```
app/src/
  main.tsx                  # entry point
  types.ts                  # Agent, Stage, Deliverable, Orchestration, Persona types
  data/
    seed.ts                 # all base data (stages, agents, deliverables, orchestration, personas)
    layout.ts               # builds React Flow nodes/edges from data + customizations
  context/
    ChainContext.tsx         # all state: useReducer, localStorage sync, context methods
  components/
    ValueChain.tsx           # main canvas component (ReactFlow wrapper, all UI panels)
    DetailPanel.tsx          # right-side info panel (shown on node click)
    EditableText.tsx         # inline rename input
    nodes/
      AgentNode.tsx          # agent boxes (⬡ custom, ◈ platform)
      StageNode.tsx          # stage columns (Pre-Sales green, Delivery purple)
      DeliverableNode.tsx    # deliverable chips (arrow or gap flag)
      RailNode.tsx           # orchestration rails (Sales Brain, Delivery Brain)
      SharedToolNode.tsx     # shared tools (Claude Project, Estimating Factory, etc.)
      PersonaBandNode.tsx    # persona pill row at the top
```

## Key concepts

### State shape (`Customizations` in ChainContext)
All user edits are stored as a delta on top of `seed.ts`. Nothing in seed is mutated directly.

```ts
{
  addedAgents / removedAgentIds        // added or soft-deleted agents
  addedStages / removedStageIds        // same for stages
  addedDeliverables / removedDeliverableIds
  addedOrchestration / removedOrchestrationIds
  renames: Record<id, string>          // name overrides
  positions: Record<nodeId, {x,y}>    // drag positions
  sizes: Record<nodeId, {w,h}>        // resize overrides
  notes: Record<nodeId, Note[]>        // timestamped notes per node
  statuses: Record<nodeId, 'live'|'wip'|'planned'>
  flagged: string[]                    // nodes marked with 🚩
  personaInteractions: Record<personaId, { nodeIds: string[], notes: Record<nodeId, string> }>
}
```

localStorage key: `zennify-chain-v2`. Export/Import buttons allow JSON snapshots.

### Node ID conventions
| Prefix | Example |
|--------|---------|
| `stage-` | `stage-s1` |
| `agent-` | `agent-glengarry` |
| `deliv-` | `deliv-account-brief` |
| `rail-` | `rail-sales-brain` |
| `shared-` | `shared-claude-project` |
| `persona-band` | (single node) |

### Modes
- **View mode** (default): click nodes to read info, click persona pills to see journey
- **Edit mode** (`✏ Edit`): drag to reposition, drag corners to resize, click name to rename, hover to delete or flag
- **Persona config mode** (`Edit Personas`): click nodes to assign them to a persona; automatically exits Edit mode

### Personas
Each persona has a `nodeIds` list and per-node `notes`. In view mode, clicking a persona dims all nodes NOT in its `nodeIds`. In config mode, clicking nodes toggles their membership.

## Deployment

This is a pure static site — no server or API needed. To deploy:

1. **Vercel** (recommended): import repo → framework preset Vite → root `app/` → done.
2. **Netlify**: same settings, publish directory `app/dist`.
3. **Any CDN**: run `cd app && npm run build`, serve the `dist/` folder.

### Multi-user shared state
Currently each browser has its own localStorage. For a shared whiteboard experience, replace the localStorage read/write in `ChainContext.tsx` with a real-time backend (Supabase Realtime, Firebase, PartyKit, etc.). The entire shared state is one JSON object, so a single document store works well.

## What's built

- [x] Interactive React Flow canvas with 8 pre-sales + delivery stages
- [x] 20+ AI agents with category badges (Custom Agent / Platform)
- [x] Deliverables flow between stages with gap flagging
- [x] Orchestration rails (Sales Brain, Delivery Brain) and shared tools
- [x] Persona band with 10 stakeholder personas
- [x] Persona journey mapping (config + view mode with node dimming)
- [x] Per-node status badges: Live / WIP / Planned (cycleable in Edit mode)
- [x] Per-node 🚩 flag for attention items
- [x] Per-node notes with timestamps
- [x] Per-node ⓘ info popover (hover in view mode)
- [x] Drag to reposition, drag-corner to resize (grid-snapped in Edit mode)
- [x] Inline rename for all node types
- [x] Add / remove nodes of every type
- [x] Export/Import JSON snapshots
- [x] localStorage persistence across sessions

## Seed data

The canonical data lives in `app/src/data/seed.ts`. Edit that file to change base stage names, agent names, descriptions, deliverables, or personas. The `app/src/data/layout.ts` file controls visual positioning — constants like `STAGE_W`, `AGENT_ROW_STEP`, `RAIL_Y` etc. control the grid.
