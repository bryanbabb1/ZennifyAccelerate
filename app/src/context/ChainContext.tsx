import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react'
import type { Agent, Deliverable, Orchestration, SeedData, Stage } from '../types'
import baseSeed from '../data/seed'
import { loadLive, saveLive } from '../lib/persistence'

export interface Note { text: string; timestamp: number }

// ─── types ────────────────────────────────────────────────────────────────────
export interface Customizations {
  addedAgents: Agent[]
  removedAgentIds: string[]
  addedStages: Stage[]
  removedStageIds: string[]
  addedDeliverables: Deliverable[]
  removedDeliverableIds: string[]
  addedOrchestration: Orchestration[]
  removedOrchestrationIds: string[]
  renames: Record<string, string>
  positions: Record<string, { x: number; y: number }>
  sizes: Record<string, { width: number; height: number }>
  notes: Record<string, Note[]>
  statuses: Record<string, 'live' | 'wip' | 'planned'>
  flagged: string[]
  personaInteractions: Record<string, { nodeIds: string[]; notes: Record<string, string> }>
  descriptions: Record<string, string>
  owners: Record<string, string>
  stageOverrides: Record<string, string[]>
  links: Record<string, { url: string; label: string }[]>
}

interface ChainState {
  customizations: Customizations
  isEditing: boolean
}

type Action =
  | { type: 'TOGGLE_EDIT' }
  | { type: 'ADD_AGENT'; agent: Agent }
  | { type: 'REMOVE_AGENT'; id: string }
  | { type: 'ADD_STAGE'; stage: Stage }
  | { type: 'REMOVE_STAGE'; id: string }
  | { type: 'ADD_DELIVERABLE'; deliv: Deliverable }
  | { type: 'REMOVE_DELIVERABLE'; id: string }
  | { type: 'ADD_ORCHESTRATION'; orch: Orchestration }
  | { type: 'REMOVE_ORCHESTRATION'; id: string }
  | { type: 'RENAME'; id: string; name: string }
  | { type: 'SET_POSITION'; nodeId: string; pos: { x: number; y: number } }
  | { type: 'SET_SIZE'; nodeId: string; size: { width: number; height: number } }
  | { type: 'ADD_NOTE'; nodeId: string; text: string }
  | { type: 'REMOVE_NOTE'; nodeId: string; index: number }
  | { type: 'SET_STATUS'; nodeId: string; status: 'live' | 'wip' | 'planned' }
  | { type: 'TOGGLE_FLAG'; nodeId: string }
  | { type: 'TOGGLE_PERSONA_NODE'; personaId: string; nodeId: string }
  | { type: 'SET_PERSONA_NOTE'; personaId: string; nodeId: string; text: string }
  | { type: 'SET_DESCRIPTION'; nodeId: string; text: string }
  | { type: 'SET_OWNER'; nodeId: string; owner: string }
  | { type: 'SET_STAGE_OVERRIDE'; nodeId: string; stageIds: string[] }
  | { type: 'ADD_LINK'; nodeId: string; url: string; label: string }
  | { type: 'REMOVE_LINK'; nodeId: string; index: number }
  | { type: 'RESTORE'; customizations: Customizations }
  | { type: 'RESET' }

