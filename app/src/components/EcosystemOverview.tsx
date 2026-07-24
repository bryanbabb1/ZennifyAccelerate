import { useMemo, useState } from 'react'
import '../ecosystem.css'
import { ITEMS, STAGES, STAGE_VALUE, PILLARS, KPIS, EcoItem } from '../data/ecosystem'
import { LOGO_WHITE, LOGO_DARK, BADGE, ICONS } from '../data/assetsData'

const KINDTAG: Record<string, string> = {
  Skill: 'tag-teal', Agent: 'tag-blue', 'Claude Project': 'tag-purple',
  App: 'tag-orange', MCP: 'tag-mint', Tool: 'tag-slate', Platform: 'tag-dark',
}
const CMAP: Record<string, string> = {
  Skill: 'teal', Agent: 'blue', 'Claude Project': 'purple', App: 'orange',
  MCP: 'mint', Tool: 'slate', Platform: 'teal-light',
}
const KORD = ['Skill', 'Agent', 'Claude Project', 'App', 'MCP', 'Tool', 'Platform']
const MKORD = ['Skill', 'Agent', 'Claude Project', 'App', 'MCP', 'Tool']

const isLive = (a: EcoItem) => a.maturity === 'Live'
const mstate = (a: EcoItem): [string, string] => isLive(a) ? ['m-live', 'Live'] : ['m-road', 'Roadmap']
const stageName = Object.fromEntries(STAGES.map(s => [s[0], s[1] + ' ' + s[2]]))

