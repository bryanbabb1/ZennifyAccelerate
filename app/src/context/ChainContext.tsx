import { createContext, useContext, useReducer, useEffect, useRef, type ReactNode } from 'react'
import type { Agent, Deliverable, Orchestration, SeedData, Skill, SkillOverride, Stage } from '../types'
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
  deliverableRefs: Record<string, string[]>
  links: Record<string, { url: string; label: string }[]>
  statusFields: Record<string, { sopUrl?: string; sopLabel?: string; done?: string; inProgress?: string; outstanding?: string; plan?: string }>
  skillOverrides: Record<string, SkillOverride>
  addedSkills: Skill[]
  removedSkillIds: string[]
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
  | { type: 'SET_STATUS_FIELD'; nodeId: string; field: string; value: string }
  | { type: 'SET_DELIVERABLE_REFS'; delivId: string; stageIds: string[] }
  | { type: 'SET_SKILL_OVERRIDE'; skillId: string; override: SkillOverride }
  | { type: 'ADD_SKILL'; skill: Skill }
  | { type: 'REMOVE_SKILL'; id: string }
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
  setDeliverableRefs: (delivId: string, stageIds: string[]) => void
  addLink: (nodeId: string, url: string, label: string) => void
  removeLink: (nodeId: string, index: number) => void
  setStatusField: (nodeId: string, field: string, value: string) => void
  setSkillOverride: (skillId: string, override: SkillOverride) => void
  addSkill: (skill: Omit<Skill, 'id'>) => void
  removeSkill: (id: string) => void
  customizations: Customizations
  restore: (customizations: Customizations) => void
  positions: Record<string, { x: number; y: number }>
  stageOverrides: Record<string, string[]>
  deliverableRefs: Record<string, string[]>
  links: Record<string, { url: string; label: string }[]>
  statusFields: Record<string, { sopUrl?: string; sopLabel?: string; done?: string; inProgress?: string; outstanding?: string; plan?: string }>
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

