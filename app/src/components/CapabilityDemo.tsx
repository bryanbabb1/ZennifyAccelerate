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
const Spark = (pts: number[], up = true) => {
  const w = 58, h = 18, max = Math.max(...pts), min = Math.min(...pts)
  const d = pts.map((p, i) => `${((i / (pts.length - 1)) * w).toFixed(1)},${(h - ((p - min) / ((max - min) || 1)) * h).toFixed(1)}`).join(' ')
  return <svg className="spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h}><polyline points={d} fill="none" stroke={up ? 'var(--z-teal)' : 'var(--z-orange)'} strokeWidth="1.5" strokeLinejoin="round" /></svg>
}
const Completion = () => {
  const w = 240, h = 92, act = [4, 12, 22, 30, 41, 50, 62, 71, 80]
  const ax = act.map((v, i) => `${((i / (act.length - 1)) * w).toFixed(0)},${(h - (v / 88) * h).toFixed(0)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" preserveAspectRatio="none" style={{ height: 92 }}>
      <polyline points={`0,${h - 2} ${w},4`} fill="none" stroke="var(--z-purple-lt)" strokeWidth="1.5" strokeDasharray="4 3" />
      <polyline points={ax} fill="none" stroke="var(--z-teal)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
const Donut = (val: number) => {
  const r = 30, C = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 76 76" width="76" height="76">
      <circle cx="38" cy="38" r={r} fill="none" stroke="#e6ebf4" strokeWidth="8" />
      <circle cx="38" cy="38" r={r} fill="none" stroke="var(--z-teal)" strokeWidth="8" strokeDasharray={C} strokeDashoffset={C * (1 - val / 100)} strokeLinecap="round" transform="rotate(-90 38 38)" />
      <text x="38" y="43" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--z-dark)">{val}</text>
    </svg>
  )
}
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
type WField = { label: string; val?: string; warn?: boolean; req?: boolean; full?: boolean; tall?: boolean }
const Wireframe = (
  obj: string, title: string, path: string[], cur: number, hl: [string, string][],
  fields: WField[], activity: { t: string; s: string }[], related: { r: string; s: string }[],
) => (
  <div className="lwf2">
    <div className="lwf-top"><span className="lwf-obj">{obj}</span><span className="lwf-title">{title}</span>
      <span className="lwf-pills"><i>Edit</i><i>Clone</i><i className="p">Save</i></span></div>
    <div className="lwf-path">{path.map((p, i) => <span key={i} className={`pchev ${i < cur ? 'done' : i === cur ? 'cur' : ''}`}>{p}</span>)}</div>
    <div className="lwf-hl">{hl.map(([k, v], i) => <div key={i}><span>{k}</span><b>{v}</b></div>)}</div>
    <div className="lwf-tabs"><span className="on">Details</span><span>Related</span><span>Activity</span></div>
    <div className="lwf-body">
      <div className="lwf-form">{fields.map((f, i) => (
        <div className={`lwf-f ${f.warn ? 'warn' : ''} ${f.full ? 'full' : ''}`} key={i}>
          <span>{f.label}{f.req ? <em>required</em> : null}</span>
          {f.val ? <div className="inv">{f.val}</div> : <div className={`in ${f.tall ? 'tall' : ''}`} />}
        </div>))}</div>
      <div className="lwf-side">
        <div className="lwf-card"><div className="lc-h">Activity</div>{activity.map((a, i) => <div className="lc-act" key={i}><b>{a.t}</b><span>{a.s}</span></div>)}</div>
        <div className="lwf-card"><div className="lc-h">Related</div>{related.map((r, i) => <div className="lc-rel" key={i}><span>{r.r}</span><span className="lc-s">{r.s}</span></div>)}</div>
      </div>
    </div>
  </div>
)

// ==================== the demos ============================================
const brd: DemoDef = {
  input: '4 discovery workshops · Member Services', source: 'Auctor · traceable to objectives',
  steps: ['Ingesting 4 workshop transcripts…', 'Clustering needs into requirements…', 'Writing acceptance criteria…', 'Tracing each to a business objective…', 'Assembling the BRD…'],
  blocks: [
    <div className="docx-title"><div className="dx-eyebrow">Business Requirements Document</div>
      <b>Member Case Management</b>
      <div className="dx-meta"><span>Regional Credit Union</span><span>Version 1.0</span><span>Prepared by Zennify</span></div></div>,
    <div className="docx-sec"><h5>1 · Overview</h5>
      <p>Member issues raised at a branch are logged across three disconnected systems, and the originating branch
        is frequently lost — breaking follow-up. This document defines the requirements for a single-screen case
        intake on Financial Services Cloud that captures, routes, and reports every member case against a defined
        set of business objectives.</p></div>,
    <div className="docx-sec"><h5>2 · Functional requirements</h5>
      <div className="rtbl">
        <div className="rr head"><span>ID</span><span>Requirement &amp; acceptance</span><span>Pri</span><span>Traces</span></div>
        <div className="rr"><span className="rid">REQ-012</span><span><b>Single-screen case intake.</b> Capture member, branch, type, and description in one view. <em>Accept:</em> a case is created with zero navigation.</span><span><i className="ch d">Must</i></span><span className="tr">O2</span></div>
        <div className="rr"><span className="rid">REQ-014</span><span><b>Capture originating branch.</b> <em>Accept:</em> branch is required, stored on the record, and reportable.</span><span><i className="ch d">Must</i></span><span className="tr">O3</span></div>
        <div className="rr"><span className="rid">REQ-019</span><span><b>Duplicate detection.</b> <em>Accept:</em> warn on member + subject match within 24h; allow override.</span><span><i className="ch g">Should</i></span><span className="tr">O1</span></div>
        <div className="rr"><span className="rid">REQ-021</span><span><b>Auto-route to branch queue.</b> <em>Accept:</em> on submit, the case reaches the owning branch’s queue within one minute.</span><span><i className="ch d">Must</i></span><span className="tr">O2</span></div>
        <div className="rr"><span className="rid">REQ-027</span><span><b>SLA clock.</b> <em>Accept:</em> a 4-hour response timer starts on creation and surfaces on the record.</span><span><i className="ch g">Should</i></span><span className="tr">O1</span></div>
      </div></div>,
    <div className="docx-sec"><h5>3 · Traceability</h5>
      <div className="tracechips">
        <span><b>O1</b> Faster resolution · 9 reqs</span>
        <span><b>O2</b> No dropped cases · 12 reqs</span>
        <span><b>O3</b> Branch reporting · 6 reqs</span>
      </div></div>,
    <div className="doc-foot"><span>27 requirements · 100% traced to objectives</span><span className="tick">Signed-off draft in 3 days</span></div>,
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
    Wireframe('CASE', 'New Member Case',
      ['New', 'In progress', 'Escalated', 'Resolved', 'Closed'], 0,
      [['Status', 'New'], ['Priority', 'Medium'], ['Branch', '—'], ['Member', 'J. Rivera']],
      [{ label: 'Subject', val: 'Debit card declined at branch' }, { label: 'Member', val: 'J. Rivera' },
        { label: 'Case Type', val: 'Service request' }, { label: 'Branch ', warn: true, req: true },
        { label: 'Description', full: true, tall: true, val: 'Member reports card declined despite sufficient funds; needs urgent resolution.' }],
      [{ t: 'Case created', s: 'by S. Chen · just now' }, { t: 'Auto-assigned', s: 'Downtown branch queue' }, { t: 'SLA started', s: '4h response target' }],
      [{ r: 'Member · J. Rivera', s: '3 open cases' }, { r: 'Account · ****4821', s: 'Checking' }]),
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
    H('Architecture Overview', 'Target-state system landscape'),
    <div className="archdiag">
      <svg viewBox="0 0 640 300" width="100%" preserveAspectRatio="xMidYMid meet">
        {/* connectors first (under boxes) */}
        <g stroke="var(--z-slate)" strokeWidth="1.5" fill="none">
          <line x1="320" y1="76" x2="320" y2="120" />
          <line x1="320" y1="172" x2="105" y2="212" /><line x1="320" y1="172" x2="320" y2="212" /><line x1="320" y1="172" x2="535" y2="212" />
          <line x1="470" y1="50" x2="500" y2="50" strokeDasharray="4 3" />
        </g>
        <g className="al" fontSize="8" fill="var(--z-slate)">
          <text x="326" y="100">sync</text><text x="180" y="196">real-time</text><text x="326" y="196">event</text><text x="470" y="196">batch</text>
        </g>
        {/* experience layer */}
        <g>
          <rect x="170" y="22" width="300" height="54" rx="6" fill="var(--z-teal)" />
          <text x="320" y="45" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">Experience · Salesforce FSC</text>
          <text x="320" y="63" textAnchor="middle" fill="#eafaf7" fontSize="10">Service · Wealth · Member 360</text>
        </g>
        {/* data cloud */}
        <g>
          <rect x="500" y="24" width="120" height="50" rx="6" fill="var(--z-teal-light)" />
          <text x="560" y="46" textAnchor="middle" fill="var(--z-dark)" fontSize="11" fontWeight="700">Data Cloud</text>
          <text x="560" y="62" textAnchor="middle" fill="var(--z-dark)" fontSize="9">Unified profile</text>
        </g>
        {/* integration layer */}
        <g>
          <rect x="170" y="120" width="300" height="52" rx="6" fill="var(--z-dark)" />
          <text x="320" y="143" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700">Integration · MuleSoft</text>
          <text x="320" y="160" textAnchor="middle" fill="rgba(255,255,255,.75)" fontSize="9">API-led · events · orchestration</text>
        </g>
        {/* systems row */}
        {[['Core banking', 20], ['MDM', 235], ['Marketing', 450]].map(([n, x]) => (
          <g key={n as string}>
            <rect x={x as number} y="212" width="170" height="54" rx="6" fill="#fff" stroke="var(--z-purple-lt)" />
            <text x={(x as number) + 85} y="236" textAnchor="middle" fill="var(--z-dark)" fontSize="11" fontWeight="700">{n}</text>
            <text x={(x as number) + 85} y="252" textAnchor="middle" fill="var(--z-slate)" fontSize="9">system of record</text>
          </g>
        ))}
      </svg>
    </div>,
    <div className="arch-nfr"><span className="nfr-l">Non-functional</span>
      <span>Availability <b>99.9%</b></span><span>Data residency <b>in-region</b></span><span>Audit <b>field history + event log</b></span></div>,
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
    <div className="db-head"><b>Project Overview</b><span className="db-live"><i />Live · refreshed 2 min ago</span></div>,
    <div className="db-tiles">
      {[{ n: '86%', l: 'On track', d: '+4', up: true, s: [70, 74, 78, 80, 82, 86] },
        { n: '6/8', l: 'Sprints done', d: 'on plan', up: true, s: [1, 2, 3, 4, 5, 6] },
        { n: '12', l: 'Open risks', d: '-3', up: true, s: [18, 17, 15, 14, 13, 12] },
        { n: '94%', l: 'Velocity', d: '+6', up: true, s: [80, 84, 88, 90, 92, 94] }].map((t, i) => (
        <div className="db-tile" key={i}>
          <div className="dt-top"><div className="dt-n">{t.n}</div>{Spark(t.s, t.up)}</div>
          <div className="dt-l">{t.l}<i className={t.d.startsWith('-') || t.up ? 'up' : 'down'}>{t.d}</i></div>
        </div>))}
    </div>,
    <div className="db-charts">
      <div className="db-card"><div className="dbc-h">Completion vs plan <span>wk 6 of 12</span></div><Completion /></div>
      <div className="db-card health"><div className="dbc-h">Health score</div><div className="db-donut">{Donut(86)}<span className="hgood">On track</span></div></div>
    </div>,
    <div className="db-ws">
      {[['Discovery', 100, 'g', 'Complete'], ['Design', 100, 'g', 'Complete'], ['Build', 62, 'a', 'In progress'], ['UAT', 0, 'n', 'Upcoming']].map((r, i) => (
        <div className="wsr" key={i}><span className="wsn">{r[0] as string}</span>
          <span className="wsbar"><i style={{ width: `${r[1] as number}%` }} /></span>
          <span className="wsp">{r[1] as number}%</span><i className={`ch ${r[2]}`}>{r[3] as string}</i></div>))}
    </div>,
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
    Wireframe('FIN ACCT', 'Wealth Account — J. Rivera',
      ['Prospect', 'Onboarding', 'Funded', 'Active', 'Review'], 3,
      [['Type', 'Investment'], ['Status', 'Active'], ['Balance', '$248,900'], ['Advisor', '—']],
      [{ label: 'Account name', val: 'Rivera Family Trust' }, { label: 'Primary owner', val: 'J. Rivera' },
        { label: 'Risk profile', val: 'Moderate' }, { label: 'Advisor ', warn: true, req: true },
        { label: 'Notes', full: true, tall: true, val: 'Rollover from prior custodian complete; schedule Q3 review.' }],
      [{ t: 'Funded', s: '$248,900 · 2 days ago' }, { t: 'KYC complete', s: 'verified' }, { t: 'Opened', s: 'by M. Lee' }],
      [{ r: 'Holdings', s: '12 positions' }, { r: 'Beneficiaries', s: '2 listed' }]),
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
