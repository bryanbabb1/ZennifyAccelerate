import { ReactNode, useEffect, useRef, useState } from 'react'
import { EcoItem } from '../data/ecosystem'

/* ------------------------------------------------------------------ *
 * Capability "See it in action" demos.
 * These are HAND-AUTHORED per capability — each shows real, specific,
 * recognizable output (not a generic skeleton). A demo only exists for
 * a capability that's in the DEMOS registry below; everything else has
 * no "See it in action" button. Quality over coverage — we grow the set
 * deliberately. The generation choreography is theater; the payload is
 * the point.
 * ------------------------------------------------------------------ */

export type DemoDef = { input: string; source: string; steps: string[]; blocks: ReactNode[] }

// ---------- Business Requirements Document ----------------------------------
const brd: DemoDef = {
  input: '4 discovery workshops · Member Services',
  source: 'Auctor · traceable to objectives',
  steps: [
    'Ingesting 4 workshop transcripts…',
    'Clustering needs into requirements…',
    'Writing acceptance criteria…',
    'Tracing each to a business objective…',
    'Assembling the BRD…',
  ],
  blocks: [
    <div className="doc-h"><b>Business Requirements Document</b><span>Member Case Management</span></div>,
    <div className="reqtbl">
      <div className="reqrow head"><span>ID</span><span>Requirement</span><span>Priority</span></div>
      <div className="reqrow">
        <span className="rid">REQ-012</span>
        <span><b>Single-screen case intake.</b> Rep captures member, branch, type, and description without leaving the page.
          <em>Accept:</em> a case is created from one view with zero navigation.</span>
        <span><i className="pr must">Must</i></span>
      </div>
      <div className="reqrow">
        <span className="rid">REQ-014</span>
        <span><b>Capture originating branch on every case.</b>
          <em>Accept:</em> branch is required, stored on the record, and reportable.</span>
        <span><i className="pr must">Must</i></span>
      </div>
      <div className="reqrow">
        <span className="rid">REQ-021</span>
        <span><b>Auto-route to the branch queue.</b>
          <em>Accept:</em> on submit, the case reaches the owning branch’s queue within one minute.</span>
        <span><i className="pr should">Should</i></span>
      </div>
    </div>,
    <div className="trace">Every requirement links to <b>Objective O2 — reduce follow-up leakage</b> (target: 0 dropped cases).</div>,
    <div className="doc-foot"><span>27 requirements · 100% traced to objectives</span><span className="tick">Signed-off draft in 3 days</span></div>,
  ],
}

// ---------- Estimating Factory ----------------------------------------------
const est: DemoDef = {
  input: 'Scope: FSC for Wealth · Phase 1',
  source: 'Salesforce · 120 comparable projects',
  steps: [
    'Parsing scope & assumptions…',
    'Matching 12 comparable engagements…',
    'Estimating by workstream…',
    'Applying risk & confidence bands…',
    'Reconciling against actuals…',
  ],
  blocks: [
    <div className="doc-h"><b>Effort estimate</b><span>FSC for Wealth · Phase 1</span></div>,
    <div className="esttbl">
      <div className="estrow head"><span>Workstream</span><span>Hours</span><span>Confidence</span></div>
      <div className="estrow"><span>Configuration</span><span className="h">180</span><span><i className="cf hi">High</i></span></div>
      <div className="estrow"><span>Data migration</span><span className="h">90</span><span><i className="cf md">Medium</i></span></div>
      <div className="estrow"><span>Integrations</span><span className="h">140</span><span><i className="cf md">Medium</i></span></div>
      <div className="estrow"><span>Testing &amp; UAT</span><span className="h">80</span><span><i className="cf hi">High</i></span></div>
      <div className="estrow"><span>PM &amp; governance</span><span className="h">60</span><span><i className="cf hi">High</i></span></div>
      <div className="estrow total"><span>Total</span><span className="h">550</span><span>hours</span></div>
    </div>,
    <div className="estvar"><div className="ev-n">±1%</div>
      <div className="ev-t"><b>Estimate vs actuals on comparable work</b><span>within ~1% variance over the last 6 months · Measured · Salesforce</span></div></div>,
    <div className="doc-foot"><span>Benchmarked against 12 comparable FSC engagements</span><span className="tick">Defensible in the SOW</span></div>,
  ],
}