interface ChainContextValue {
  data: SeedData
  isEditing: boolean
  toggleEditing: () => void
  addAgent: (stageId: string, name: string, description: string, category: 'custom' | 'platform') => void
  removeAgent: (id: string) => void
  addStage: (type: 'presales' | 'delivery', name: string, number: string) => void
  removeStage: (id: string) => void
  addDeliverable: (stageId: string, name: string) => void
  removeDeliverable: (id: string) => void
  addOrchestration: (name: string, description: string, type: 'rail' | 'shared-tool', spansStageIds: string[]) => void
  removeOrchestration: (id: string) => void
  rename: (id: string, name: string) => void
  setPosition: (nodeId: string, pos: { x: number; y: number }) => void
  setSize: (nodeId: string, size: { width: number; height: number }) => void
  addNote: (nodeId: string, text: string) => void
  removeNote: (nodeId: string, index: number) => void
  setStatus: (nodeId: string, status: 'live' | 'wip' | 'planned') => void
  toggleFlag: (nodeId: string) => void
  togglePersonaNode: (personaId: string, nodeId: string) => void
  setPersonaNote: (personaId: string, nodeId: string, text: string) => void
  setDescription: (nodeId: string, text: string) => void
  setOwner: (nodeId: string, owner: string) => void
  setStageOverride: (nodeId: string, stageIds: string[]) => void
  addLink: (nodeId: string, url: string, label: string) => void
  removeLink: (nodeId: string, index: number) => void
  positions: Record<string, { x: number; y: number }>
  stageOverrides: Record<string, string[]>
  links: Record<string, { url: string; label: string }[]>
  sizes: Record<string, { width: number; height: number }>
  notes: Record<string, Note[]>
  statuses: Record<string, 'live' | 'wip' | 'planned'>
  flagged: string[]
  personaInteractions: Record<string, { nodeIds: string[]; notes: Record<string, string> }>
  descriptions: Record<string, string>
  owners: Record<string, string>
  reset: () => void
}

const ChainContext = createContext<ChainContextValue | null>(null)

// ─── defaults ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'zennify-chain-v2'

const defaultCustomizations: Customizations = {
  addedAgents: [],
  removedAgentIds: [],
  addedStages: [],
  removedStageIds: [],
  addedDeliverables: [],
  removedDeliverableIds: [],
  addedOrchestration: [],
  removedOrchestrationIds: [],
  renames: {},
  positions: {},
  sizes: {},
  notes: {},
  statuses: {},
  flagged: [],
  personaInteractions: {
    'delivery-lead':    { nodeIds: ['stage-d1','stage-d2','stage-d3','stage-d4','stage-d5','stage-d6','stage-d7','stage-d8'], notes: {} },
    'sa':               { nodeIds: ['stage-s2','stage-s3','stage-s4','stage-s5','stage-d2','stage-d3','stage-d4','stage-d5'], notes: {} },
    'architect':        { nodeIds: ['stage-d2','stage-d3','stage-d4'], notes: {} },
    'developer':        { nodeIds: ['stage-d3','stage-d4','stage-d5'], notes: {} },
    'qa':               { nodeIds: ['stage-d4','stage-d5'], notes: {} },
    'consultant':       { nodeIds: ['stage-d2','stage-d3','stage-d4','stage-d5','stage-d6'], notes: {} },
    'client':           { nodeIds: ['stage-d1','stage-d2','stage-d5','stage-d6','stage-d7'], notes: {} },
    'ssa':              { nodeIds: ['stage-s1','stage-s2','stage-s3','stage-s4','stage-s5'], notes: {} },
    'legal':            { nodeIds: ['stage-s4'], notes: {} },
    'portfolio-leader': { nodeIds: ['stage-s1','stage-s2','stage-s3','stage-s4','stage-s5','stage-d1','stage-d2','stage-d3','stage-d4','stage-d5','stage-d6','stage-d7','stage-d8'], notes: {} },
  },
  descriptions: {},
  owners: {},
  stageOverrides: {},
  links: {},
}

