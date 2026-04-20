# Delivery Process Agent — Concept

> **Status:** Idea / Pre-concept  
> **Owner:** Bryan Babb  
> **Related:** Zennify Accelerate Canvas (this is a derivative use case, not the same tool)

---

## The Problem

The AI Value Chain Canvas maps Zennify's *organizational* process — the standard delivery model from presales through project close. But every project is different. A client with complex approval chains, a unique persona set, or a non-standard tech stack needs its own map.

Today that knowledge lives in people's heads or scattered Confluence pages. It's never visualized, never shared cleanly, and disappears when a consultant rolls off.

---

## The Idea

A **project-scoped process canvas** — same visual framework as the Value Chain Canvas, but generated fresh for each engagement. A delivery team (or an AI agent) uses a structured template to define:

- The client's personas and roles
- The phases/stages of their specific project
- Which tools and platforms are in play
- What each role does at each stage
- Where the handoffs and risks live

The output is a living, clickable canvas that the team uses for onboarding, knowledge transfer, sprint ceremonies, and retrospectives.

---

## Use Cases

1. **Project kickoff** — SA or Delivery Lead fills out the template in Sprint 0; the canvas is generated and shared with the client team
2. **New team member onboarding** — a consultant or developer joins mid-project and gets oriented by exploring their persona's lit-up nodes
3. **Retrospective IP capture** — at project close, the canvas is exported and filed as a reusable reference pattern
4. **Client self-service** — client stakeholders can explore the canvas to understand who does what and when

---

## How It Could Work

### Option A — Manual Template Fill
A Markdown or JSON template (below) is filled out by the Delivery Lead or SA during Sprint 0. A script or web tool converts it into a pre-seeded canvas instance.

### Option B — AI-Assisted Generation
A "Delivery Process Agent" takes inputs (SOW summary, team roster, tech stack, project type) and generates the template automatically. The team reviews and refines.

### Option C — Interactive Sandbox
A stripped-down version of the canvas web app with a guided setup wizard. Team fills in personas, stages, and tools in a form; the canvas is rendered live.

---

## Template Structure

```markdown
# Project Process Map — [Client Name] | [Project Name]

## Project Context
- **Client:** 
- **Project type:** (e.g. Sales Cloud implementation, CPQ, Service Cloud)
- **Contract type:** (Fixed-price / T&M)
- **Delivery Lead:** 
- **SA:** 
- **Start date:** 
- **Target go-live:** 

---

## Personas (who is involved)

| ID | Name | Role | Internal/Client | Active Phases |
|----|------|------|-----------------|---------------|
| pl | Portfolio Leader | | Internal | All |
| dl | Delivery Lead | | Internal | All delivery |
| sa | Solution Architect | | Internal | D2–D5 |
| pm | Project Manager | | Internal | D1–D8 |
| con | Consultant | [Name] | Internal | D2–D6 |
| dev | Developer | [Name] | Internal | D3–D5 |
| qa | QA | [Name] | Internal | D4–D5 |
| cspo | Client Sponsor | [Name] | Client | D1, D5, D7 |
| cbiz | Client Business Lead | [Name] | Client | D2, D5, D6 |
| cit | Client IT Lead | [Name] | Client | D3, D4, D5, D7 |

---

## Stages (project phases)

| ID | Name | Cadence | Key Outcomes |
|----|------|---------|--------------|
| d1 | Initiate | Week 1–2 | Charter signed, governance set |
| d2 | Discovery | Weeks 2–4 | BRD complete, stories traced |
| d3 | Sprint 0 | 1–2 weeks | Env set up, design signed off |
| d4 | Sprint Cycles | 2-week sprints | Working software |
| d5 | UAT & SIT | 2–4 weeks | Client sign-off |
| d6 | Training | 1–2 weeks | Team enabled |
| d7 | Deploy & Go-Live | Go-live window | Live in production |
| d8 | Close | Final week | IP archived, lessons captured |

_Add or remove stages as appropriate for this project._

---

## Tools & Platforms

| ID | Name | Type | Spans Phases | Notes |
|----|------|------|-------------|-------|
| jira | Jira | Shared tool | D2–D5 | |
| sf-devops | Salesforce DevOps | Shared tool | D3–D7 | |
| auctor | Auctor | Rail | D1–D8 | |
| [custom] | [e.g. MuleSoft, Tableau] | Platform | [phases] | |

---

## Deliverables (key artifacts)

| ID | Name | Produced at | Feeds into | Owner |
|----|------|------------|------------|-------|
| charter | Charter & Governance | D1 | D2 | Delivery Lead |
| brd | Business Requirements Doc | D2 | D3 | Consultant |
| user-stories | User Story Backlog | D2 | D3 | Consultant |
| solution-design | Solution Design Doc | D3 | D4 | SA |
| sprint-reports | Sprint Reports | D4 | D5 | PM |
| uat-signoff | UAT Sign-Off | D5 | D7 | Client Sponsor |
| runbook | Deployment Runbook | D7 | D8 | SA / Dev Lead |

---

## Persona × Stage Interaction Notes

_For each persona, note what they do at each active stage. This populates the "How [persona] interacts here" field in the canvas._

### Delivery Lead
- **D1:** Sets up governance, runs kickoff, confirms RACI
- **D2:** Facilitates discovery logistics, reviews BRD for scope
- ...

### Consultant
- **D2:** Leads discovery sessions, authors BRD and user stories
- **D3:** Reviews Sprint 0 deliverables for requirements accuracy
- ...

### Client Sponsor
- **D1:** Signs charter, confirms success criteria
- **D5:** Executes UAT sign-off
- **D7:** Approves go-live

---

## Risks & Watchpoints

| Risk | Phase | Owner | Mitigation |
|------|-------|-------|-----------|
| Scope creep | D4 | PM | Traceability Agent + change order process |
| Client availability for UAT | D5 | Delivery Lead | Schedule sessions in D4 |
| Data migration complexity | D7 | SA | Spike in Sprint 0 |
```

---

## Agent Design Notes (if built as an AI agent)

**Input:** SOW text, team roster (names + roles), tech stack list, project type

**Output:** Pre-filled version of the template above, ready for review

**Suggested tools/integrations:**
- Salesforce (pull SOW data, team assignment)
- Jira (pull project structure if already set up)
- Auctor (populate from meeting notes captured in Sprint 0)

**Refinement loop:**
1. Agent generates first-pass template
2. Delivery Lead reviews in canvas UI, edits inline
3. Canvas exported as reference artifact at project close

---

## Next Steps

- [ ] Validate template with one real project (retroactively)
- [ ] Decide: web tool vs standalone agent vs extension of existing canvas
- [ ] Identify who would own this tool (WS7 — AI-Native Delivery?)
- [ ] Prototype: try filling this template for an in-flight project