// ─── persona merge (safe union — saved notes always win) ──────────────────────
function mergePersonaInteractions(
  saved: Record<string, { nodeIds: string[]; notes: Record<string, string> }>,
  defaults: Record<string, { nodeIds: string[]; notes: Record<string, string> }>
): Record<string, { nodeIds: string[]; notes: Record<string, string> }> {
  const result = { ...saved }
  for (const [personaId, defaultEntry] of Object.entries(defaults)) {
    if (!result[personaId]) {
      result[personaId] = defaultEntry
    } else {
      const s = result[personaId]
      result[personaId] = {
        nodeIds: Array.from(new Set([...s.nodeIds, ...defaultEntry.nodeIds])),
        notes: { ...defaultEntry.notes, ...s.notes },
      }
    }
  }
  return result
}

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
    'portfolio-leader': {
      nodeIds: [
        'stage-s1','stage-s2','stage-s3','stage-s4','stage-s5',
        'stage-d1','stage-d2','stage-d3','stage-d4','stage-d5','stage-d6','stage-d7','stage-d8',
        'agent-transition-asst','agent-auctor-listening',
        'deliv-engagement-brief','deliv-charter-governance','deliv-brd-delivery',
        'deliv-solution-design-doc','deliv-test-strategy-uat','deliv-deployment-runbook-doc',
        'deliv-post-golive-model','deliv-change-mgmt-enablement',
        'rail-auctor-rail',
      ],
      notes: {
        'stage-s1': 'Tracks presales pipeline health and ensures qualification rigor is applied before resources are committed.',
        'stage-d1': 'Reviews governance structure and sponsor alignment — ensures the project is set up to succeed from day one.',
        'agent-transition-asst': 'Ensures deal context is cleanly transferred into delivery so strategic intent is never lost at handoff.',
        'agent-auctor-listening': 'Monitors decision and action capture at a portfolio level — key input for retrospective IP extraction.',
        'deliv-charter-governance': 'Reviews the charter for alignment to commercial commitments and escalation paths.',
        'deliv-brd-delivery': 'Spot-checks BRD scope against SOW to confirm delivery is within agreed boundaries.',
        'deliv-solution-design-doc': 'Reviews solution design for reusability and IP capture opportunities across the portfolio.',
        'deliv-test-strategy-uat': 'Confirms UAT scope and sign-off criteria align with the client success definition.',
        'deliv-deployment-runbook-doc': 'Reviews deployment readiness and go/no-go criteria before launch.',
        'deliv-post-golive-model': 'Approves post-go-live operating model and confirms knowledge is captured for reuse.',
        'deliv-change-mgmt-enablement': 'Reviews change management and enablement quality — critical for client satisfaction and referenceability.',
        'rail-auctor-rail': 'Periodically reviews Auctor-captured insights for portfolio-level IP extraction and delivery pattern identification.',
      },
    },
    'ssa': {
      nodeIds: [
        'stage-s1','stage-s2','stage-s3','stage-s4','stage-s5',
        'agent-glengarry','agent-dma-agent','agent-hubbl','agent-opp-brief-agent',
        'agent-serena','agent-pre-sales-factory','agent-maverick','agent-elle',
        'agent-rfp-ralph','agent-slack-sf-agent','agent-transition-asst',
        'deliv-account-brief','deliv-dma-deck','deliv-hubbl-health-check','deliv-opp-brief',
        'deliv-proposal-deck','deliv-brd-scope','deliv-risk-flag-report','deliv-redline-guide',
        'deliv-engagement-brief','deliv-handoff-pack',
        'shared-claude-project','shared-estimating-factory',
      ],
      notes: {
        'stage-s1': 'Leads prospect qualification — validates fit, assigns pursuit tier, and commits presales resources.',
        'stage-s2': 'Runs research and scoping — directs DMA, Hubbl scan, and opportunity brief creation.',
        'stage-s3': 'Owns solution narrative and proposal quality — final review and approval before client delivery.',
        'stage-s4': 'Reviews SOW and risk posture — approves commercial terms and risk mitigation.',
        'stage-s5': 'Signs off on the handoff pack and ensures the delivery team has full context on what was sold.',
        'agent-glengarry': 'Directs Glengarry\'s research output — sets the strategic framing for account intelligence.',
        'agent-dma-agent': 'Commissions and reviews the DMA — key input to qualification and positioning.',
        'agent-hubbl': 'Reviews Hubbl org scan for maturity signals and whitespace opportunities.',
        'agent-opp-brief-agent': 'Reviews the Opp Brief for accuracy and strategic alignment before proposal work begins.',
        'agent-serena': 'Oversees Serena\'s proposal output — ensures Zennify IP and win themes are properly expressed.',
        'agent-pre-sales-factory': 'Reviews Pre-Sales Factory output for completeness and commercial alignment.',
        'agent-maverick': 'Reviews Maverick\'s SOW risk flags and determines which items require negotiation or escalation.',
        'agent-elle': 'Relies on Elle for contract risk identification — approves redline guidance before client engagement.',
        'agent-rfp-ralph': 'Oversees RFP Ralph output — ensures response quality, compliance, and win-theme alignment.',
        'agent-slack-sf-agent': 'Uses the Slack↔SF agent to keep the deal room synchronized as the opportunity moves to close.',
        'agent-transition-asst': 'Reviews the Transition Assistant output to confirm the handoff pack captures strategic deal context.',
        'deliv-account-brief': 'Consumes the account brief as the primary intelligence artifact for qualification decisions.',
        'deliv-dma-deck': 'Reviews the DMA deck for maturity scoring accuracy and presentation quality.',
        'deliv-hubbl-health-check': 'Reviews the Hubbl Health Check for org scan completeness and actionable insights.',
        'deliv-opp-brief': 'Reviews and approves the Opp Brief before solution and proposal work begins.',
        'deliv-proposal-deck': 'Final approver of the proposal deck — ensures quality, differentiation, and commercial viability.',
        'deliv-brd-scope': 'Reviews the BRD + Scope Definition for completeness and alignment to client expectations.',
        'deliv-risk-flag-report': 'Reviews the Risk Flag Report and determines escalation path for any critical items.',
        'deliv-redline-guide': 'Reviews the Redline Management Guide and aligns with legal and commercial stakeholders.',
        'deliv-engagement-brief': 'Authors or approves the Engagement Brief — the definitive presales-to-delivery handoff document.',
        'deliv-handoff-pack': 'Reviews the full handoff pack to confirm nothing is lost in translation to delivery.',
        'shared-claude-project': 'Uses Claude Project as the persistent knowledge layer for deal context, proposals, and SOW content.',
        'shared-estimating-factory': 'Reviews Estimating Factory outputs to validate LOE assumptions and commercial model.',
      },
    },
    'sa': {
      nodeIds: [
        'stage-s2','stage-s3','stage-s4','stage-s5',
        'stage-d2','stage-d3','stage-d4','stage-d5',
        'agent-opp-brief-agent','agent-serena','agent-pre-sales-factory','agent-maverick',
        'agent-solution-design-asst','agent-windsurf','agent-traceability-agent',
        'deliv-opp-brief','deliv-proposal-deck','deliv-brd-scope','deliv-engagement-brief',
        'deliv-brd-delivery','deliv-user-story-backlog','deliv-solution-design-doc',
        'deliv-architecture-overview','deliv-sprint-reports',
        'rail-auctor-rail',
        'shared-claude-project','shared-estimating-factory','shared-jira','shared-salesforce-devops',
      ],
      notes: {
        'stage-s2': 'Leads technical scoping — translates client context into a workable solution hypothesis.',
        'stage-s3': 'Drives solution design and proposal narrative — owns the technical credibility of the sale.',
        'stage-s4': 'Reviews SOW technical accuracy and flags scope risks before commercial commitment.',
        'stage-s5': 'Authors key sections of the Engagement Brief — ensures technical intent survives the handoff.',
        'stage-d2': 'Leads discovery sessions and validates that requirements are traceable to SOW commitments.',
        'stage-d3': 'Authors solution design and architecture documents — sets the technical foundation for build.',
        'stage-d4': 'Reviews sprint outputs for alignment to the architecture and technical design.',
        'stage-d5': 'Supports UAT from a technical perspective — resolves complex defects and confirms design intent.',
        'agent-opp-brief-agent': 'Uses the Opp Brief Agent to structure the opportunity context into a technical framing.',
        'agent-serena': 'Contributes solution content to Serena\'s proposal generation process.',
        'agent-pre-sales-factory': 'Directs Pre-Sales Factory for BRD structure and technical scope definition.',
        'agent-maverick': 'Reviews Maverick\'s SOW risk flags through a technical lens for feasibility and scope creep risk.',
        'agent-solution-design-asst': 'Primary user of Solution Design Asst — generates architecture patterns and design documentation.',
        'agent-windsurf': 'Reviews Windsurf-generated code for alignment to architecture and technical specifications.',
        'agent-traceability-agent': 'Uses the Traceability Agent to validate that user stories map cleanly to SOW line items.',
        'deliv-opp-brief': 'Authors technical sections of the Opp Brief — solution approach, dependencies, and constraints.',
        'deliv-proposal-deck': 'Owns the solution design slide and technical approach narrative in the proposal.',
        'deliv-brd-scope': 'Primary author of the BRD + Scope Definition — the presales technical anchor document.',
        'deliv-engagement-brief': 'Contributes technical delivery context to the Engagement Brief before handoff.',
        'deliv-brd-delivery': 'Reviews the delivery BRD for completeness and alignment to the presales scope.',
        'deliv-user-story-backlog': 'Reviews user stories for technical feasibility and alignment to the proposed architecture.',
        'deliv-solution-design-doc': 'Primary author — defines solution architecture, integration patterns, and technical boundaries.',
        'deliv-architecture-overview': 'Produces the Architecture Overview — the visual and narrative representation of the technical design.',
        'deliv-sprint-reports': 'Reviews sprint reports to monitor whether technical delivery matches design intent.',
        'rail-auctor-rail': 'Uses Auctor to maintain a running record of technical decisions and architecture change justifications.',
        'shared-claude-project': 'Uses Claude Project to maintain consistent technical context across proposal and delivery phases.',
        'shared-estimating-factory': 'Validates LOE estimates from a technical complexity standpoint.',
        'shared-jira': 'Reviews and refines the user story backlog for technical feasibility and completeness.',
        'shared-salesforce-devops': 'Monitors environment configuration and pipeline health to ensure architecture is correctly implemented.',
      },
    },
    'technical-lead': {
      nodeIds: [
        'stage-d2','stage-d3','stage-d4','stage-d5','stage-d7',
        'agent-solution-design-asst','agent-windsurf','agent-testing-quality',
        'agent-traceability-agent','agent-auctor-listening','agent-doc-agent',
        'deliv-user-story-backlog','deliv-scope-review-deck',
        'deliv-solution-design-doc','deliv-architecture-overview',
        'deliv-sprint-reports','deliv-show-and-tell-outputs',
        'deliv-test-strategy-uat','deliv-deployment-runbook-doc',
        'rail-auctor-rail',
        'shared-jira','shared-salesforce-devops',
      ],
      notes: {
        'stage-d2': 'Reviews discovery outputs for technical feasibility — flags integration complexity, platform constraints, and risks before the design phase.',
        'stage-d3': 'Owns Sprint 0 technical setup: environment provisioning, DevOps pipeline configuration, coding standards, and design review sign-off.',
        'stage-d4': 'Leads the development team — sets technical direction, conducts code reviews, resolves blockers, and maintains sprint velocity.',
        'stage-d5': 'Coordinates SIT execution, triages defects with the QA team, and ensures all technical issues are resolved before UAT sign-off.',
        'stage-d7': 'Owns deployment execution — runs the runbook, monitors environment health, and coordinates rollback decisions if needed.',
        'agent-solution-design-asst': 'Collaborates with the SA on architecture patterns and design documentation — validates that designs are build-ready.',
        'agent-windsurf': 'Primary user of Windsurf for code generation and review — models AI-assisted development practices for the dev team.',
        'agent-testing-quality': 'Drives adoption of the Testing & Quality Agent — uses it to establish automated test coverage and enforce defect triage standards.',
        'agent-traceability-agent': 'Uses the Traceability Agent to confirm that user stories are technically complete and traceable to requirements before sprint start.',
        'agent-auctor-listening': 'Relies on Auctor to capture sprint technical decisions, architecture choices, and retrospective notes.',
        'agent-doc-agent': 'Uses the Doc Agent to maintain technical documentation — API specs, configuration guides, and deployment notes.',
        'deliv-user-story-backlog': 'Reviews and refines user stories for technical feasibility — estimates effort, splits complex stories, and confirms acceptance criteria are testable.',
        'deliv-scope-review-deck': 'Reviews scope changes for technical impact — flags any additions that affect architecture, timeline, or DevOps complexity.',
        'deliv-solution-design-doc': 'Co-authors the Solution Design Document with the SA — owns the implementation and integration sections.',
        'deliv-architecture-overview': 'Primary author of the Architecture Overview — defines object model, integration patterns, environment strategy, and data migration approach.',
        'deliv-sprint-reports': 'Contributes technical status to sprint reports — velocity, build completeness, outstanding defects, and environment health.',
        'deliv-show-and-tell-outputs': 'Leads the technical portion of show-and-tell — demonstrates working software and addresses client technical questions.',
        'deliv-test-strategy-uat': 'Co-authors the SIT portion of the test strategy — defines environment setup, data requirements, and defect severity criteria.',
        'deliv-deployment-runbook-doc': 'Co-authors and owns the Deployment Runbook — step-by-step execution guide for go-live, including rollback procedures.',
        'rail-auctor-rail': 'Auctor captures sprint technical decisions and architecture choices automatically — reduces documentation overhead for the dev team.',
        'shared-jira': 'Manages the technical story backlog — drives refinement, maintains sprint board hygiene, and tracks defects through resolution.',
        'shared-salesforce-devops': 'Owns the DevOps pipeline — manages environment strategy, deployment packages, CI/CD configuration, and promotion gates.',
      },
    },
    'developer': {
      nodeIds: [
        'stage-d3','stage-d4','stage-d5',
        'agent-solution-design-asst','agent-windsurf','agent-testing-quality',
        'deliv-solution-design-doc','deliv-architecture-overview',
        'deliv-sprint-reports','deliv-show-and-tell-outputs',
        'rail-auctor-rail',
        'shared-jira','shared-salesforce-devops',
      ],
      notes: {
        'stage-d3': 'Sets up the dev environment, reviews the solution design, and validates build readiness.',
        'stage-d4': 'Primary build contributor — delivering working software in 2-week sprint cycles.',
        'stage-d5': 'Resolves defects from UAT and supports production deployment readiness.',
        'agent-solution-design-asst': 'Consults Solution Design Asst for architecture guidance and documentation during Sprint 0.',
        'agent-windsurf': 'Uses Windsurf as the AI-powered coding companion — accelerates feature development and code review.',
        'agent-testing-quality': 'Consumes Testing & Quality Agent outputs for automated test generation and defect triage.',
        'deliv-solution-design-doc': 'Reads the Solution Design Document as the authoritative spec for build decisions.',
        'deliv-architecture-overview': 'References the Architecture Overview to ensure implementation aligns with the agreed design.',
        'deliv-sprint-reports': 'Contributes sprint velocity and story completion data to Sprint Reports.',
        'deliv-show-and-tell-outputs': 'Participates in show-and-tell to demo working software and collect client feedback.',
        'rail-auctor-rail': 'Auctor captures sprint decisions and technical debt notes without developer overhead.',
        'shared-jira': 'Primary tool for story pickup, status updates, and defect management throughout sprint cycles.',
        'shared-salesforce-devops': 'Manages deployments across environments — promotes code from dev to staging to production.',
      },
    },
    'qa': {
      nodeIds: [
        'stage-d4','stage-d5',
        'agent-testing-quality',
        'deliv-sprint-reports','deliv-show-and-tell-outputs',
        'deliv-test-strategy-uat','deliv-uat-sign-off',
        'rail-auctor-rail',
        'shared-jira','shared-salesforce-devops',
      ],
      notes: {
        'stage-d4': 'Executes sprint-level testing — validates that each story meets acceptance criteria before show-and-tell.',
        'stage-d5': 'Owns UAT coordination and defect management — drives the client to sign-off.',
        'agent-testing-quality': 'Relies on Testing & Quality Agents to generate test cases, automate regression coverage, and triage defects.',
        'deliv-sprint-reports': 'Contributes defect counts and test coverage metrics to sprint reports.',
        'deliv-show-and-tell-outputs': 'Reviews show-and-tell outputs for quality signals and client feedback requiring follow-up.',
        'deliv-test-strategy-uat': 'Co-authors the Test Strategy & UAT Plan — defines scope, entry/exit criteria, and defect prioritization.',
        'deliv-uat-sign-off': 'Manages the UAT sign-off process — tracks outstanding defects and coordinates client approval.',
        'rail-auctor-rail': 'Uses Auctor to capture test decisions, defect triage outcomes, and UAT meeting notes.',
        'shared-jira': 'Manages the defect backlog — tracks bugs, acceptance criteria failures, and UAT blockers.',
        'shared-salesforce-devops': 'Validates that environment promotions are clean and defect fixes are deployed correctly.',
      },
    },
    'delivery-lead': {
      nodeIds: [
        'stage-d1','stage-d2','stage-d3','stage-d4','stage-d5','stage-d6','stage-d7','stage-d8',
        'agent-transition-asst','agent-discovery-helper','agent-traceability-agent',
        'agent-auctor-listening','agent-solution-design-asst','agent-windsurf',
        'agent-testing-quality','agent-enablement-agent','agent-doc-agent',
        'deliv-charter-governance','deliv-internal-kickoff-pack','deliv-brd-delivery',
        'deliv-user-story-backlog','deliv-scope-review-deck','deliv-solution-design-doc',
        'deliv-architecture-overview','deliv-sprint-reports','deliv-show-and-tell-outputs',
        'deliv-test-strategy-uat','deliv-uat-sign-off','deliv-deployment-runbook-doc',
        'deliv-post-golive-model','deliv-change-mgmt-enablement',
        'rail-auctor-rail',
        'shared-jira','shared-salesforce-devops',
      ],
      notes: {
        'stage-d1': 'Owns project initiation — establishes governance structure, confirms team, and runs kickoff.',
        'stage-d2': 'Facilitates discovery and ensures requirements are captured, traced, and scope-confirmed.',
        'stage-d3': 'Oversees Sprint 0 setup — validates architecture, environment readiness, and build plan.',
        'stage-d4': 'Runs sprint ceremonies, reviews velocity, and manages scope and client communication.',
        'stage-d5': 'Coordinates UAT logistics, manages defect resolution, and drives client sign-off.',
        'stage-d6': 'Oversees training delivery and ensures the client team is enabled for adoption.',
        'stage-d7': 'Manages go-live execution — coordinates deployment, monitors stability, and handles early issues.',
        'stage-d8': 'Leads project close — captures lessons, archives IP, and confirms clean handoff.',
        'agent-transition-asst': 'Uses the Transition Assistant to ingest deal context so nothing is lost at handoff.',
        'agent-discovery-helper': 'Uses Discovery Helper to prep sessions, capture facilitation notes, and generate follow-ups.',
        'agent-traceability-agent': 'Uses the Traceability Agent to monitor scope drift and keep stories tied to SOW commitments.',
        'agent-auctor-listening': 'Relies on Auctor to passively capture decisions and actions throughout the engagement.',
        'agent-solution-design-asst': 'Reviews Solution Design Asst output to confirm architecture is well documented before build.',
        'agent-windsurf': 'Monitors Windsurf productivity metrics as an input to sprint velocity reporting.',
        'agent-testing-quality': 'Reviews Testing & Quality Agent outputs to assess defect trends and UAT readiness.',
        'agent-enablement-agent': 'Oversees Enablement Agent output to ensure training content meets client needs.',
        'agent-doc-agent': 'Uses Doc Agent to generate the project close pack and preserve delivery IP.',
        'deliv-charter-governance': 'Primary author of the Charter & Governance document — the anchor for the entire delivery.',
        'deliv-internal-kickoff-pack': 'Produces the Internal Kickoff Pack to align the delivery team before client engagement.',
        'deliv-brd-delivery': 'Reviews the BRD for completeness and confirms scope before the build phase begins.',
        'deliv-user-story-backlog': 'Reviews the User Story Backlog for quality, traceability, and estimation completeness.',
        'deliv-scope-review-deck': 'Presents the Scope Review Deck to client stakeholders to confirm alignment before Sprint 0.',
        'deliv-solution-design-doc': 'Reviews the Solution Design Document to confirm the delivery team is aligned on architecture.',
        'deliv-architecture-overview': 'Reviews the Architecture Overview to ensure it is suitable for client and stakeholder communication.',
        'deliv-sprint-reports': 'Reviews and distributes Sprint Reports — key communication artifact for client visibility.',
        'deliv-show-and-tell-outputs': 'Facilitates show-and-tell sessions and ensures client feedback is captured and actioned.',
        'deliv-test-strategy-uat': 'Reviews and approves the Test Strategy & UAT Plan before the UAT phase begins.',
        'deliv-uat-sign-off': 'Manages the UAT sign-off milestone — coordinates between QA, client, and leadership.',
        'deliv-deployment-runbook-doc': 'Reviews the Deployment Runbook to confirm go-live readiness and risk mitigation.',
        'deliv-post-golive-model': 'Reviews the Post-GoLive Operating Model to confirm support structure and knowledge transfer.',
        'deliv-change-mgmt-enablement': 'Oversees Change Mgmt & Enablement delivery to ensure adoption readiness.',
        'rail-auctor-rail': "Auctor is the delivery lead's operating backbone — all context, memory, and IP flows through it.",
        'shared-jira': 'Tracks sprint progress, surfaces blockers, and maintains delivery rhythm.',
        'shared-salesforce-devops': 'Monitors environment pipeline health and manages deployment sequencing across environments.',
      },
    },
    'project-manager': {
      nodeIds: [
        'stage-d1','stage-d2','stage-d3','stage-d4','stage-d5','stage-d6','stage-d7','stage-d8',
        'agent-transition-asst','agent-discovery-helper','agent-traceability-agent',
        'agent-auctor-listening','agent-enablement-agent','agent-doc-agent',
        'deliv-charter-governance','deliv-internal-kickoff-pack','deliv-brd-delivery',
        'deliv-user-story-backlog','deliv-scope-review-deck','deliv-sprint-reports',
        'deliv-show-and-tell-outputs','deliv-test-strategy-uat','deliv-uat-sign-off',
        'deliv-deployment-runbook-doc','deliv-post-golive-model','deliv-change-mgmt-enablement',
        'rail-auctor-rail',
        'shared-jira',
      ],
      notes: {
        'stage-d1': 'Sets up project infrastructure, confirms RACI, and aligns team on delivery cadence and communication norms.',
        'stage-d2': 'Manages discovery logistics and ensures stakeholder availability for all sessions.',
        'stage-d3': 'Tracks Sprint 0 readiness criteria and confirms the team is unblocked for build.',
        'stage-d4': 'Manages sprint ceremonies, velocity tracking, scope change requests, and status reporting.',
        'stage-d5': 'Coordinates UAT scheduling, tracks defect resolution, and manages client sign-off logistics.',
        'stage-d6': 'Manages training logistics — scheduling, attendance tracking, and feedback collection.',
        'stage-d7': 'Coordinates go-live logistics — confirms readiness criteria, manages cutover plan, and monitors stability.',
        'stage-d8': 'Manages project close — collects lessons learned, coordinates IP capture, and confirms client acceptance.',
        'agent-transition-asst': 'Reviews Transition Assistant output to understand project context and delivery commitments inherited from presales.',
        'agent-discovery-helper': 'Uses Discovery Helper outputs to track session completion and open action items from requirements work.',
        'agent-traceability-agent': 'Uses Traceability Agent to monitor scope creep and flag items requiring change order consideration.',
        'agent-auctor-listening': 'Uses Auctor to maintain a decision log and auto-capture meeting actions without manual overhead.',
        'agent-enablement-agent': 'Coordinates with the Enablement Agent to ensure training content is ready before D6.',
        'agent-doc-agent': 'Uses Doc Agent to generate project close documentation and lessons-learned artifacts.',
        'deliv-charter-governance': 'Reviews and co-authors the charter — owns the governance model and escalation paths.',
        'deliv-internal-kickoff-pack': 'Produces the Internal Kickoff Pack and runs the internal team kickoff session.',
        'deliv-brd-delivery': 'Reviews the BRD to confirm scope boundaries and flag any changes requiring commercial approval.',
        'deliv-user-story-backlog': 'Reviews the User Story Backlog for completeness and tracks story-level progress throughout sprints.',
        'deliv-scope-review-deck': 'Co-presents the Scope Review Deck to client — manages Q&A and documents scope decisions.',
        'deliv-sprint-reports': 'Distributes Sprint Reports to stakeholders and tracks delivery against committed scope and schedule.',
        'deliv-show-and-tell-outputs': 'Manages show-and-tell logistics and ensures feedback is documented and triaged.',
        'deliv-test-strategy-uat': 'Reviews the UAT plan for scheduling feasibility and confirms client resourcing for test execution.',
        'deliv-uat-sign-off': 'Manages UAT sign-off milestone coordination — tracks outstanding items and gets client acceptance.',
        'deliv-deployment-runbook-doc': 'Reviews the Deployment Runbook for completeness and coordinates go-live stakeholder communication.',
        'deliv-post-golive-model': 'Distributes the Post-GoLive Operating Model to client and confirms support transition is in place.',
        'deliv-change-mgmt-enablement': 'Tracks change management adoption and escalates adoption gaps to the delivery lead.',
        'rail-auctor-rail': 'Uses Auctor output to generate status reports and maintain the project decision log.',
        'shared-jira': 'Primary Jira board owner — grooms backlog, tracks velocity, flags scope changes, and manages sprint health.',
      },
    },
    'principal-consultant': {
      nodeIds: [
        'stage-d1','stage-d2','stage-d3','stage-d4','stage-d5','stage-d6',
        'agent-discovery-helper','agent-traceability-agent','agent-auctor-listening',
        'agent-solution-design-asst','agent-enablement-agent','agent-doc-agent',
        'deliv-brd-delivery','deliv-user-story-backlog','deliv-scope-review-deck',
        'deliv-solution-design-doc','deliv-sprint-reports','deliv-show-and-tell-outputs',
        'deliv-test-strategy-uat','deliv-change-mgmt-enablement',
        'rail-auctor-rail',
        'shared-jira','shared-swantide',
      ],
      notes: {
        'stage-d1': 'Participates in project kickoff — aligns on scope, confirms workstream ownership, and sets delivery standards for the consulting team.',
        'stage-d2': 'Leads or co-leads discovery — owns major functional tracks, facilitates senior client workshops, and governs requirements quality.',
        'stage-d3': 'Reviews Sprint 0 design artifacts for their domain and confirms the solution design reflects discovery outcomes accurately.',
        'stage-d4': 'Oversees sprint delivery for their workstream — reviews stories, guides junior consultants, and validates build quality with the SA.',
        'stage-d5': 'Owns UAT readiness for their domain — ensures test scenarios are complete, defects are triaged, and client acceptance is achieved.',
        'stage-d6': 'Leads training design and delivery for functional areas — ensures end users are equipped for adoption.',
        'agent-discovery-helper': 'Uses Discovery Helper to structure complex multi-track discovery and synthesize outputs across workstreams.',
        'agent-traceability-agent': 'Uses the Traceability Agent to validate end-to-end traceability from business requirements through to test cases.',
        'agent-auctor-listening': 'Relies on Auctor to capture cross-workstream decisions and maintain a clean audit trail across long-running engagements.',
        'agent-solution-design-asst': 'Reviews and contributes to solution design documentation — validates functional design for their domain.',
        'agent-enablement-agent': 'Directs training asset creation — provides subject matter expertise to the Enablement Agent for functional content.',
        'agent-doc-agent': 'Uses the Doc Agent to produce client-facing documentation and process guides for their functional area.',
        'deliv-brd-delivery': 'Owns or co-owns the BRD for their functional domain — accountable for requirements quality and completeness.',
        'deliv-user-story-backlog': 'Reviews and approves user stories for their domain — ensures acceptance criteria are business-accurate and testable.',
        'deliv-scope-review-deck': 'Presents scope for their workstream — communicates complexity, tradeoffs, and risks to client stakeholders.',
        'deliv-solution-design-doc': 'Reviews the Solution Design Document for functional accuracy — escalates misalignments to the SA.',
        'deliv-sprint-reports': 'Contributes workstream status and story outcomes to sprint reports — surfaces risks and blockers proactively.',
        'deliv-show-and-tell-outputs': 'Leads show-and-tell for their workstream — presents completed functionality to client business leads.',
        'deliv-test-strategy-uat': 'Owns the UAT plan for their functional domain — designs scenario coverage and confirms client readiness.',
        'deliv-change-mgmt-enablement': 'Contributes to change management strategy — identifies adoption risks and super-user candidates in their domain.',
        'rail-auctor-rail': 'Auctor maintains the knowledge base across the engagement — critical on complex multi-track projects where context accumulates fast.',
        'shared-jira': 'Manages the backlog for their workstream — governs story quality and tracks delivery progress against commitments.',
        'shared-swantide': 'Uses Swantide to analyze org configuration for their domain during Discovery — surfaces complexity and scope risk early.',
      },
    },
    'consultant': {
      nodeIds: [
        'stage-d2','stage-d3','stage-d4','stage-d5','stage-d6',
        'agent-discovery-helper','agent-traceability-agent','agent-auctor-listening',
        'agent-solution-design-asst','agent-enablement-agent',
        'deliv-brd-delivery','deliv-user-story-backlog','deliv-scope-review-deck',
        'deliv-solution-design-doc','deliv-sprint-reports','deliv-show-and-tell-outputs',
        'deliv-test-strategy-uat',
        'rail-auctor-rail',
        'shared-jira','shared-swantide',
      ],
      notes: {
        'stage-d2': 'Leads discovery sessions — facilitates workshops, captures requirements, and ensures stakeholder alignment.',
        'stage-d3': 'Reviews Sprint 0 deliverables for accuracy and confirms requirements are properly reflected in the design.',
        'stage-d4': 'Participates in sprint cycles — reviews stories, attends demos, and captures client feedback.',
        'stage-d5': 'Supports UAT coordination and validates that test scenarios reflect real business use cases.',
        'stage-d6': 'Contributes to training design and may facilitate end-user sessions for domain-specific topics.',
        'agent-discovery-helper': 'Uses Discovery Helper for session prep, facilitation notes, and follow-up action tracking.',
        'agent-traceability-agent': 'Uses the Traceability Agent to confirm that business requirements are correctly reflected in user stories.',
        'agent-auctor-listening': 'Benefits from Auctor capturing session decisions and actions — reduces manual note-taking overhead.',
        'agent-solution-design-asst': 'Consults Solution Design Asst to validate that functional requirements are properly expressed in the design.',
        'agent-enablement-agent': 'Contributes domain knowledge to the Enablement Agent for training asset creation.',
        'deliv-brd-delivery': 'Primary author of the Business Requirements Document — the definitive requirements artifact for delivery.',
        'deliv-user-story-backlog': 'Authors and refines user stories — responsible for acceptance criteria quality and business clarity.',
        'deliv-scope-review-deck': 'Contributes scope validation content and presents business requirements to client stakeholders.',
        'deliv-solution-design-doc': 'Reviews the Solution Design Document to confirm it accurately reflects functional requirements.',
        'deliv-sprint-reports': 'Reviews sprint reports to confirm stories were built as defined and acceptance criteria were met.',
        'deliv-show-and-tell-outputs': 'Participates in show-and-tell as the business SME — validates completed stories against requirements.',
        'deliv-test-strategy-uat': 'Contributes business scenarios to the UAT plan and validates test cases reflect real user workflows.',
        'rail-auctor-rail': 'Auctor reduces consultant overhead on documentation by capturing meeting content automatically.',
        'shared-jira': 'References Jira to track story status and validate that backlog priorities reflect business need.',
        'shared-swantide': 'Uses Swantide for org analysis during Discovery — surfaces configuration complexity and technical debt.',
      },
    },
    'client': {
      nodeIds: [
        'stage-d1','stage-d2','stage-d5','stage-d6','stage-d7',
        'agent-auctor-listening','agent-enablement-agent',
        'deliv-charter-governance','deliv-scope-review-deck','deliv-show-and-tell-outputs',
        'deliv-uat-sign-off','deliv-change-mgmt-enablement',
      ],
      notes: {
        'stage-d1': 'Participates in kickoff — reviews charter, confirms success criteria, and aligns on governance expectations.',
        'stage-d2': 'Participates in discovery sessions — provides business context, validates requirements, and reviews scope.',
        'stage-d5': 'Executes UAT testing — validates that the solution meets business requirements and signs off for go-live.',
        'stage-d6': 'Attends training sessions and identifies super-users who will support internal adoption.',
        'stage-d7': 'Participates in go-live — confirms cutover, validates production stability, and acknowledges launch.',
        'agent-auctor-listening': 'May participate in Auctor-facilitated meetings — actions and decisions are captured on their behalf.',
        'agent-enablement-agent': 'Receives training materials generated by the Enablement Agent — key input to adoption readiness.',
        'deliv-charter-governance': 'Reviews and signs the Charter & Governance document — formally confirms scope and governance agreement.',
        'deliv-scope-review-deck': 'Reviews the Scope Review Deck to confirm the proposed solution matches their business needs.',
        'deliv-show-and-tell-outputs': 'Attends show-and-tell sessions — primary audience for sprint demos and provides approval/feedback.',
        'deliv-uat-sign-off': 'Provides the UAT Sign-Off — the single most important client action that gates production deployment.',
        'deliv-change-mgmt-enablement': 'Receives the Change Mgmt & Enablement doc to support internal adoption and super-user enablement.',
      },
    },
  },
  descriptions: {},
  owners: {},
  stageOverrides: {},
  deliverableRefs: {
    'dma-deck':      ['d1', 'd2'],
    'account-brief': ['d1'],
    'opp-brief':     ['d1', 'd2'],
    'proposal-deck': ['d1'],
    'brd-scope':     ['d1', 'd2', 'd3'],
    'handoff-pack':  ['d2'],
    'engagement-brief': ['d2', 'd3'],
    'brd-delivery':  ['d4', 'd5'],
    'solution-design-doc': ['d4', 'd5', 'd7'],
    'architecture-overview': ['d4', 'd5', 'd7'],
    'charter-governance': ['d5', 'd7', 'd8'],
  },
  links: {},
  statusFields: {},
  skillOverrides: {},
  addedSkills: [],
  removedSkillIds: [],
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

    case 'SET_STATUS_FIELD': {
      const existing = (c.statusFields ?? {})[action.nodeId] ?? {}
      return { ...state, customizations: { ...c, statusFields: { ...(c.statusFields ?? {}), [action.nodeId]: { ...existing, [action.field]: action.value } } } }
    }

    case 'SET_DELIVERABLE_REFS':
      return { ...state, customizations: { ...c, deliverableRefs: { ...(c.deliverableRefs ?? {}), [action.delivId]: action.stageIds } } }

    case 'SET_SKILL_OVERRIDE': {
      const existing = (c.skillOverrides ?? {})[action.skillId] ?? {}
      return { ...state, customizations: { ...c, skillOverrides: { ...(c.skillOverrides ?? {}), [action.skillId]: { ...existing, ...action.override } } } }
    }

    case 'ADD_SKILL':
      return { ...state, customizations: { ...c, addedSkills: [...(c.addedSkills ?? []), action.skill] } }

    case 'REMOVE_SKILL': {
      const isAdded = (c.addedSkills ?? []).some(s => s.id === action.id)
      return isAdded
        ? { ...state, customizations: { ...c, addedSkills: (c.addedSkills ?? []).filter(s => s.id !== action.id) } }
        : { ...state, customizations: { ...c, removedSkillIds: [...(c.removedSkillIds ?? []), action.id] } }
    }

    case 'RESTORE':
      // merge with defaults so new fields don't break on old stored data
      return { ...state, customizations: {
        ...defaultCustomizations,
        ...action.customizations,
        personaInteractions: mergePersonaInteractions(
          action.customizations.personaInteractions ?? {},
          defaultCustomizations.personaInteractions
        ),
      }}

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
    skills: [
      ...baseSeed.skills.filter(sk => !(c.removedSkillIds ?? []).includes(sk.id)),
      ...(c.addedSkills ?? []),
    ].map(sk => {
      let result = { ...sk }
      if (r[sk.id]) result = { ...result, name: r[sk.id] }
      if (c.descriptions?.[sk.id]) result = { ...result, description: c.descriptions[sk.id] }
      const ov = (c.skillOverrides ?? {})[sk.id]
      if (ov) {
        if (ov.command !== undefined) result = { ...result, command: ov.command }
        if (ov.output !== undefined) result = { ...result, output: ov.output }
        if (ov.status !== undefined) result = { ...result, status: ov.status }
        if (ov.tool !== undefined) result = { ...result, tool: ov.tool }
        if (ov.stageIds !== undefined) result = { ...result, stageIds: ov.stageIds }
        if (ov.personaIds !== undefined) result = { ...result, personaIds: ov.personaIds }
      }
      return result
    }),
  }
}