// ─── reducer ──────────────────────────────────────────────────────────────────
function reducer(state: ChainState, action: Action): ChainState {
  const c = state.customizations
  switch (action.type) {
    case 'TOGGLE_EDIT':
      return { ...state, isEditing: !state.isEditing }

    case 'ADD_AGENT':
      return { ...state, customizations: { ...c, addedAgents: [...c.addedAgents, action.agent] } }

    case 'REMOVE_AGENT': {
      const isAdded = c.addedAgents.some(a => a.id === action.id)
      return isAdded
        ? { ...state, customizations: { ...c, addedAgents: c.addedAgents.filter(a => a.id !== action.id) } }
        : { ...state, customizations: { ...c, removedAgentIds: [...c.removedAgentIds, action.id] } }
    }

    case 'ADD_STAGE':
      return { ...state, customizations: { ...c, addedStages: [...(c.addedStages ?? []), action.stage] } }

    case 'REMOVE_STAGE': {
      const isAdded = (c.addedStages ?? []).some(s => s.id === action.id)
      return isAdded
        ? { ...state, customizations: { ...c, addedStages: (c.addedStages ?? []).filter(s => s.id !== action.id) } }
        : { ...state, customizations: { ...c, removedStageIds: [...(c.removedStageIds ?? []), action.id] } }
    }

    case 'ADD_DELIVERABLE':
      return { ...state, customizations: { ...c, addedDeliverables: [...c.addedDeliverables, action.deliv] } }

    case 'REMOVE_DELIVERABLE': {
      const isAdded = c.addedDeliverables.some(d => d.id === action.id)
      return isAdded
        ? { ...state, customizations: { ...c, addedDeliverables: c.addedDeliverables.filter(d => d.id !== action.id) } }
        : { ...state, customizations: { ...c, removedDeliverableIds: [...c.removedDeliverableIds, action.id] } }
    }

    case 'ADD_ORCHESTRATION':
      return { ...state, customizations: { ...c, addedOrchestration: [...c.addedOrchestration, action.orch] } }

    case 'REMOVE_ORCHESTRATION': {
      const isAdded = c.addedOrchestration.some(o => o.id === action.id)
      return isAdded
        ? { ...state, customizations: { ...c, addedOrchestration: c.addedOrchestration.filter(o => o.id !== action.id) } }
        : { ...state, customizations: { ...c, removedOrchestrationIds: [...c.removedOrchestrationIds, action.id] } }
    }

    case 'RENAME':
      return { ...state, customizations: { ...c, renames: { ...c.renames, [action.id]: action.name } } }

    case 'SET_POSITION':
      return { ...state, customizations: { ...c, positions: { ...c.positions, [action.nodeId]: action.pos } } }

    case 'SET_SIZE':
      return { ...state, customizations: { ...c, sizes: { ...c.sizes, [action.nodeId]: action.size } } }

    case 'ADD_NOTE': {
      const existing = c.notes?.[action.nodeId] ?? []
      return { ...state, customizations: { ...c, notes: { ...c.notes, [action.nodeId]: [...existing, { text: action.text, timestamp: Date.now() }] } } }
    }

    case 'REMOVE_NOTE': {
      const existing = c.notes?.[action.nodeId] ?? []
      return { ...state, customizations: { ...c, notes: { ...c.notes, [action.nodeId]: existing.filter((_, i) => i !== action.index) } } }
    }

    case 'SET_STATUS':
      return { ...state, customizations: { ...c, statuses: { ...(c.statuses ?? {}), [action.nodeId]: action.status } } }

    case 'TOGGLE_FLAG': {
      const flagged = c.flagged ?? []
      const newFlagged = flagged.includes(action.nodeId)
        ? flagged.filter(id => id !== action.nodeId)
        : [...flagged, action.nodeId]
      return { ...state, customizations: { ...c, flagged: newFlagged } }
    }

    case 'TOGGLE_PERSONA_NODE': {
      const existing = c.personaInteractions?.[action.personaId] ?? { nodeIds: [], notes: {} }
      const nodeIds = existing.nodeIds.includes(action.nodeId)
        ? existing.nodeIds.filter(id => id !== action.nodeId)
        : [...existing.nodeIds, action.nodeId]
      return { ...state, customizations: { ...c, personaInteractions: { ...(c.personaInteractions ?? {}), [action.personaId]: { ...existing, nodeIds } } } }
    }

    case 'SET_PERSONA_NOTE': {
      const existing = c.personaInteractions?.[action.personaId] ?? { nodeIds: [], notes: {} }
      return { ...state, customizations: { ...c, personaInteractions: { ...(c.personaInteractions ?? {}), [action.personaId]: { ...existing, notes: { ...existing.notes, [action.nodeId]: action.text } } } } }
    }

    case 'SET_DESCRIPTION':
      return { ...state, customizations: { ...c, descriptions: { ...(c.descriptions ?? {}), [action.nodeId]: action.text } } }

    case 'SET_OWNER':
      return { ...state, customizations: { ...c, owners: { ...(c.owners ?? {}), [action.nodeId]: action.owner } } }

    case 'SET_STAGE_OVERRIDE':
      return { ...state, customizations: { ...c, stageOverrides: { ...(c.stageOverrides ?? {}), [action.nodeId]: action.stageIds } } }

    case 'ADD_LINK': {
      const existing = (c.links ?? {})[action.nodeId] ?? []
      return { ...state, customizations: { ...c, links: { ...(c.links ?? {}), [action.nodeId]: [...existing, { url: action.url, label: action.label }] } } }
    }

    case 'REMOVE_LINK': {
      const existing = (c.links ?? {})[action.nodeId] ?? []
      return { ...state, customizations: { ...c, links: { ...(c.links ?? {}), [action.nodeId]: existing.filter((_, i) => i !== action.index) } } }
    }

    case 'RESTORE':
      // merge with defaults so new fields don't break on old stored data
      return { ...state, customizations: { ...defaultCustomizations, ...action.customizations } }

    case 'RESET':
      return { ...state, customizations: defaultCustomizations }

    default:
      return state
  }
}

