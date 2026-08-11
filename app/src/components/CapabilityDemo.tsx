import { ReactNode, useEffect, useRef, useState } from 'react'
import { EcoItem } from '../data/ecosystem'

/* ------------------------------------------------------------------ *
 * Capability "See it in action" demos.
 * Each capability that produces a tangible artifact maps to an archetype
 * (document, deck, dashboard, assessment, story+wireframe, wireframe).
 * A demo is choreographed, not a live model call: an earned-progress
 * checklist plays on timers while the artifact builds block-by-block.
 * ------------------------------------------------------------------ */

type Arch = 'storywire' | 'wire' | 'doc' | 'deck' | 'dash' | 'assess'
export type DemoDef = { input: string; source: string; steps: string[]; blocks: ReactNode[] }

const skip = [
  'brand guidelines', 'next skill recommender', 'deal desk', 'delivery command center',
  'framework sync', 'drive re-sync', 'session auto mapping', 'pulse collector',
  'documentation lookup', 'solution architect assistant', 'listening', 'meeting notes',
]

function archFor(item: EcoItem): Arch | null {
  const n = item.name.toLowerCase()
  if (['Tool', 'Platform', 'MCP'].includes(item.kind)) return null
  if (skip.some(s => n.includes(s))) return null
  if (n.includes('story') && n.includes('design')) return 'storywire'
  if (n.includes('mock') || n.includes('wireframe') || n.includes('ui ') || n.includes('interactive')) return 'wire'
  if (n.includes('dashboard') || n.includes('tracker') || n.includes('overview dashboard')) return 'dash'
  if (n.includes('deck') || n.includes('review') || n.includes('committee') || n.includes('demo') || n.includes('recap')) return 'deck'
  if (n.includes('assessment') || n.includes('scan') || n.includes('health check') || n.includes('gap analysis') || n.includes('readout') || n.includes('maturity') || n.includes('advisor')) return 'assess'
  return 'doc'
}

// ---- small building blocks -------------------------------------------------
const Ln = ({ w }: { w: number }) => <div className="ln" style={{ width: `${w}%` }} />

function docDemo(item: EcoItem): DemoDef {
  return {
    input: 'Project discovery + requirements',
    source: `${item.built || 'Auctor'} · Zennify template`,
    steps: [
      'Reading discovery notes & requirements…',
      `Outlining the ${item.name}…`,
      'Drafting sections…',
      'Applying the Zennify template & voice…',
      'Running brand & completeness QA…',
    ],
    blocks: [
      <div className="doc-h"><b>{item.name}</b><span>Zennify · client-ready</span></div>,
      <div className="doc-sec"><h5>Overview</h5><Ln w={100} /><Ln w={94} /><Ln w={88} /></div>,
      <div className="doc-sec"><h5>Key points</h5>
        <ul className="doc-b"><li>Scope and objectives agreed and traceable</li>
          <li>Decisions and owners captured</li><li>Acceptance criteria defined</li></ul></div>,
      <div className="doc-sec"><h5>Detail</h5><Ln w={97} /><Ln w={91} /><Ln w={96} /><Ln w={70} /></div>,
      <div className="doc-foot"><span>v1.0</span><span className="tick">On Zennify standard</span></div>,
    ],
  }
}

function deckDemo(item: EcoItem): DemoDef {
  return {
    input: 'Live project status + narrative',
    source: `${item.built || 'Auctor'} · brand deck`,
    steps: [
      'Pulling status & data from project systems…',
      'Structuring the narrative…',
      'Building slides…',
      'Applying the Zennify brand…',
      'Finalizing the deck…',
    ],
    blocks: [
      <div className="slide title"><div className="s-eyebrow">{item.name}</div><b>Executive readout</b><Ln w={40} /></div>,
      <div className="deck-row">
        <div className="slide"><div className="s-h" /><Ln w={90} /><Ln w={80} /><Ln w={60} /></div>
        <div className="slide"><div className="s-h" /><div className="s-chart"><i style={{ height: '40%' }} /><i style={{ height: '70%' }} /><i style={{ height: '55%' }} /><i style={{ height: '90%' }} /></div></div>
        <div className="slide"><div className="s-h" /><Ln w={85} /><Ln w={70} /><Ln w={78} /></div>
      </div>,
    ],
  }
}

