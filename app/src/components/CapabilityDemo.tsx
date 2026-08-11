import { ReactNode, useEffect, useRef, useState } from 'react'
import { EcoItem } from '../data/ecosystem'

/* ------------------------------------------------------------------ *
 * Capability "See it in action" demos — HAND-AUTHORED per capability.
 * Each shows real, specific, recognizable output composed from a small
 * set of artifact primitives (H/Sec/Bul/Table/Callout/Findings/Timeline/
 * KPIs/RAG/BarChart/Deck + the story/wireframe cards). A capability only
 * gets a "See it in action" button when it's in the DEMOS registry.
 * The generation choreography is theater; the payload is the point.
 * ------------------------------------------------------------------ */

export type DemoDef = { input: string; source: string; steps: string[]; blocks: ReactNode[] }

// ---------- artifact primitives --------------------------------------------
const H = (t: string, s?: string) => <div className="doc-h"><b>{t}</b>{s ? <span>{s}</span> : null}</div>
const Sec = (t: string, body: ReactNode) => <div className="doc-sec"><h5>{t}</h5>{body}</div>
type BItem = string | { b: string; t?: string }
const Bul = (items: BItem[]) => (
  <ul className="doc-b">{items.map((x, i) => <li key={i}>{typeof x === 'string' ? x : <><b>{x.b}</b>{x.t ? ' ' + x.t : ''}</>}</li>)}</ul>
)
const Note = (n: ReactNode) => <div className="trace">{n}</div>
const Foot = (l: string, r: string) => <div className="doc-foot"><span>{l}</span><span className="tick">{r}</span></div>
const Callout = (n: string, t: string, s: string) => (
  <div className="estvar"><div className="ev-n">{n}</div><div className="ev-t"><b>{t}</b><span>{s}</span></div></div>
)
const Ch = (t: string, tone: string) => <i className={`ch ${tone}`}>{t}</i>
const Table = (tmpl: string, head: string[], rows: ReactNode[][]) => (
  <div className="gtbl">
    <div className="gr head" style={{ gridTemplateColumns: tmpl }}>{head.map((h, i) => <span key={i}>{h}</span>)}</div>
    {rows.map((r, i) => <div className="gr" key={i} style={{ gridTemplateColumns: tmpl }}>{r.map((c, j) => <span key={j}>{c}</span>)}</div>)}
  </div>
)
const Finds = (items: { tone: string; b: string; t: string }[]) => (
  <div className="findings">{items.map((f, i) => <div className="finding" key={i}><span className={`dot ${f.tone}`} /><div><b>{f.b}</b> — {f.t}</div></div>)}</div>
)
const Timeline = (items: { tt: string; t: string }[]) => (
  <div className="tl">{items.map((x, i) => <div className="ti" key={i}><span className="tt">{x.tt}</span>{x.t}</div>)}</div>
)
const Kpis = (items: { n: string; l: string }[]) => (
  <div className="kpis">{items.map((k, i) => <div className="kpi" key={i}><div className="kn">{k.n}</div><div className="kl">{k.l}</div></div>)}</div>
)
const RAG = (rows: { k: string; chip: ReactNode }[]) => (
  <div className="dash-tbl">{rows.map((r, i) => <div className="tr" key={i}><span>{r.k}</span>{r.chip}</div>)}</div>
)
const BarChart = (hs: number[]) => <div className="dash-chart">{hs.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
const Bar = ({ label, score }: { label: string; score: number }) => (
  <div className="mbar"><span className="ml">{label}</span><span className="mt"><i style={{ width: `${score}%` }} /></span><b className="mv">{score}</b></div>
)
const Story = (key: string, title: string, story: ReactNode, ac: string[], chips: string[]) => (
  <div className="storycard">
    <div className="sc-head"><span className="sc-key">{key}</span> {title}<span className="sc-done">Generated</span></div>
    <p className="sc-story">{story}</p>
    <div className="sc-ac-l">Acceptance criteria</div>
    <ul className="sc-ac">{ac.map((a, i) => <li key={i}>{a}</li>)}</ul>
    <div className="sc-chips">{chips.map((c, i) => <span key={i}>{c}</span>)}</div>
  </div>
)
const Wireframe = (obj: string, title: string, hl: [string, string][], fields: { label: string; warn?: boolean; req?: boolean; full?: boolean; tall?: boolean }[]) => (
  <div className="lwf">
    <div className="lwf-top"><span className="lwf-obj">{obj}</span><span className="lwf-title">{title}</span>
      <span className="lwf-pills"><i>Edit</i><i>Clone</i><i className="p">Save</i></span></div>
    <div className="lwf-hl">{hl.map(([k, v], i) => <div key={i}><span>{k}</span><b>{v}</b></div>)}</div>
    <div className="lwf-tabs"><span className="on">Details</span><span>Related</span><span>Activity</span></div>
    <div className="lwf-form">{fields.map((f, i) => (
      <div className={`lwf-f ${f.warn ? 'warn' : ''} ${f.full ? 'full' : ''}`} key={i}>
        <span>{f.label}{f.req ? <em>required</em> : null}</span><div className={`in ${f.tall ? 'tall' : ''}`} />
      </div>))}</div>
  </div>
)

// ==================== the demos ============================================
const brd: DemoDef = {
  input: '4 discovery workshops · Member Services', source: 'Auctor · traceable to objectives',
  steps: ['Ingesting 4 workshop transcripts…', 'Clustering needs into requirements…', 'Writing acceptance criteria…', 'Tracing each to a business objective…', 'Assembling the BRD…'],
  blocks: [
    H('Business Requirements Document', 'Member Case Management'),
    Table('64px 1fr 62px', ['ID', 'Requirement', 'Priority'], [
      [<span className="rid">REQ-012</span>, <span><b>Single-screen case intake.</b> Rep captures member, branch, type, and description without leaving the page.<em>Accept:</em> a case is created from one view with zero navigation.</span>, Ch('Must', 'd')],
      [<span className="rid">REQ-014</span>, <span><b>Capture originating branch on every case.</b><em>Accept:</em> branch is required, stored on the record, and reportable.</span>, Ch('Must', 'd')],
      [<span className="rid">REQ-021</span>, <span><b>Auto-route to the branch queue.</b><em>Accept:</em> on submit, the case reaches the owning branch’s queue within one minute.</span>, Ch('Should', 'g')],
    ]),
    Note(<>Every requirement links to <b>Objective O2 — reduce follow-up leakage</b> (target: 0 dropped cases).</>),
    Foot('27 requirements · 100% traced to objectives', 'Signed-off draft in 3 days'),
  ],
}

const est: DemoDef = {
  input: 'Scope: FSC for Wealth · Phase 1', source: 'Salesforce · 120 comparable projects',
  steps: ['Parsing scope & assumptions…', 'Matching 12 comparable engagements…', 'Estimating by workstream…', 'Applying risk & confidence bands…', 'Reconciling against actuals…'],
  blocks: [
    H('Effort estimate', 'FSC for Wealth · Phase 1'),
    <div className="esttbl">
      <div className="estrow head"><span>Workstream</span><span>Hours</span><span>Confidence</span></div>
      <div className="estrow"><span>Configuration</span><span className="h">180</span><span><i className="cf hi">High</i></span></div>
      <div className="estrow"><span>Data migration</span><span className="h">90</span><span><i className="cf md">Medium</i></span></div>
      <div className="estrow"><span>Integrations</span><span className="h">140</span><span><i className="cf md">Medium</i></span></div>
      <div className="estrow"><span>Testing &amp; UAT</span><span className="h">80</span><span><i className="cf hi">High</i></span></div>
      <div className="estrow"><span>PM &amp; governance</span><span className="h">60</span><span><i className="cf hi">High</i></span></div>
      <div className="estrow total"><span>Total</span><span className="h">550</span><span>hours</span></div>
    </div>,
    Callout('±1%', 'Estimate vs actuals on comparable work', 'within ~1% variance over the last 6 months · Measured · Salesforce'),
    Foot('Benchmarked against 12 comparable FSC engagements', 'Defensible in the SOW'),
  ],
}

const dma: DemoDef = {
  input: 'Org scan + stakeholder inputs', source: 'Web app · scored across 6 dimensions',
  steps: ['Scanning the Salesforce org…', 'Scoring across 6 dimensions…', 'Benchmarking to peers…', 'Prioritizing recommendations…'],
  blocks: [
    <div className="dma-top"><div className="doc-h nofill"><b>Digital Maturity Assessment</b></div><span className="tier">Developing · Tier 2 of 5</span></div>,
    <div className="mbars">
      <Bar label="Data foundation" score={62} /><Bar label="Customer experience" score={48} /><Bar label="Automation" score={55} />
      <Bar label="AI readiness" score={34} /><Bar label="Integration" score={51} /><Bar label="Governance" score={67} />
    </div>,
    <div className="recs"><div className="rec-l">Prioritized next moves</div>
      <div className="rec"><span>Consolidate the data model</span><span className="rc"><i className="ri hi">Impact High</i><i className="re md">Effort Med</i></span></div>
      <div className="rec"><span>Stand up an AI-ready data pipeline</span><span className="rc"><i className="ri hi">Impact High</i><i className="re hi">Effort High</i></span></div>
      <div className="rec"><span>Automate service intake</span><span className="rc"><i className="ri md">Impact Med</i><i className="re lo">Effort Low</i></span></div>
    </div>,
  ],
}

const storyWire: DemoDef = {
  input: 'Discovery note · REQ-04', source: 'Auctor · org metadata',
  steps: ['Reading the discovery note…', 'Extracting the requirement and actors…', 'Drafting the user story and acceptance criteria…', 'Mapping fields to Salesforce objects…', 'Rendering the editable wireframe…'],
  blocks: [
    Story('US-118', 'Member case intake',
      <><b>As a</b> branch service rep, <b>I want</b> to log a member’s issue in one screen <b>so that</b> nothing falls through between the branch and the call center.</>,
      ['Case captures member, branch, type, and description in a single view.', 'Originating branch is required and stored on every case.', 'Submitting routes the case to the owning branch queue.'],
      ['REQ-04', 'D3 · Sprint 0', 'Story & Design Writer']),
    Wireframe('CASE', 'New Member Case', [['Status', 'New'], ['Priority', 'Medium'], ['Branch', '—'], ['Member', '—']],
      [{ label: 'Subject' }, { label: 'Member' }, { label: 'Case Type' }, { label: 'Branch ', warn: true, req: true }, { label: 'Description', full: true, tall: true }]),
  ],
}

const account: DemoDef = {
  input: 'Public filings + CRM + news', source: 'Claude + Hubbl · briefing',
  steps: ['Pulling company & CRM signals…', 'Scanning news & filings…', 'Mapping whitespace…', 'Drafting the recommended play…'],
  blocks: [
    H('Account briefing', 'Regional credit union · $4.2B assets'),
    Sec('Signals', Finds([
      { tone: 'n', b: 'Digital mandate', t: 'new CDO hired in Q2; board pushing member-experience modernization.' },
      { tone: 'a', b: 'Aging platform', t: 'core running on a heavily customized legacy org — scale risk.' },
      { tone: 'n', b: 'Expansion', t: 'two branch acquisitions closing this year.' }])),
    Sec('Whitespace', Bul([{ b: 'FSC for Wealth', t: '— no wealth workflow today.' }, { b: 'Service Cloud', t: '— case handling is still email-based.' }, { b: 'Data Cloud', t: '— no unified member profile.' }])),
    Note(<>Recommended play: <b>lead with a Digital Maturity Assessment</b> to anchor the modernization roadmap.</>),
  ],
}

const orgScan: DemoDef = {
  input: 'Salesforce org scan · Hubbl', source: 'Claude + Hubbl · readout',
  steps: ['Scanning org metadata…', 'Counting config & customization…', 'Flagging debt & risk…', 'Compiling the readout…'],
  blocks: [
    H('Org Scan Readout', 'Current-state snapshot'),
    Kpis([{ n: '1,240', l: 'Custom fields' }, { n: '86', l: 'Flows' }, { n: '34', l: 'Apex triggers' }, { n: '19%', l: 'Unused fields' }]),
    Sec('Findings', Finds([
      { tone: 'r', b: 'Trigger sprawl', t: 'multiple triggers per object — consolidate to one framework.' },
      { tone: 'a', b: 'Field bloat', t: '19% of fields unused in 12 months — candidates to retire.' },
      { tone: 'n', b: 'Security', t: 'sharing model is clean and audit-ready.' }])),
    Foot('Full inventory exported', 'Readout in days, not weeks'),
  ],
}

const preSales: DemoDef = {
  input: 'Discovery + scope + pricing', source: 'Claude Project · new-business',
  steps: ['Assembling discovery inputs…', 'Structuring the proposal…', 'Drafting scope & approach…', 'Pricing from the estimate…', 'Assembling the proposal…'],
  blocks: [
    H('Proposal', 'FSC for Wealth · Phase 1'),
    Sec('Executive summary', Bul(['Modernize member wealth onboarding on Financial Services Cloud, cutting onboarding from days to under an hour and unifying the member profile.'])),
    Sec('Approach', Bul([{ b: 'Discovery & design', t: '— 3 weeks' }, { b: 'Build · 2 sprints', t: '— 6 weeks' }, { b: 'UAT & go-live', t: '— 3 weeks' }])),
    Callout('40 → 14 days', 'Opportunity to proposal', '3× faster · Measured · Salesforce'),
    Foot('Scope · approach · commercials · team', 'Defensible, consistent basis'),
  ],
}

const rfp: DemoDef = {
  input: 'Client RFP · 60 questions', source: 'Auctor · answer library',
  steps: ['Parsing the RFP…', 'Matching to the answer library…', 'Drafting responses…', 'Building the compliance matrix…'],
  blocks: [
    H('RFP Response', '60 requirements'),
    Table('72px 1fr 78px', ['Req', 'Response', 'Comply'], [
      ['R-07', <>FSC configuration experience across 20+ wealth engagements.</>, Ch('Full', 'g')],
      ['R-18', <>SOC 2 Type II; data residency configurable per region.</>, Ch('Full', 'g')],
      ['R-23', <>Real-time core integration via MuleSoft; batch fallback.</>, Ch('Partial', 'a')],
    ]),
    Foot('54 Full · 6 Partial · 0 Gaps', 'First draft in 2 days'),
  ],
}

const sowRisk: DemoDef = {
  input: 'Draft SOW · 14 pages', source: 'Auctor · risk library',
  steps: ['Reading the SOW…', 'Checking against the risk library…', 'Flagging clauses…', 'Suggesting redlines…'],
  blocks: [
    H('SOW Risk Review', '14-page draft'),
    Table('1fr 70px 1fr', ['Clause', 'Risk', 'Suggested change'], [
      [<>Unbounded change requests</>, Ch('High', 'r'), <>Add a change-control process &amp; rate card.</>],
      [<>Acceptance “to client satisfaction”</>, Ch('High', 'r'), <>Tie to documented acceptance criteria.</>],
      [<>Net-60 payment terms</>, Ch('Med', 'a'), <>Move to Net-30 with milestone billing.</>],
    ]),
    Foot('3 high · 2 medium flagged', 'Reviewed in hours'),
  ],
}

const charter: DemoDef = {
  input: 'Kickoff inputs + SOW', source: 'Auctor',
  steps: ['Reading SOW & kickoff notes…', 'Framing objectives & scope…', 'Setting decision rights…', 'Assembling the charter…'],
  blocks: [
    H('Project Charter', 'FSC for Wealth · Phase 1'),
    Sec('Objectives', Bul(['Cut member wealth onboarding from 3 days to under 1 hour.', 'Single member profile across service and wealth.'])),
    Sec('Decision rights', Table('1fr 1fr', ['Decision', 'Owner'], [['Scope changes', <>Steering committee</>], ['Design sign-off', <>Client product owner</>], ['Go / no-go', <>Executive sponsor</>]])),
    Sec('Milestones', Timeline([{ tt: 'Wk 3', t: 'Design complete' }, { tt: 'Wk 9', t: 'Build complete' }, { tt: 'Wk 12', t: 'Go-live' }])),
  ],
}

const solDesign: DemoDef = {
  input: 'Approved requirements', source: 'Auctor · build-ready',
  steps: ['Reading the requirements…', 'Selecting components & patterns…', 'Designing the data model…', 'Documenting decisions…'],
  blocks: [
    H('Solution Design', 'Member Case Management'),
    Sec('Components', Table('90px 1fr', ['Layer', 'Approach'], [['UI', <>Lightning record page + quick action</>], ['Automation', <>Flow for routing; no Apex</>], ['Data', <>Case + custom Branch lookup</>], ['Integration', <>Platform event to core</>]])),
    Note(<><b>Decision:</b> configuration over code — routing via Flow keeps it admin-maintainable.</>),
    Foot('Build-ready before Sprint 1', 'Every decision documented'),
  ],
}

const archOverview: DemoDef = {
  input: 'Systems + integration inventory', source: 'Auctor',
  steps: ['Mapping systems…', 'Tracing integrations…', 'Capturing NFRs…', 'Assembling the overview…'],
  blocks: [
    H('Architecture Overview', 'System landscape'),
    Sec('Integrations', Table('1fr 92px 1fr', ['System', 'Mode', 'Data'], [['Core banking', Ch('Real-time', 't'), <>Member, accounts</>], ['MDM', Ch('Batch', 'n'), <>Golden profile</>], ['Marketing', Ch('Event', 't'), <>Consent, activity</>]])),
    Sec('Non-functional', Bul([{ b: 'Availability', t: '99.9%' }, { b: 'Data residency', t: 'in-region' }, { b: 'Auditability', t: 'field history + event log' }])),
  ],
}

const runbook: DemoDef = {
  input: 'Release scope + environments', source: 'Auctor · cutover',
  steps: ['Sequencing the cutover…', 'Setting rollback triggers…', 'Assigning owners…', 'Assembling the runbook…'],
  blocks: [
    H('Deployment Runbook', 'Go-live cutover'),
    Sec('Cutover timeline', Timeline([{ tt: 'T-1d', t: 'Freeze & final data sync' }, { tt: '20:00', t: 'Deploy package + config' }, { tt: '21:30', t: 'Smoke tests & validation' }, { tt: '22:00', t: 'Go / no-go decision' }, { tt: 'T+1', t: 'Hypercare begins' }])),
    Note(<><b>Rollback trigger:</b> any P1 defect or smoke-test failure → revert package, restore data snapshot (≤30 min).</>),
  ],
}

const qaTest: DemoDef = {
  input: 'User stories · Sprint 3', source: 'Auctor · Salesforce-aware',
  steps: ['Reading the stories…', 'Deriving scenarios…', 'Writing steps & expected results…', 'Covering edge & negative cases…'],
  blocks: [
    H('Test cases', 'US-118 · Member case intake'),
    Table('66px 1fr 1fr', ['ID', 'Scenario', 'Expected'], [
      ['TC-01', <>Create case with all fields</>, <>Case saved; routed to branch queue</>],
      ['TC-02', <>Submit without Branch</>, <>Blocked; “Branch required” error</>],
      ['TC-03', <>Duplicate member + subject</>, <>Warn; allow with override</>],
    ]),
    Foot('14 cases · happy, edge, negative', 'Regression-ready'),
  ],
}

const status: DemoDef = {
  input: 'Live project systems', source: 'Auctor · branded',
  steps: ['Pulling status from systems…', 'Summarizing progress…', 'Surfacing risks…', 'Formatting the report…'],
  blocks: [
    H('Weekly Status', 'Week 6 of 12'),
    RAG([{ k: 'Overall', chip: Ch('On track', 'g') }, { k: 'Scope', chip: Ch('On track', 'g') }, { k: 'Schedule', chip: Ch('Watch', 'a') }, { k: 'Budget', chip: Ch('On track', 'g') }]),
    Sec('This week', Bul(['Sprint 3 shipped: case intake + routing.', 'UAT environment stood up.'])),
    Sec('Risks', Finds([{ tone: 'a', b: 'Integration test data', t: 'core sandbox refresh slipping — mitigating with a masked extract.' }])),
  ],
}

const dashboard: DemoDef = {
  input: 'Integrated delivery data', source: 'Auctor · live',
  steps: ['Connecting to project systems…', 'Aggregating metrics…', 'Rendering charts…', 'Publishing the view…'],
  blocks: [
    H('Project Overview', 'Live · refreshed 2 min ago'),
    Kpis([{ n: '86%', l: 'On track' }, { n: '6/8', l: 'Sprints done' }, { n: '12', l: 'Open risks' }, { n: '94%', l: 'Velocity' }]),
    BarChart([55, 72, 48, 83, 66, 90, 77]),
    RAG([{ k: 'Discovery', chip: Ch('Complete', 'g') }, { k: 'Design', chip: Ch('Complete', 'g') }, { k: 'Build', chip: Ch('In progress', 'a') }, { k: 'UAT', chip: Ch('Upcoming', 'n') }]),
  ],
}

const userStory: DemoDef = {
  input: 'Requirements · Member Services', source: 'Auctor',
  steps: ['Reading requirements…', 'Splitting into stories…', 'Writing acceptance criteria…', 'Grooming the backlog…'],
  blocks: [
    Story('US-118', 'Member case intake',
      <><b>As a</b> branch rep, <b>I want</b> to log a member’s issue in one screen <b>so that</b> nothing falls through.</>,
      ['One-screen capture of member, branch, type, description.', 'Branch is required on every case.'], ['Must', 'D4 · Build']),
    Story('US-119', 'Route to owning branch',
      <><b>As a</b> branch manager, <b>I want</b> new cases to land in my branch’s queue <b>so that</b> my team owns follow-up.</>,
      ['Case routes to the originating branch queue on submit.', 'Reassignment is logged.'], ['Should', 'D4 · Build']),
  ],
}

const uiMock: DemoDef = {
  input: 'Described screen · Financial Account', source: 'Claude · Lightning components',
  steps: ['Reading the described screen…', 'Selecting Lightning components…', 'Laying out fields & sections…', 'Rendering the mock…'],
  blocks: [
    Wireframe('FIN ACCT', 'Wealth Account — J. Rivera', [['Type', 'Investment'], ['Status', 'Active'], ['Balance', '$248,900'], ['Advisor', '—']],
      [{ label: 'Account name' }, { label: 'Primary owner' }, { label: 'Risk profile' }, { label: 'Advisor ', warn: true, req: true }, { label: 'Notes', full: true, tall: true }]),
  ],
}

// ---------- registry --------------------------------------------------------
const DEMOS: Record<string, DemoDef> = {
  'Business Requirements Document': brd,
  'Estimating Factory': est,
  'Digital Maturity Assessment': dma,
  'Story & Design Writer': storyWire,
  'Account Intelligence': account,
  'Org Scan Readout': orgScan,
  'Pre-Sales Factory': preSales,
  'RFP Response Engine': rfp,
  'SOW Risk Review': sowRisk,
  'Project Charter & Governance': charter,
  'Solution Design': solDesign,
  'Architecture Overview': archOverview,
  'Deployment Runbook': runbook,
  'QA Test Writer': qaTest,
  'Weekly Status Report': status,
  'Live Project Overview Dashboard': dashboard,
  'User Story Writer': userStory,
  'Salesforce UI Mock-Up': uiMock,
}

export function getDemo(item: EcoItem): DemoDef | null {
  return DEMOS[item.name] || null
}

// ---- the runner ------------------------------------------------------------
const STEP_MS = 600

export function DemoRunner({ item }: { item: EcoItem }) {
  const demo = getDemo(item)!
  const [cur, setCur] = useState(0)
  const [running, setRunning] = useState(true)
  const timers = useRef<number[]>([])

  const clear = () => { timers.current.forEach(t => clearTimeout(t)); timers.current = [] }

  const start = () => {
    clear()
    setRunning(true); setCur(0)
    demo.steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setCur(i), i * STEP_MS)))
    timers.current.push(window.setTimeout(() => { setCur(demo.steps.length); setRunning(false) }, demo.steps.length * STEP_MS))
  }

  useEffect(() => { start(); return clear /* eslint-disable-line */ }, [item.name])

  const done = !running && cur >= demo.steps.length
  const total = demo.steps.length
  const revealed = done ? demo.blocks.length : Math.round((cur / total) * demo.blocks.length)
  const pct = Math.round((Math.min(cur, total) / total) * 100)

  return (
    <div className="wiw demo">
      <div className="demo-grid">
        <div className="demo-side">
          <div className="wiw-label">Input</div>
          <div className="note"><p>{demo.input}</p><div className="note-meta">Source · {demo.source}</div></div>
          <div className="gensteps">
            {demo.steps.map((s, i) => (
              <div className={`gstep ${i < cur ? 'done' : i === cur && running ? 'active' : ''}`} key={i}>
                <span className="gi">{i < cur ? '✓' : (i === cur && running ? <span className="spin" /> : '')}</span>
                <span className="gt">{s}</span>
              </div>
            ))}
          </div>
          <div className="wiw-progress"><span style={{ width: `${pct}%` }} /></div>
          {done && <button className="wiw-btn sm" onClick={start}>↻ Run it again</button>}
        </div>
        <div className="demo-out">
          <div className="demo-out-h">{done ? <span className="doneflag">Generated</span> : <span className="genflag"><span className="spin" /> Generating…</span>}</div>
          <div className="demo-art">
            {demo.blocks.slice(0, revealed).map((b, i) => <div className="rv" key={i}>{b}</div>)}
            {revealed === 0 && <div className="demo-empty">Assembling {item.name}…</div>}
          </div>
        </div>
      </div>
      <p className="wiw-foot">Illustrative of what {item.name} produces. On a real project it runs on your own data and org.</p>
    </div>
  )
}