export default function EcosystemOverview() {
  const [stage, setStage] = useState('d2')
  const [fk, setFk] = useState<string | null>(null)
  const [fm, setFm] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [drawer, setDrawer] = useState<EcoItem | null>(null)

  const capsFor = (id: string) => ITEMS.filter(a => (a.stages || []).includes(id))

  const list = useMemo(() => {
    const out = ITEMS.filter(a => {
      if (fk && a.kind !== fk) return false
      if (fm === 'live' && !isLive(a)) return false
      if (fm === 'road' && isLive(a)) return false
      if (q) {
        const t = (a.name + ' ' + (a.desc || '') + ' ' + a.kind).toLowerCase()
        if (!t.includes(q)) return false
      }
      return true
    })
    out.sort((a, b) => (Number(isLive(b)) - Number(isLive(a))) ||
      KORD.indexOf(a.kind) - KORD.indexOf(b.kind) || a.name.localeCompare(b.name))
    return out
  }, [fk, fm, q])

  const matrix = useMemo(() => {
    const mat: Record<string, Record<string, number>> = {}
    MKORD.forEach(k => { mat[k] = {}; STAGES.forEach(s => (mat[k][s[0]] = 0)) })
    ITEMS.filter(isLive).forEach(a => {
      if (mat[a.kind]) (a.stages || []).forEach(s => { if (s in mat[a.kind]) mat[a.kind][s]++ })
    })
    let max = 1
    MKORD.forEach(k => STAGES.forEach(s => (max = Math.max(max, mat[k][s[0]]))))
    return { mat, max }
  }, [])

  const liveCount = ITEMS.filter(isLive).length
  const kindCount = new Set(ITEMS.map(a => a.kind)).size
  const sv = STAGE_VALUE[stage] || ['', '']
  const st = STAGES.find(x => x[0] === stage)!
  const caps = capsFor(stage)

  return (
    <div className="eco">
      {/* In-page nav */}
      <nav><div className="wrap">
        <img className="logo" src={LOGO_DARK} alt="Zennify" />
        <div className="links">
          <a href="#model">The model</a>
          <a href="#lifecycle">Lifecycle</a>
          <a href="#explore">Explore</a>
          <a href="#coverage">Coverage</a>
          <a href="#measure">Measurement</a>
        </div>
      </div></nav>

      {/* Hero */}
      <header className="hero"><div className="wrap">
        <img className="logo" src={LOGO_WHITE} alt="Zennify" />
        <span className="eyebrow">AI-accelerated delivery</span>
        <h1>Every stage of your Salesforce journey, accelerated by AI.</h1>
        <p className="lead">Zennify pairs a proven delivery methodology with a coordinated ecosystem of
          AI skills, agents, and apps. The result: faster cycles, consistent quality, and full transparency
          from first conversation to long after go-live.</p>
        <div className="stats">
          <div className="stat"><div className="n">{liveCount}</div><div className="l">Live AI capabilities today</div></div>
          <div className="stat"><div className="n">{STAGES.length}</div><div className="l">Lifecycle stages</div></div>
          <div className="stat"><div className="n">{kindCount}</div><div className="l">Capability types working together</div></div>
          <div className="stat"><div className="n">100%</div><div className="l">Deliverables on Zennify standard</div></div>
        </div>
      </div></header>

      {/* Value pillars */}
      <section id="model"><div className="wrap">
        <div className="sechead"><span className="eyebrow">Why it matters</span>
          <h2>Four ways an AI-accelerated model changes the engagement.</h2>
          <p>Each capability is built to move one of these levers on a real project, not to be a novelty.</p></div>
        <div className="pillars">
          {PILLARS.map(p => (
            <div className="pillar" key={p.name}>
              <img src={ICONS[p.icon]} alt="" />
              <div className="tag">{p.tag}</div><h3>{p.name}</h3><p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div></section>

      {/* Lifecycle */}
      <section id="lifecycle" className="lifewrap"><div className="wrap">
        <div className="sechead"><span className="eyebrow">The lifecycle spine</span>
          <h2>Explore what accelerates each stage.</h2>
          <p>Select a stage to see the value it delivers and the AI capabilities working behind the scenes.</p></div>
        <div className="raillabel">Sales &amp; pre-sales</div>
        <div className="railrow">{STAGES.filter(s => s[3] === 'Sales').map(s => <StageBtn key={s[0]} s={s} on={s[0] === stage} count={capsFor(s[0]).length} onClick={() => setStage(s[0])} />)}</div>
        <div className="raillabel">Delivery</div>
        <div className="railrow">{STAGES.filter(s => s[3] === 'Delivery').map(s => <StageBtn key={s[0]} s={s} on={s[0] === stage} count={capsFor(s[0]).length} onClick={() => setStage(s[0])} />)}</div>
        <div className="detail" style={{ marginTop: 20 }}>
          <div className="dcard">
            <span className="eyebrow">{st[1]} &middot; {st[2]}</span>
            <h3>{sv[0]}</h3><p>{sv[1]}</p>
            <div className="metric"><div className="n">{caps.length} AI capabilities</div><div className="l">active at this stage</div></div>
          </div>
          <div className="caps">
            {caps.length ? caps.map(c => {
              const m = mstate(c)
              return (
                <div className="cap" key={c.name}>
                  <div className="top"><span className="nm">{c.name}</span><span className={`tag ${KINDTAG[c.kind] || 'tag-slate'} kt`}>{c.kind}</span></div>
                  <p>{(c.desc || '').slice(0, 120)}</p>
                  <div style={{ marginTop: 8 }}><span className={`mstate ${m[0]}`}>{m[1]}</span></div>
                </div>
              )
            }) : <div className="cap"><p>Cross-cutting capabilities support this stage.</p></div>}
          </div>
        </div>
      </div></section>

      {/* Explorer */}
      <section id="explore"><div className="wrap">
        <div className="sechead"><span className="eyebrow">Capability catalog</span>
          <h2>Browse the full ecosystem.</h2>
          <p>Filter by type, stage, and maturity. Roadmap items show what is coming next.</p></div>
        <div className="filters">
          <input className="search" placeholder="Search capabilities..." value={q} onChange={e => setQ(e.target.value.toLowerCase().trim())} />
          <span className="cnt">{list.length} capabilities</span>
          <div style={{ flexBasis: '100%', height: 0 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className={`fchip ${fk === null ? 'on' : ''}`} onClick={() => setFk(null)}>All types</span>
            {KORD.map(k => (
              <span key={k} className={`fchip ${fk === k ? 'on' : ''}`} onClick={() => setFk(fk === k ? null : k)}>
                <span className="cd" style={{ background: `var(--z-${CMAP[k]})` }} />{k}
              </span>
            ))}
          </div>
          <div className="divv" />
          <div style={{ display: 'flex', gap: 8 }}>
            {[['All', null], ['Live', 'live'], ['Roadmap', 'road']].map(([l, v]) => (
              <span key={l as string} className={`fchip ${fm === v ? 'on' : ''}`} onClick={() => setFm(fm === v ? null : (v as string | null))}>{l}</span>
            ))}
          </div>
        </div>
        <div className="grid">
          {list.map(a => {
            const m = mstate(a)
            return (
              <div className="item" key={a.name} onClick={() => setDrawer(a)}>
                <div className="top"><span className="nm">{a.name}</span><span className={`tag ${KINDTAG[a.kind] || 'tag-slate'} kt`}>{a.kind}</span></div>
                <div className="desc">{(a.desc || '').slice(0, 105)}{(a.desc || '').length > 105 ? '…' : ''}</div>
                <div className="foot">
                  <span className={`mstate ${m[0]}`}>{m[1]}</span>
                  {(a.stages || []).slice(0, 3).map(s => <span className="sc" key={s}>{s.toUpperCase()}</span>)}
                </div>
              </div>
            )
          })}
        </div>
      </div></section>

      {/* Coverage matrix */}
      <section id="coverage" className="matrix"><div className="wrap">
        <div className="sechead"><span className="eyebrow">Coverage at a glance</span>
          <h2>Where AI shows up across the lifecycle.</h2>
          <p>Each cell counts the live capabilities of that type at that stage. Darker means deeper coverage.</p></div>
        <table className="mtable">
          <tbody>
            <tr><td className="rowh"></td>{STAGES.map(s => <th key={s[0]}>{s[1]}</th>)}</tr>
            {MKORD.map(k => (
              <tr key={k}>
                <td className="rowh">{k}</td>
                {STAGES.map(s => {
                  const v = matrix.mat[k][s[0]]
                  return <td key={s[0]} className={`mcell ${v ? '' : 'empty'}`}
                    style={v ? { background: `rgba(39,187,175,${(0.30 + 0.70 * v / matrix.max).toFixed(2)})` } : undefined}>{v || ''}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mscale">Coverage depth
          <span className="sw" style={{ background: 'rgba(39,187,175,0.30)' }} />lower
          <span className="sw" style={{ background: 'rgba(39,187,175,0.70)' }} />
          <span className="sw" style={{ background: 'rgba(39,187,175,1)' }} />higher</div>
      </div></section>

      {/* Measurement */}
      <section id="measure" className="score"><div className="wrap">
        <div className="sechead"><span className="eyebrow">Outcome scorecard</span><h2>Targets we set and track with you.</h2>
          <p>Illustrative targets. Real baselines are established at kickoff and reported through the engagement.</p></div>
        <div className="scards">
          <div className="scard"><div className="n">10x</div><div className="h">Faster first drafts</div><div className="p">First-pass BRD, SOW, and design docs in hours, not weeks.</div></div>
          <div className="scard"><div className="n">95%+</div><div className="h">First-pass QA</div><div className="p">Deliverables that clear brand and methodology review the first time.</div></div>
          <div className="scard"><div className="n">100%</div><div className="h">Lifecycle coverage</div><div className="p">Every stage has an active AI capability supporting the team.</div></div>
          <div className="scard"><div className="n">Live</div><div className="h">Status transparency</div><div className="p">Clients see project health and decisions as they happen.</div></div>
        </div>
        <div style={{ height: 34 }} />
        <div className="sechead" style={{ marginBottom: 20 }}><span className="eyebrow">Measurement framework</span><h2 style={{ fontSize: 20 }}>The metrics behind the targets.</h2></div>
        <div className="kpis" style={{ ['--z-lt' as string]: 'rgba(255,255,255,.08)' } as React.CSSProperties}>
          {KPIS.map(k => (
            <div className="kpi" key={k.name}><div className="p">{k.pillar}</div><h3>{k.name}</h3><div className="d">{k.desc}</div><div className="nn">{k.note}</div></div>
          ))}
        </div>
      </div></section>

      <footer><div className="wrap"><span className="c">&copy; 2026 Zennify &middot; AI Ecosystem Overview</span><img src={BADGE} alt="Zennify" /></div></footer>

      {/* Drawer */}
      <div className={`scrim ${drawer ? 'on' : ''}`} onClick={() => setDrawer(null)} />
      <div className={`drawer ${drawer ? 'on' : ''}`}>
        {drawer && (() => {
          const m = mstate(drawer)
          const stages = (drawer.stages || [])
          return (
            <>
              <button className="close" onClick={() => setDrawer(null)}>&times;</button>
              <div className="dhead"><span className={`tag ${KINDTAG[drawer.kind] || 'tag-slate'}`}>{drawer.kind}</span><h3>{drawer.name}</h3></div>
              <div className="dbody">
                <div className="lbl">What it is</div>
                <div className="val">{drawer.desc || 'A capability in the Zennify AI ecosystem.'}</div>
                <div className="lbl">Maturity</div>
                <div className="row"><span className={`mstate ${m[0]}`}>{m[1]}</span>{drawer.built ? <span className="sc">{drawer.built}</span> : null}</div>
                <div className="lbl">Where it works</div>
                <div className="row">{stages.length ? stages.map(s => <span className="tag tag-dark" key={s}>{stageName[s] || s}</span>) : <span className="tag tag-mint">Runs across the lifecycle</span>}</div>
                <div className="lbl">Value it creates</div>
                <div className="vpill"><div className="h">Speed</div><div className="p">Compresses the manual effort in this step so the team spends time on judgment.</div></div>
                <div className="vpill"><div className="h">Quality &amp; consistency</div><div className="p">Encodes Zennify methodology and brand so output is on-standard every time.</div></div>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}

function StageBtn({ s, on, count, onClick }: { s: [string, string, string, string]; on: boolean; count: number; onClick: () => void }) {
  return (
    <button className={`stagebtn ${on ? 'on' : ''}`} onClick={onClick}>
      <div className="code">{s[1]}</div><div className="nm">{s[2]}</div><div className="ct">{count} capabilities</div>
    </button>
  )
}