// ─── provider ─────────────────────────────────────────────────────────────────
export function ChainProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    // load synchronously on init to avoid race condition
    customizations: (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          return { ...defaultCustomizations, ...parsed,
            personaInteractions: mergePersonaInteractions(
              parsed.personaInteractions ?? {},
              defaultCustomizations.personaInteractions
            ),
          }
        }
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
    deliverableRefs: { ...defaultCustomizations.deliverableRefs, ...(state.customizations.deliverableRefs ?? {}) },
    links: state.customizations.links ?? {},
    statusFields: state.customizations.statusFields ?? {},
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
    setDeliverableRefs: (delivId, stageIds) => dispatch({ type: 'SET_DELIVERABLE_REFS', delivId, stageIds }),
    addLink: (nodeId, url, label) => dispatch({ type: 'ADD_LINK', nodeId, url, label }),
    removeLink: (nodeId, index) => dispatch({ type: 'REMOVE_LINK', nodeId, index }),
    setStatusField: (nodeId, field, value) => dispatch({ type: 'SET_STATUS_FIELD', nodeId, field, value }),
    setSkillOverride: (skillId, override) => dispatch({ type: 'SET_SKILL_OVERRIDE', skillId, override }),
    addSkill: (skill) => dispatch({ type: 'ADD_SKILL', skill: { ...skill, id: `skill-custom-${Date.now()}` } }),
    removeSkill: (id) => dispatch({ type: 'REMOVE_SKILL', id }),
    customizations: state.customizations,
    restore: (customizations) => dispatch({ type: 'RESTORE', customizations }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return <ChainContext.Provider value={ctx}>{children}</ChainContext.Provider>
}

export function useChain() {
  const ctx = useContext(ChainContext)
  if (!ctx) throw new Error('useChain must be inside ChainProvider')
  return ctx
}