// ─── apply renames to seed data ───────────────────────────────────────────────
function buildEffectiveData(c: Customizations): SeedData {
  const r = c.renames
  return {
    ...baseSeed,
    stages: [
      ...baseSeed.stages
        .filter(s => !(c.removedStageIds ?? []).includes(s.id))
        .map(s => r[s.id] ? { ...s, name: r[s.id] } : s),
      ...(c.addedStages ?? []).map(s => r[s.id] ? { ...s, name: r[s.id] } : s),
    ],
    agents: [
      ...baseSeed.agents
        .filter(a => !c.removedAgentIds.includes(a.id))
        .map(a => {
          let result = r[a.id] ? { ...a, name: r[a.id] } : a
          if (c.stageOverrides?.[a.id]) result = { ...result, stageIds: c.stageOverrides[a.id] }
          return result
        }),
      ...c.addedAgents.map(a => {
        let result = r[a.id] ? { ...a, name: r[a.id] } : a
        if (c.stageOverrides?.[a.id]) result = { ...result, stageIds: c.stageOverrides[a.id] }
        return result
      }),
    ],
    deliverables: [
      ...baseSeed.deliverables
        .filter(d => !c.removedDeliverableIds.includes(d.id))
        .map(d => r[d.id] ? { ...d, name: r[d.id] } : d),
      ...c.addedDeliverables.map(d => r[d.id] ? { ...d, name: r[d.id] } : d),
    ],
    orchestration: [
      ...baseSeed.orchestration
        .filter(o => !c.removedOrchestrationIds.includes(o.id))
        .map(o => {
          let result = r[o.id] ? { ...o, name: r[o.id] } : o
          if (c.stageOverrides?.[o.id]) result = { ...result, spansStageIds: c.stageOverrides[o.id] }
          return result
        }),
      ...c.addedOrchestration.map(o => {
        let result = r[o.id] ? { ...o, name: r[o.id] } : o
        if (c.stageOverrides?.[o.id]) result = { ...result, spansStageIds: c.stageOverrides[o.id] }
        return result
      }),
    ],
  }
}

