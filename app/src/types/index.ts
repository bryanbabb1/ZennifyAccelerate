export interface Persona {
  id: string
  name: string
  engagesAllStages: boolean
}

export interface Stage {
  id: string
  type: 'presales' | 'delivery'
  number: string
  name: string
  activities: number | null
  value?: string
  cadence?: string
  outcomes: string[]
  isHingeFromPresalesToDelivery?: boolean
  isSprintCycle?: boolean
}

export interface Agent {
  id: string
  name: string
  description?: string
  stageIds: string[]
  status: 'production' | 'in-development' | 'concept' | 'unknown'
  category?: 'custom' | 'platform'
}

export interface Orchestration {
  id: string
  name: string
  description?: string
  spansStageIds: string[]
  type: 'rail' | 'shared-tool'
}

export interface Framework {
  id: string
  name: string
  stageIds: string[]
}

export interface Deliverable {
  id: string
  name: string
  producedAtStageId: string
  ingestedByStageId: string
  buildStatus?: string
  ws4DocMapping?: string
  isRecurring?: boolean
}

export interface Ws4Doc {
  id: string
  name: string
  startsAtStageId: string | null
  ownerWorkstream: string
}

export interface Workstream {
  id: string
  name: string
  owner: string
  tier: number
  coversElements?: string[]
  coversStageIds?: string[]
  gap?: string
}

export interface Skill {
  id: string
  name: string
  command: string
  description?: string
  stageIds: string[]
  personaIds: string[]
  deliverableIds?: string[]
  platformIds?: string[]
  tool: 'auctor' | 'claude'
  output: string
  status: 'live' | 'wip' | 'planned'
}

export interface SkillOverride {
  command?: string
  output?: string
  description?: string
  status?: 'live' | 'wip' | 'planned'
  tool?: 'auctor' | 'claude'
  stageIds?: string[]
  personaIds?: string[]
  deliverableIds?: string[]
  platformIds?: string[]
}

export interface SeedData {
  personas: Persona[]
  stages: Stage[]
  agents: Agent[]
  orchestration: Orchestration[]
  frameworks: Framework[]
  deliverables: Deliverable[]
  ws4EightDocFramework: { note: string; docs: Ws4Doc[] }
  workstreamsMapping: { note: string; workstreams: Workstream[] }
  skills: Skill[]
}

export type SelectedItem =
  | { kind: 'stage'; data: Stage }
  | { kind: 'agent'; data: Agent }
  | { kind: 'deliverable'; data: Deliverable }
  | { kind: 'orchestration'; data: Orchestration }
  | { kind: 'persona'; data: Persona }
