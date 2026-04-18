import type React from 'react'
import type { Node, Edge } from '@xyflow/react'
import type { Agent, Deliverable, Orchestration, SeedData, Stage } from '../types'

// ─── constants ────────────────────────────────────────────────────────────────
const STAGE_W = 170
const STAGE_H = 90
const STAGE_GAP = 24
const HANDOFF_GAP = 88

const AGENT_W = 148
const AGENT_H = 56       // min height with status badge row
const AGENT_ROW_STEP = 68 // AGENT_H + 12px gap
const AGENT_SPANNING_W_PAD = 20

const DELIV_W = 148
const DELIV_ROW_STEP = 38

const RAIL_H = 40
const SHARED_TOOL_H = 30

const STAGE_Y = 0
const RAIL_Y = -185
const SHARED_TOOL_Y = -148
const AGENT_ROW_BASE = -310
const SPANNING_AGENT_Y = -390
const DELIV_ROW_BASE = STAGE_Y + STAGE_H + 12

const PERSONA_PANEL_W = 118
const PERSONA_PANEL_H = 720
const PERSONA_PANEL_X = -(PERSONA_PANEL_W + 24)
const PERSONA_PANEL_Y = SPANNING_AGENT_Y - 20

// ─── stage X map ──────────────────────────────────────────────────────────────
const STAGE_ORDER = ['s1', 's2', 's3', 's4', 's5', 'd1', 'd2', 'd3']

function buildStageXMap(): Record<string, number> {
  const map: Record<string, number> = {}
  let x = 0
  for (const id of STAGE_ORDER) {
    map[id] = x
    x += STAGE_W
    if (id === 's5') x += HANDOFF_GAP
    else x += STAGE_GAP
  }
  return map
}

export const stageXMap = buildStageXMap()

export function stageCenter(id: string): number {
  return (stageXMap[id] ?? 0) + STAGE_W / 2
}

function totalCanvasWidth(): number {
  const last = STAGE_ORDER[STAGE_ORDER.length - 1]
  return stageXMap[last] + STAGE_W
}

type AddCallback = (stageId: string, kind: 'agent' | 'deliverable') => void

