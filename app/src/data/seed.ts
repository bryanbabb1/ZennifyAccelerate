import type { SeedData } from '../types'

const seed: SeedData = {
  personas: [
    { id: 'portfolio-leader', name: 'Portfolio Leader', engagesAllStages: true },
    { id: 'ssa', name: 'SSA', engagesAllStages: true },
    { id: 'sa', name: 'SA / Solution Architect', engagesAllStages: true },
    { id: 'architect', name: 'Architect', engagesAllStages: true },
    { id: 'developer', name: 'Developer', engagesAllStages: true },
    { id: 'qa', name: 'QA', engagesAllStages: true },
    { id: 'legal', name: 'Legal', engagesAllStages: true },
    { id: 'delivery-lead', name: 'Delivery Lead', engagesAllStages: true },
    { id: 'consultant', name: 'Consultant', engagesAllStages: true },
    { id: 'client', name: 'Client', engagesAllStages: true },
  ],

  stages: [
    // ── Presales ──────────────────────────────────────────────────────────────
    { id: 's1', type: 'presales', number: '1', name: 'Prospect Qualification', activities: 9, value: '10–20 hrs saved', outcomes: ['Speed + quality', 'Exec relevance'] },
    { id: 's2', type: 'presales', number: '2', name: 'Research & Scoping', activities: 13, value: '10–30 hrs saved', outcomes: ['Quality + depth', 'Scope clarity'] },
    { id: 's3', type: 'presales', number: '3', name: 'Solution & Proposal', activities: 16, value: '14–40 hrs saved', outcomes: ['Speed + consistency', 'Margin protection'] },
    { id: 's4', type: 'presales', number: '4', name: 'SOW & Risk', activities: 10, value: '1–4 hrs saved', outcomes: ['Risk reduction', 'Fewer surprises'] },
    { id: 's5', type: 'presales', number: '5', name: 'Closure & Handoff', activities: 11, value: 'Intent preserved · 2–4 hrs saved', outcomes: ['Seamless start'], isHingeFromPresalesToDelivery: true },
    // ── Delivery ──────────────────────────────────────────────────────────────
    {
      id: 'd1', type: 'delivery', number: 'D1', name: 'Initiate',
      activities: 8, cadence: 'Week 1–2',
      outcomes: ['Governance in place', 'Team aligned', 'Kickoff complete'],
    },
    {
      id: 'd2', type: 'delivery', number: 'D2', name: 'Discovery & Analysis',
      activities: 12, cadence: 'Weeks 2–4',
      outcomes: ['Requirements captured', 'Stories traced to SOW', 'Scope confirmed'],
    },
    {
      id: 'd3', type: 'delivery', number: 'D3', name: 'Sprint 0',
      activities: 6, cadence: '1–2 weeks',
      outcomes: ['PoC validated', 'Env set up', 'Build-ready'],
    },
    {
      id: 'd4', type: 'delivery', number: 'D4', name: 'Sprint Cycles',
      activities: null, cadence: 'Repeating 2-week sprints',
      outcomes: ['Working software', 'Iterative delivery', 'Client visibility'],
      isSprintCycle: true,
    },
    {
      id: 'd5', type: 'delivery', number: 'D5', name: 'UAT & SIT',
      activities: 8, cadence: '2–4 weeks',
      outcomes: ['Client sign-off', 'Defects resolved', 'Production-ready'],
    },
    {
      id: 'd6', type: 'delivery', number: 'D6', name: 'Training',
      activities: 5, cadence: '1–2 weeks',
      outcomes: ['Team enabled', 'Adoption accelerated', 'Super-users identified'],
    },
    {
      id: 'd7', type: 'delivery', number: 'D7', name: 'Deploy & Go-Live',
      activities: 8, cadence: 'Go-live window',
      outcomes: ['Successful launch', 'Data migrated', 'Integrations live'],
    },
    {
      id: 'd8', type: 'delivery', number: 'D8', name: 'Project Close',
      activities: 4, cadence: 'Final week',
      outcomes: ['Lessons captured', 'IP preserved', 'Clean close'],
    },
  ],

  agents: [
    // ── Presales agents ───────────────────────────────────────────────────────
    { id: 'glengarry', name: 'Glengarry', description: 'Research agent', stageIds: ['s1', 's2'], status: 'unknown', category: 'custom' },
    { id: 'dma-agent', name: 'DMA Agent', description: 'Digital Maturity Assessment agent', stageIds: ['s1'], status: 'unknown', category: 'custom' },
    { id: 'hubbl', name: 'Hubbl Agent', description: 'Org scan (Hubbl platform)', stageIds: ['s2'], status: 'unknown', category: 'platform' },
    { id: 'opp-brief-agent', name: 'Opp Brief Agent', description: 'Opportunity briefing', stageIds: ['s2'], status: 'unknown', category: 'custom' },
    { id: 'serena', name: 'Serena', description: 'Proposal agent', stageIds: ['s3'], status: 'unknown', category: 'custom' },
    { id: 'pre-sales-factory', name: 'Pre-Sales Factory', description: 'BRD + design', stageIds: ['s3'], status: 'unknown', category: 'custom' },
    { id: 'maverick', name: 'Maverick', description: 'SOW risk agent', stageIds: ['s4'], status: 'unknown', category: 'custom' },
    { id: 'elle', name: 'Elle', description: 'Contract risk', stageIds: ['s4'], status: 'unknown', category: 'custom' },
    { id: 'rfp-ralph', name: 'RFP Ralph', description: 'RFP response engine', stageIds: ['s4'], status: 'unknown', category: 'custom' },
    { id: 'slack-sf-agent', name: 'Slack↔SF Coordination', description: 'Coordination agent', stageIds: ['s5'], status: 'unknown', category: 'custom' },
    // ── Delivery agents ───────────────────────────────────────────────────────
    { id: 'transition-asst', name: 'Transition Asst', description: 'Delivery transition knowledge — bridges deal context from presales into project kickoff', stageIds: ['s5', 'd1'], status: 'unknown', category: 'custom' },
    { id: 'discovery-helper', name: 'Discovery Helper', description: 'Discovery session support — prep, facilitation notes, follow-up', stageIds: ['d2'], status: 'unknown', category: 'custom' },
    { id: 'traceability-agent', name: 'Traceability Agent', description: 'Maps user stories back to SOW line items; surfaces scope drift early', stageIds: ['d2'], status: 'unknown', category: 'custom' },
    { id: 'auctor-listening', name: 'Auctor Listening', description: 'Passive listening agent — captures decisions and actions across the project lifecycle (Auctor platform)', stageIds: ['d2', 'd8'], status: 'unknown', category: 'platform' },
    { id: 'solution-design-asst', name: 'Solution Design Asst', description: 'Design assistance — architecture patterns, doc generation, review', stageIds: ['d3'], status: 'unknown', category: 'custom' },
    { id: 'windsurf', name: 'Windsurf Dev Agent', description: 'AI-powered development (Windsurf platform)', stageIds: ['d4'], status: 'unknown', category: 'platform' },
    { id: 'testing-quality', name: 'Testing & Quality Agents', description: 'QA automation — test case generation, defect triage, regression coverage', stageIds: ['d4', 'd5'], status: 'unknown', category: 'custom' },
    { id: 'enablement-agent', name: 'Enablement Agent', description: 'Training asset generation and delivery support', stageIds: ['d6'], status: 'unknown', category: 'custom' },
    { id: 'doc-agent', name: 'Doc Agent', description: 'Documentation generation — project close pack, IP capture, runbooks', stageIds: ['d8'], status: 'unknown', category: 'custom' },
  ],

  orchestration: [
    // ── Presales rails + tools ────────────────────────────────────────────────
    { id: 'sales-brain', name: 'Sales Brain', description: 'Knowledge layer · deal context · IP grounding', spansStageIds: ['s1', 's2', 's3', 's4', 's5'], type: 'rail' },
    { id: 'claude-project', name: 'Claude Project', description: 'Deal / proposal / SOW context', spansStageIds: ['s2', 's3', 's4'], type: 'shared-tool' },
    { id: 'estimating-factory', name: 'Estimating Factory', description: 'LOE engine', spansStageIds: ['s3'], type: 'shared-tool' },
    // ── Delivery rails + tools ────────────────────────────────────────────────
    { id: 'auctor-rail', name: 'Auctor', description: 'AI backbone across all delivery — context, memory, decisions, IP capture', spansStageIds: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'], type: 'rail' },
    { id: 'jira', name: 'Jira', description: 'Requirements management through UAT — stories, sprints, defects', spansStageIds: ['d2', 'd3', 'd4', 'd5'], type: 'shared-tool' },
    { id: 'salesforce-devops', name: 'Salesforce DevOps', description: 'Environment management through go-live — orgs, pipelines, deployments', spansStageIds: ['d3', 'd4', 'd5', 'd6', 'd7'], type: 'shared-tool' },
    { id: 'swantide', name: 'Org Analysis (Swantide)', description: 'Org analysis tooling', spansStageIds: ['d2'], type: 'shared-tool' },
  ],

  frameworks: [
    // ── Presales ──────────────────────────────────────────────────────────────
    { id: 'dmf', name: 'Digital Maturity Framework', stageIds: ['s1'] },
    { id: 'exec-pov', name: 'Exec POV Methodology', stageIds: ['s1'] },
    { id: 'solution-narrative', name: 'Solution Narrative Framework', stageIds: ['s2'] },
    { id: 'capability-maturity', name: 'Capability Maturity Model (Hubbl)', stageIds: ['s2'] },
    { id: 'solution-design-framework', name: 'Solution Design Framework', stageIds: ['s3'] },
    { id: 'value-phasing', name: 'Value-Based Phasing Model', stageIds: ['s3'] },
    { id: 'commercial-risk', name: 'Commercial Risk Rubric', stageIds: ['s4'] },
    { id: 'scope-integrity', name: 'Scope Integrity Model', stageIds: ['s4'] },
    { id: 'handoff-intent', name: 'Handoff Intent Preservation Model', stageIds: ['s5'] },
    { id: 'knowledge-transfer', name: 'Knowledge Transfer Protocol', stageIds: ['s5'] },
    // ── Delivery ──────────────────────────────────────────────────────────────
    { id: 'governance-model', name: 'Project Governance Model', stageIds: ['d1'] },
    { id: 'sow-to-story', name: 'SOW→Story Traceability Model', stageIds: ['d2'] },
    { id: 'sentiment-capture', name: 'Sentiment Capture Framework', stageIds: ['d2'] },
    { id: 'sprint-planning', name: 'Sprint Planning Framework', stageIds: ['d3', 'd4'] },
    { id: 'arch-guardrails', name: 'Architecture Guardrails Model', stageIds: ['d3'] },
    { id: 'agile-delivery', name: 'Agile Delivery Methodology', stageIds: ['d4'] },
    { id: 'test-coverage-risk', name: 'Test Coverage Risk Model', stageIds: ['d4', 'd5'] },
    { id: 'qa-methodology', name: 'QA Methodology', stageIds: ['d5'] },
    { id: 'role-based-enablement', name: 'Role-Based Enablement Model', stageIds: ['d6'] },
    { id: 'deployment-runbook', name: 'Deployment Runbook Protocol', stageIds: ['d7'] },
    { id: 'living-knowledge', name: 'Living Knowledge Retention Protocol', stageIds: ['d8'] },
  ],

  deliverables: [
    // ── Presales → Delivery ───────────────────────────────────────────────────
    { id: 'account-brief', name: 'Account Brief', producedAtStageId: 's1', ingestedByStageId: 's2' },
    { id: 'dma-deck', name: 'DMA Presentation Deck', producedAtStageId: 's1', ingestedByStageId: 's2' },
    { id: 'hubbl-health-check', name: 'Hubbl Health Check Deck', producedAtStageId: 's2', ingestedByStageId: 's3' },
    { id: 'opp-brief', name: 'Opp Brief Document', producedAtStageId: 's2', ingestedByStageId: 's3' },
    { id: 'proposal-deck', name: 'Proposal Deck First Draft', producedAtStageId: 's3', ingestedByStageId: 's4' },
    { id: 'brd-scope', name: 'BRD + Scope Definition', producedAtStageId: 's3', ingestedByStageId: 's4', ws4DocMapping: 'BRD' },
    { id: 'risk-flag-report', name: 'Risk Flag Report', producedAtStageId: 's4', ingestedByStageId: 's5' },
    { id: 'redline-guide', name: 'Redline Management Guide', producedAtStageId: 's4', ingestedByStageId: 's5', buildStatus: 'likely-gap' },
    { id: 'engagement-brief', name: 'Engagement Brief', producedAtStageId: 's5', ingestedByStageId: 'd1', ws4DocMapping: 'Charter' },
    { id: 'handoff-pack', name: 'Deal Desk Handoff Pack', producedAtStageId: 's5', ingestedByStageId: 'd1' },
    // ── Delivery (8-doc framework) ────────────────────────────────────────────
    { id: 'charter-governance', name: 'Charter & Governance', producedAtStageId: 'd1', ingestedByStageId: 'd2', ws4DocMapping: 'Doc 1' },
    { id: 'internal-kickoff-pack', name: 'Internal Kickoff Pack', producedAtStageId: 'd1', ingestedByStageId: 'd2' },
    { id: 'brd-delivery', name: 'Business Requirements Document', producedAtStageId: 'd2', ingestedByStageId: 'd3', ws4DocMapping: 'Doc 2' },
    { id: 'user-story-backlog', name: 'User Story Backlog', producedAtStageId: 'd2', ingestedByStageId: 'd3' },
    { id: 'scope-review-deck', name: 'Scope Review Deck', producedAtStageId: 'd2', ingestedByStageId: 'd3' },
    { id: 'solution-design-doc', name: 'Solution Design Document', producedAtStageId: 'd3', ingestedByStageId: 'd4', ws4DocMapping: 'Doc 3' },
    { id: 'architecture-overview', name: 'Architecture Overview', producedAtStageId: 'd3', ingestedByStageId: 'd4', ws4DocMapping: 'Doc 4' },
    { id: 'sprint-reports', name: 'Sprint Reports', producedAtStageId: 'd4', ingestedByStageId: 'd5' },
    { id: 'show-and-tell-outputs', name: 'Show & Tell Outputs', producedAtStageId: 'd4', ingestedByStageId: 'd5' },
    { id: 'test-strategy-uat', name: 'Test Strategy & UAT Plan', producedAtStageId: 'd5', ingestedByStageId: 'd7', ws4DocMapping: 'Doc 5' },
    { id: 'uat-sign-off', name: 'UAT Sign-Off', producedAtStageId: 'd5', ingestedByStageId: 'd7' },
    { id: 'deployment-runbook-doc', name: 'Deployment Runbook', producedAtStageId: 'd7', ingestedByStageId: 'd8', ws4DocMapping: 'Doc 6' },
    { id: 'post-golive-model', name: 'Post-GoLive Operating Model', producedAtStageId: 'd8', ingestedByStageId: 'ip-loop', ws4DocMapping: 'Doc 7' },
    { id: 'change-mgmt-enablement', name: 'Change Mgmt & Enablement', producedAtStageId: 'd8', ingestedByStageId: 'ip-loop', ws4DocMapping: 'Doc 8' },
  ],

  ws4EightDocFramework: {
    note: 'WS4 is the 8-document delivery framework — one doc per phase, owned by Bryan Babb.',
    docs: [
      { id: 'ws4-doc1', name: 'Charter & Governance', startsAtStageId: 'd1', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc2', name: 'Business Requirements Document', startsAtStageId: 'd2', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc3', name: 'Solution Design Document', startsAtStageId: 'd3', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc4', name: 'Architecture Overview', startsAtStageId: 'd3', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc5', name: 'Test Strategy & UAT Plan', startsAtStageId: 'd5', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc6', name: 'Deployment Runbook', startsAtStageId: 'd7', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc7', name: 'Post-GoLive Operating Model', startsAtStageId: 'd8', ownerWorkstream: 'WS4' },
      { id: 'ws4-doc8', name: 'Change Mgmt & Enablement', startsAtStageId: 'd8', ownerWorkstream: 'WS4' },
    ],
  },

  workstreamsMapping: {
    note: 'Nine workstreams own different parts of this chain.',
    workstreams: [
      { id: 'ws1', name: 'Capability Framework & IP System', owner: 'Sam Friedewald', tier: 1, coversElements: ['frameworks', 'agents'] },
      { id: 'ws2', name: 'AI Agent Ecosystem & Tooling', owner: 'TBD', tier: 1, coversElements: ['agents', 'orchestration'], gap: 'CRITICAL_OPEN_OWNERSHIP' },
      { id: 'ws3', name: 'Pre-Sales Buying Experience', owner: 'Kevin Murray', tier: 2, coversStageIds: ['s1', 's2', 's3', 's4', 's5'] },
      { id: 'ws4', name: '8-Document Delivery Framework', owner: 'Bryan Babb', tier: 2, coversElements: ['deliverables'], coversStageIds: ['s3', 's5', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'] },
      { id: 'ws5', name: 'Fixed-Price Commercial Model', owner: 'Kevin Murray / Bryan Babb', tier: 2, coversStageIds: ['s3', 's4'] },
      { id: 'ws6', name: 'Productized Offerings', owner: 'Kevin Murray / Carlie Welsh', tier: 2, coversStageIds: ['s1', 's2', 's3'] },
      { id: 'ws7', name: 'AI-Native Delivery & Staffing Model', owner: 'Bryan Babb / Janet Larsen', tier: 2, coversElements: ['personas'], coversStageIds: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'] },
      { id: 'ws8', name: 'Change Management & Enablement', owner: 'Kevin / Bryan / Janet', tier: 3 },
      { id: 'ws9', name: 'GTM & External Positioning', owner: 'Kevin Murray / Carlie Welsh', tier: 3 },
    ],
  },
}

export default seed
