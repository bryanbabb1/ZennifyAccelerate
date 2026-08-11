import { useEffect, useRef, useState } from 'react'

// "Watch it work" — a choreographed generate-it demo of a real catalog capability
// (Story & Design Writer). Not a live model call: status lines cycle on timers, then
// the finished artifacts (a user story + a CSS-drawn Salesforce wireframe) reveal.
type Phase = 'idle' | 'running' | 'done'

const STEPS = [
  'Reading the discovery note…',
  'Extracting the requirement and actors…',
  'Drafting the user story and acceptance criteria…',
  'Mapping fields to Salesforce objects…',
  'Rendering the editable wireframe…',
]
const STEP_MS = 640

export default function WatchItWork() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [stepIdx, setStepIdx] = useState(0)
  const timers = useRef<number[]>([])

  const clear = () => { timers.current.forEach(t => clearTimeout(t)); timers.current = [] }
  useEffect(() => () => clear(), [])

  const run = () => {
    clear()
    setPhase('running'); setStepIdx(0)
    STEPS.forEach((_, i) => timers.current.push(window.setTimeout(() => setStepIdx(i), i * STEP_MS)))
    timers.current.push(window.setTimeout(() => setPhase('done'), STEPS.length * STEP_MS))
  }
  const reset = () => { clear(); setPhase('idle'); setStepIdx(0) }

  return (
    <section id="watch" className="wiwwrap"><div className="wrap">
      <div className="sechead"><span className="eyebrow">See it in action</span>
        <h2>Watch a capability do the work.</h2>
        <p>This is the Story &amp; Design Writer. Give it a raw discovery note and it produces a
          build-ready user story and an editable Salesforce wireframe — in seconds, on screen.</p></div>

      <div className="wiw">
        <div className="wiw-in">
          <div className="wiw-label">Input · discovery note</div>
          <div className="note">
            <p>“When a member calls the branch about a problem, the rep opens three systems to log it.
              Half the time the branch that took the call never gets recorded, so follow-up falls through.”</p>
            <div className="note-meta">Branch ops workshop · REQ-04</div>
          </div>
          <button
            className="wiw-btn"
            onClick={phase === 'done' ? reset : run}
            disabled={phase === 'running'}
          >
            {phase === 'idle' && 'Generate story & wireframe →'}
            {phase === 'running' && 'Generating…'}
            {phase === 'done' && '↻ Run it again'}
          </button>
        </div>

        <div className="wiw-out">
          {phase === 'idle' && (
            <div className="wiw-idle">
              <span className="wiw-idle-dot" />
              <p>Click generate to watch this note become a user story and a wireframe.</p>
            </div>
          )}

          {phase === 'running' && (
            <div className="wiw-run">
              <span className="spin" />
              <span className="wiw-step">{STEPS[stepIdx]}</span>
              <div className="wiw-progress"><span style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} /></div>
            </div>
          )}

          {phase === 'done' && (
            <div className="wiw-done">
              <div className="rv storycard">
                <div className="sc-head"><span className="sc-key">US-118</span> Member case intake
                  <span className="sc-done">Generated</span></div>
                <p className="sc-story"><b>As a</b> branch service rep, <b>I want</b> to log a member’s
                  issue in one screen <b>so that</b> nothing falls through between the branch and the call center.</p>
                <div className="sc-ac-l">Acceptance criteria</div>
                <ul className="sc-ac">
                  <li>Case captures member, branch, type, and description in a single view.</li>
                  <li>Originating branch is required and stored on every case.</li>
                  <li>Submitting routes the case to the owning branch queue.</li>
                </ul>
                <div className="sc-chips"><span>REQ-04</span><span>D3 · Sprint 0</span><span>Story &amp; Design Writer</span></div>
              </div>

              <div className="rv rv2 lwf">
                <div className="lwf-top">
                  <span className="lwf-obj">CASE</span>
                  <span className="lwf-title">New Member Case</span>
                  <span className="lwf-pills"><i>Edit</i><i>Escalate</i><i className="p">Save</i></span>
                </div>
                <div className="lwf-hl">
                  <div><span>Status</span><b>New</b></div>
                  <div><span>Priority</span><b>Medium</b></div>
                  <div><span>Branch</span><b>—</b></div>
                  <div><span>Member</span><b>—</b></div>
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
            </div>
          )}
        </div>
      </div>

      <p className="wiw-foot">Illustrative of the Story &amp; Design Writer’s output. On a real project it runs
        on your own discovery notes and org metadata.</p>
    </div></section>
  )
}