// ─── main layout builder ──────────────────────────────────────────────────────
export function buildLayout(
  data: SeedData,
  isEditing = false,
  onAdd?: AddCallback,
  positions: Record<string, { x: number; y: number }> = {},
  sizes: Record<string, { width: number; height: number }> = {}
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const canvasW = totalCanvasWidth()

  function pos(nodeId: string, defaultPos: { x: number; y: number }) {
    return positions[nodeId] ?? defaultPos
  }

  function sizeStyle(nodeId: string, defaultW: number, defaultH: number): React.CSSProperties {
    const s = sizes[nodeId]
    // If user manually resized, lock both dims. Otherwise only set width — height auto-expands to fit content.
    if (s) return { width: s.width, height: s.height }
    return { width: defaultW, minHeight: defaultH }
  }

  // ── personas panel (left side, vertical) ──────────────────────────────────
  nodes.push({
    id: 'persona-band',
    type: 'personaBand',
    position: pos('persona-band', { x: PERSONA_PANEL_X, y: PERSONA_PANEL_Y }),
    data: { personas: data.personas, height: PERSONA_PANEL_H },
    draggable: isEditing,
    selectable: true,
  })

  // ── stages ────────────────────────────────────────────────────────────────
  const canvasRight = totalCanvasWidth() + STAGE_GAP
  for (let i = 0; i < data.stages.length; i++) {
    const stage = data.stages[i]
    const nodeId = `stage-${stage.id}`
    const defaultX = stageXMap[stage.id] ?? (canvasRight + i * (STAGE_W + STAGE_GAP))
    nodes.push({
      id: nodeId,
      type: 'stageNode',
      position: pos(nodeId, { x: defaultX, y: STAGE_Y }),
      style: sizeStyle(nodeId, STAGE_W, STAGE_H),
      data: { stage },
      draggable: isEditing,
      selectable: true,
    })
  }

  // ── handoff bridge ─────────────────────────────────────────────────────────
  const s5Right = stageXMap['s5'] + STAGE_W
  const d1Left = stageXMap['d1']
  const bridgeX = s5Right + (d1Left - s5Right) / 2 - 44
  nodes.push({
    id: 'handoff-bridge',
    type: 'handoffNode',
    position: pos('handoff-bridge', { x: bridgeX, y: STAGE_Y + 26 }),
    data: {},
    draggable: isEditing,
    selectable: false,
  })

  // ── orchestration rails ───────────────────────────────────────────────────
  for (const orch of data.orchestration) {
    if (orch.type !== 'rail') continue
    const firstId = orch.spansStageIds[0]
    const lastId = orch.spansStageIds[orch.spansStageIds.length - 1]
    const x = stageXMap[firstId] ?? 0
    const w = (stageXMap[lastId] ?? x) + STAGE_W - x
    const nodeId = `rail-${orch.id}`
    nodes.push({
      id: nodeId,
      type: 'railNode',
      position: pos(nodeId, { x, y: RAIL_Y }),
      style: sizeStyle(nodeId, w, RAIL_H),
      data: { orch, width: w, height: RAIL_H },
      draggable: isEditing,
      selectable: true,
    })
  }

  // ── shared tools ──────────────────────────────────────────────────────────
  for (const orch of data.orchestration) {
    if (orch.type !== 'shared-tool') continue
    const firstId = orch.spansStageIds[0]
    const lastId = orch.spansStageIds[orch.spansStageIds.length - 1]
    const x = (stageXMap[firstId] ?? 0) + 4
    const w = (stageXMap[lastId] ?? x) + STAGE_W - (stageXMap[firstId] ?? 0) - 8
    const nodeId = `shared-${orch.id}`
    nodes.push({
      id: nodeId,
      type: 'sharedToolNode',
      position: pos(nodeId, { x, y: SHARED_TOOL_Y }),
      style: sizeStyle(nodeId, w, SHARED_TOOL_H),
      data: { orch, width: w, height: SHARED_TOOL_H },
      draggable: isEditing,
      selectable: true,
    })
  }

  // ── agents ────────────────────────────────────────────────────────────────
  const spanningAgents = data.agents.filter(a => a.stageIds.length > 1)
  const singleAgents = data.agents.filter(a => a.stageIds.length === 1)

  for (const agent of spanningAgents) {
    const firstId = agent.stageIds[0]
    const lastId = agent.stageIds[agent.stageIds.length - 1]
    const x = (stageXMap[firstId] ?? 0) + (STAGE_W - AGENT_W) / 2 - AGENT_SPANNING_W_PAD / 2
    const w = (stageXMap[lastId] ?? 0) + STAGE_W - (stageXMap[firstId] ?? 0) - (STAGE_W - AGENT_W) + AGENT_SPANNING_W_PAD
    const nodeId = `agent-${agent.id}`
    nodes.push({
      id: nodeId,
      type: 'agentNode',
      position: pos(nodeId, { x, y: SPANNING_AGENT_Y }),
      style: sizeStyle(nodeId, w, AGENT_H),
      data: { agent, width: w, spanning: true },
      draggable: isEditing,
      selectable: true,
    })
    for (const stageId of agent.stageIds) {
      edges.push({
        id: `e-stage-${stageId}-agent-${agent.id}`,
        source: `stage-${stageId}`,
        target: nodeId,
        type: 'straight',
        style: { stroke: '#94a3b8', strokeWidth: 0.75, opacity: 0.55 },
      })
    }
  }

  const agentsByStage: Record<string, Agent[]> = {}
  for (const agent of singleAgents) {
    const sid = agent.stageIds[0]
    if (!agentsByStage[sid]) agentsByStage[sid] = []
    agentsByStage[sid].push(agent)
  }

  for (const [stageId, agents] of Object.entries(agentsByStage)) {
    const stageLeft = stageXMap[stageId]
    const agentX = stageLeft + (STAGE_W - AGENT_W) / 2
    agents.forEach((agent, i) => {
      const nodeId = `agent-${agent.id}`
      const y = AGENT_ROW_BASE - i * AGENT_ROW_STEP
      nodes.push({
        id: nodeId,
        type: 'agentNode',
        position: pos(nodeId, { x: agentX, y }),
        style: sizeStyle(nodeId, AGENT_W, AGENT_H),
        data: { agent, width: AGENT_W, spanning: false },
        draggable: isEditing,
        selectable: true,
      })
      edges.push({
        id: `e-stage-${stageId}-agent-${agent.id}`,
        source: `stage-${stageId}`,
        target: nodeId,
        type: 'straight',
        style: { stroke: '#94a3b8', strokeWidth: 0.75, opacity: 0.55 },
      })
    })
  }

  // ── deliverables ──────────────────────────────────────────────────────────
  const delivByStage: Record<string, Deliverable[]> = {}
  for (const d of data.deliverables) {
    const sid = d.producedAtStageId
    if (!delivByStage[sid]) delivByStage[sid] = []
    delivByStage[sid].push(d)
  }

  for (const [stageId, delivs] of Object.entries(delivByStage)) {
    const stageLeft = stageXMap[stageId]
    if (stageLeft === undefined) continue
    const dX = stageLeft + (STAGE_W - DELIV_W) / 2
    delivs.forEach((deliv, i) => {
      const nodeId = `deliv-${deliv.id}`
      const y = DELIV_ROW_BASE + i * DELIV_ROW_STEP
      nodes.push({
        id: nodeId,
        type: 'deliverableNode',
        position: pos(nodeId, { x: dX, y }),
        style: sizeStyle(nodeId, DELIV_W, 30),
        data: { deliv, width: DELIV_W },
        draggable: isEditing,
        selectable: true,
      })
      edges.push({
        id: `e-stage-${stageId}-deliv-${deliv.id}`,
        source: `stage-${stageId}`,
        target: nodeId,
        type: 'straight',
        style: { stroke: '#94a3b8', strokeWidth: 0.75, opacity: 0.55 },
      })
    })
  }

  // ── edit-mode add buttons ─────────────────────────────────────────────────
  if (isEditing && onAdd) {
    for (const stage of data.stages) {
      const stageLeft = stageXMap[stage.id]
      const btnX = stageLeft + (STAGE_W - AGENT_W) / 2

      const stageAgents = singleAgents.filter(a => a.stageIds[0] === stage.id)
      const agentAddY = AGENT_ROW_BASE - stageAgents.length * AGENT_ROW_STEP - 4
      nodes.push({
        id: `add-agent-${stage.id}`,
        type: 'addButtonNode',
        position: { x: btnX, y: agentAddY },
        data: { label: 'Add Agent', stageId: stage.id, kind: 'agent', onAdd },
        draggable: false,
        selectable: false,
      })

      const stageDelivs = delivByStage[stage.id] ?? []
      const delivAddY = DELIV_ROW_BASE + stageDelivs.length * DELIV_ROW_STEP + 4
      nodes.push({
        id: `add-deliv-${stage.id}`,
        type: 'addButtonNode',
        position: { x: btnX, y: delivAddY },
        data: { label: 'Add Deliverable', stageId: stage.id, kind: 'deliverable', onAdd },
        draggable: false,
        selectable: false,
      })
    }
  }

  // ── deliverable flow edges ────────────────────────────────────────────────
  for (const deliv of data.deliverables) {
    const ingestStageId = deliv.ingestedByStageId
    if (!stageXMap[ingestStageId]) continue
    const isGap = deliv.buildStatus === 'likely-gap'
    edges.push({
      id: `flow-${deliv.id}`,
      source: `deliv-${deliv.id}`,
      target: `stage-${ingestStageId}`,
      type: 'smoothstep',
      style: {
        stroke: isGap ? '#ef4444' : '#FAC775',
        strokeWidth: 1.5,
        opacity: 0.7,
        strokeDasharray: isGap ? '5,3' : undefined,
      },
      markerEnd: { type: 'arrowclosed' as const, color: isGap ? '#ef4444' : '#FAC775', width: 10, height: 10 },
    })
  }

  return { nodes, edges }
}

export type { Stage, Agent, Orchestration, Deliverable }