// ─── provider ─────────────────────────────────────────────────────────────────
export function ChainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    // load synchronously on init to avoid race condition
    customizations: (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) return { ...defaultCustomizations, ...JSON.parse(raw) }
      } catch {}
      return defaultCustomizations
    })(),
    isEditing: false,
  })

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customizations))
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => { saveLive(state.customizations) }, 2000)
  }, [state.customizations])

  // Load from Supabase on mount — overlays localStorage with remote state if available
  useEffect(() => {
    loadLive().then(remote => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (remote) dispatch({ type: 'RESTORE', customizations: remote as any })
    })
  }, [])

  const data = buildEffectiveData(state.customizations)

  const ctx: ChainContextValue = {
    data,
    isEditing: state.isEditing,
    positions: state.customizations.positions,
    sizes: state.customizations.sizes,
    notes: state.customizations.notes ?? {},
    statuses: state.customizations.statuses ?? {},
    flagged: state.customizations.flagged ?? [],
    personaInteractions: state.customizations.personaInteractions ?? {},
    descriptions: state.customizations.descriptions ?? {},
    owners: state.customizations.owners ?? {},
    stageOverrides: state.customizations.stageOverrides ?? {},
    links: state.customizations.links ?? {},
    toggleEditing: () => dispatch({ type: 'TOGGLE_EDIT' }),
    addAgent: (stageId, name, description, category) =>
      dispatch({ type: 'ADD_AGENT', agent: { id: `agent-custom-${Date.now()}`, name, description, stageIds: [stageId], status: 'unknown', category } }),
    removeAgent: (id) => dispatch({ type: 'REMOVE_AGENT', id }),
    addStage: (type, name, number) =>
      dispatch({ type: 'ADD_STAGE', stage: { id: `stage-custom-${Date.now()}`, type, name, number, activities: null, outcomes: [] } }),
    removeStage: (id) => dispatch({ type: 'REMOVE_STAGE', id }),
    addDeliverable: (stageId, name) =>
      dispatch({ type: 'ADD_DELIVERABLE', deliv: { id: `deliv-custom-${Date.now()}`, name, producedAtStageId: stageId, ingestedByStageId: 'ip-loop' } }),
    removeDeliverable: (id) => dispatch({ type: 'REMOVE_DELIVERABLE', id }),
    addOrchestration: (name, description, type, spansStageIds) =>
      dispatch({ type: 'ADD_ORCHESTRATION', orch: { id: `orch-custom-${Date.now()}`, name, description, type, spansStageIds } }),
    removeOrchestration: (id) => dispatch({ type: 'REMOVE_ORCHESTRATION', id }),
    rename: (id, name) => dispatch({ type: 'RENAME', id, name }),
    setPosition: (nodeId, pos) => dispatch({ type: 'SET_POSITION', nodeId, pos }),
    setSize: (nodeId, size) => dispatch({ type: 'SET_SIZE', nodeId, size }),
    addNote: (nodeId, text) => dispatch({ type: 'ADD_NOTE', nodeId, text }),
    removeNote: (nodeId, index) => dispatch({ type: 'REMOVE_NOTE', nodeId, index }),
    setStatus: (nodeId, status) => dispatch({ type: 'SET_STATUS', nodeId, status }),
    toggleFlag: (nodeId) => dispatch({ type: 'TOGGLE_FLAG', nodeId }),
    togglePersonaNode: (personaId, nodeId) => dispatch({ type: 'TOGGLE_PERSONA_NODE', personaId, nodeId }),
    setPersonaNote: (personaId, nodeId, text) => dispatch({ type: 'SET_PERSONA_NOTE', personaId, nodeId, text }),
    setDescription: (nodeId, text) => dispatch({ type: 'SET_DESCRIPTION', nodeId, text }),
    setOwner: (nodeId, owner) => dispatch({ type: 'SET_OWNER', nodeId, owner }),
    setStageOverride: (nodeId, stageIds) => dispatch({ type: 'SET_STAGE_OVERRIDE', nodeId, stageIds }),
    addLink: (nodeId, url, label) => dispatch({ type: 'ADD_LINK', nodeId, url, label }),
    removeLink: (nodeId, index) => dispatch({ type: 'REMOVE_LINK', nodeId, index }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return <ChainContext.Provider value={ctx}>{children}</ChainContext.Provider>
}

export function useChain() {
  const ctx = useContext(ChainContext)
  if (!ctx) throw new Error('useChain must be inside ChainProvider')
  return ctx
}