// ---------- Digital Maturity Assessment -------------------------------------
const Bar = ({ label, score }: { label: string; score: number }) => (
  <div className="mbar"><span className="ml">{label}</span>
    <span className="mt"><i style={{ width: `${score}%` }} /></span><b className="mv">{score}</b></div>
)
const dma: DemoDef = {
  input: 'Org scan + stakeholder inputs',
  source: 'Web app · scored across 6 dimensions',
  steps: [
    'Scanning the Salesforce org…',
    'Scoring across 6 dimensions…',
    'Benchmarking to peers…',
    'Prioritizing recommendations…',
  ],
  blocks: [
    <div className="dma-top"><div className="doc-h nofill"><b>Digital Maturity Assessment</b></div>
      <span className="tier">Developing · Tier 2 of 5</span></div>,
    <div className="mbars">
      <Bar label="Data foundation" score={62} />
      <Bar label="Customer experience" score={48} />
      <Bar label="Automation" score={55} />
      <Bar label="AI readiness" score={34} />
      <Bar label="Integration" score={51} />
      <Bar label="Governance" score={67} />
    </div>,
    <div className="recs">
      <div className="rec-l">Prioritized next moves</div>
      <div className="rec"><span>Consolidate the data model</span><span className="rc"><i className="ri hi">Impact High</i><i className="re md">Effort Med</i></span></div>
      <div className="rec"><span>Stand up an AI-ready data pipeline</span><span className="rc"><i className="ri hi">Impact High</i><i className="re hi">Effort High</i></span></div>
      <div className="rec"><span>Automate service intake</span><span className="rc"><i className="ri md">Impact Med</i><i className="re lo">Effort Low</i></span></div>
    </div>,
  ],
}

// ---------- Story & Design Writer (story + wireframe) -----------------------
const storyCard = (
  <div className="storycard">
    <div className="sc-head"><span className="sc-key">US-118</span> Member case intake<span className="sc-done">Generated</span></div>
    <p className="sc-story"><b>As a</b> branch service rep, <b>I want</b> to log a member’s issue in one screen <b>so that</b> nothing falls through between the branch and the call center.</p>
    <div className="sc-ac-l">Acceptance criteria</div>
    <ul className="sc-ac">
      <li>Case captures member, branch, type, and description in a single view.</li>
      <li>Originating branch is required and stored on every case.</li>
      <li>Submitting routes the case to the owning branch queue.</li>
    </ul>
    <div className="sc-chips"><span>REQ-04</span><span>D3 · Sprint 0</span><span>Story &amp; Design Writer</span></div>
  </div>
)
const wireframe = (
  <div className="lwf">
    <div className="lwf-top"><span className="lwf-obj">CASE</span><span className="lwf-title">New Member Case</span>
      <span className="lwf-pills"><i>Edit</i><i>Escalate</i><i className="p">Save</i></span></div>
    <div className="lwf-hl">
      <div><span>Status</span><b>New</b></div><div><span>Priority</span><b>Medium</b></div>
      <div><span>Branch</span><b>—</b></div><div><span>Member</span><b>—</b></div>
    </div>
    <div className="lwf-tabs"><span className="on">Details</span><span>Related</span><span>Activity</span></div>
    <div className="lwf-form">
      <div className="lwf-f"><span>Subject</span><div className="in" /></div>
      <div className="lwf-f"><span>Member</span><div className="in" /></div>
      <div className="lwf-f"><span>Case Type</span><div className="in" /></div>
      <div className="lwf-f warn"><span>Branch <em>required</em></span><div className="in" /></div>
      <div className="lwf-f full"><span>Description</span><div className="in tall" /></div>
    </div>
  </div>
)
const storyWire: DemoDef = {
  input: 'Discovery note · REQ-04',
  source: 'Auctor · org metadata',
  steps: [
    'Reading the discovery note…',
    'Extracting the requirement and actors…',
    'Drafting the user story and acceptance criteria…',
    'Mapping fields to Salesforce objects…',
    'Rendering the editable wireframe…',
  ],
  blocks: [storyCard, wireframe],
}

// ---------- registry --------------------------------------------------------
const DEMOS: Record<string, DemoDef> = {
  'Business Requirements Document': brd,
  'Estimating Factory': est,
  'Digital Maturity Assessment': dma,
  'Story & Design Writer': storyWire,
}

export function getDemo(item: EcoItem): DemoDef | null {
  return DEMOS[item.name] || null
}

// ---- the runner ------------------------------------------------------------
const STEP_MS = 620

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