function dashDemo(item: EcoItem): DemoDef {
  return {
    input: 'Live integration + project data',
    source: `${item.built || 'Auctor'} · live data`,
    steps: [
      'Connecting to live project systems…',
      'Aggregating metrics…',
      'Rendering charts…',
      'Assembling the dashboard…',
    ],
    blocks: [
      <div className="kpis">
        <div className="kpi"><div className="kn">86%</div><div className="kl">On track</div></div>
        <div className="kpi"><div className="kn">12</div><div className="kl">Open risks</div></div>
        <div className="kpi"><div className="kn">94%</div><div className="kl">Velocity</div></div>
        <div className="kpi"><div className="kn">$1.2M</div><div className="kl">Budget used</div></div>
      </div>,
      <div className="dash-chart"><i style={{ height: '55%' }} /><i style={{ height: '72%' }} /><i style={{ height: '48%' }} /><i style={{ height: '83%' }} /><i style={{ height: '66%' }} /><i style={{ height: '90%' }} /><i style={{ height: '77%' }} /></div>,
      <div className="dash-tbl">
        {['Discovery', 'Design', 'Build', 'UAT'].map((r, i) =>
          <div className="tr" key={i}><span>{r}</span><span className={`pill ${i < 2 ? 'g' : i < 3 ? 'a' : 'n'}`}>{i < 2 ? 'Complete' : i < 3 ? 'In progress' : 'Upcoming'}</span></div>)}
      </div>,
    ],
  }
}

function assessDemo(item: EcoItem): DemoDef {
  const R = 34, C = 2 * Math.PI * R
  return {
    input: 'Org scan + current-state data',
    source: `${item.built || 'Auctor'} · readout`,
    steps: [
      'Scanning the org & environment…',
      'Scoring across dimensions…',
      'Identifying gaps & risks…',
      'Compiling the readout…',
    ],
    blocks: [
      <div className="assess-top">
        <svg className="ring" viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r={R} fill="none" stroke="#e6ebf4" strokeWidth="8" />
          <circle cx="40" cy="40" r={R} fill="none" stroke="var(--z-teal)" strokeWidth="8"
            strokeDasharray={C} strokeDashoffset={C * (1 - 0.72)} strokeLinecap="round" transform="rotate(-90 40 40)" />
          <text x="40" y="45" textAnchor="middle" className="ring-t">72</text>
        </svg>
        <div className="assess-lead"><b>Maturity score</b><span>Solid foundation, focused gaps to close.</span></div>
      </div>,
      <div className="findings">
        <div className="finding"><span className="dot a" /><div><b>Data model</b> — some over-customization to unwind before scale.</div></div>
        <div className="finding"><span className="dot n" /><div><b>Security</b> — sharing model is sound and audit-ready.</div></div>
        <div className="finding"><span className="dot r" /><div><b>Integrations</b> — two brittle point-to-point flows to modernize.</div></div>
      </div>,
    ],
  }
}

function storyWireDemo(_item: EcoItem): DemoDef {
  return {
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
}

function wireDemo(_item: EcoItem): DemoDef {
  return {
    input: 'Described screen · Case intake',
    source: 'Claude · Lightning components',
    steps: [
      'Reading the described screen…',
      'Selecting Lightning components…',
      'Laying out fields & sections…',
      'Rendering the mock…',
    ],
    blocks: [wireframe],
  }
}

// shared artifacts (story + wireframe)
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

export function getDemo(item: EcoItem): DemoDef | null {
  const arch = archFor(item)
  if (!arch) return null
  switch (arch) {
    case 'storywire': return storyWireDemo(item)
    case 'wire': return wireDemo(item)
    case 'deck': return deckDemo(item)
    case 'dash': return dashDemo(item)
    case 'assess': return assessDemo(item)
    default: return docDemo(item)
  }
}

// ---- the runner ------------------------------------------------------------
const STEP_MS = 620

export function DemoRunner({ item }: { item: EcoItem }) {
  const demo = getDemo(item)!
  const [cur, setCur] = useState(0)          // current step index; === steps.length when done
  const [running, setRunning] = useState(true)
  const timers = useRef<number[]>([])

  const clear = () => { timers.current.forEach(t => clearTimeout(t)); timers.current = [] }

  const start = () => {
    clear()
    setRunning(true); setCur(0)
    demo.steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setCur(i), i * STEP_MS)))
    timers.current.push(window.setTimeout(() => { setCur(demo.steps.length); setRunning(false) }, demo.steps.length * STEP_MS))
  }

  // (re)start whenever the capability changes; clean up timers on unmount
  useEffect(() => { start(); return clear /* eslint-disable-line */ }, [item.name])

  const done = !running && cur >= demo.steps.length
  const total = demo.steps.length
  // how many artifact blocks are revealed so far, synced to progress
  const revealed = done ? demo.blocks.length : Math.round(((cur) / total) * demo.blocks.length)
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
