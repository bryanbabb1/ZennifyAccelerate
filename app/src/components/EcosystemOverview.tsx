import { useEffect, useMemo, useState } from 'react'
import '../ecosystem.css'
import { ITEMS, STAGES, STAGE_VALUE, STAGE_IMPACT, PILLARS, EcoItem } from '../data/ecosystem'
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

const isLive = (a: EcoItem) => a.maturity === 'Live'
const mstate = (a: EcoItem): [string, string] => isLive(a) ? ['m-live', 'Live'] : ['m-road', 'Roadmap']
const stageName = Object.fromEntries(STAGES.map(s => [s[0], s[1] + ' ' + s[2]]))

export default function EcosystemOverview() {
  const [stage, setStage] = useState('d2')
  const [fk, setFk] = useState<string | null>(null)
  const [fm, setFm] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [drawer, setDrawer] = useState<EcoItem | null>(null)
  const [items, setItems] = useState<EcoItem[]>(ITEMS)

  // Live content: fetch the read-only JSON endpoint (Apps Script fronting the
  // private CMS sheet), set via the VITE_ECOSYSTEM_URL build env var. Falls back
  // to the data baked into the repo if unset or unreachable.
  useEffect(() => {
    const url = import.meta.env.VITE_ECOSYSTEM_URL as string | undefined
    if (!url) return
    fetch(url)
      .then(r => r.json())
      .then((data: EcoItem[]) => {
        if (Array.isArray(data) && data.length) setItems(data)
      })
      .catch(() => { /* keep baked fallback */ })
  }, [])

  const capsFor = (id: string) => items.filter(a => (a.stages || []).includes(id))

  const list = useMemo(() => {
    const out = items.filter(a => {
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
  }, [items, fk, fm, q])

  const liveCount = items.filter(isLive).length
  const kindCount = new Set(items.map(a => a.kind)).size
  const filtering = !!q || !!fk || !!fm
  const catalogVisible = catalogOpen || filtering

  const BENEFIT_ORDER = ['Time saved', 'Less rework', 'Consistent quality', 'Risk reduced', 'Sharper insight', 'Better client experience']
  type BEx = { name: string; before?: string; after?: string; headline?: string }
  const benefitSummary = useMemo(() => {
    const map: Record<string, { count: number; ex: BEx[] }> = {}
    items.forEach(a => {
      const b = a.benefit
      if (!b) return
      if (!map[b]) map[b] = { count: 0, ex: [] }
      map[b].count++
      if (a.headline || (a.before && a.after)) map[b].ex.push({ name: a.name, before: a.before, after: a.after, headline: a.headline })
    })
    const order = [...BENEFIT_ORDER, ...Object.keys(map).filter(b => !BENEFIT_ORDER.includes(b))]
    return order.filter(b => map[b]).map(b => {
      // Lead with the most concrete proof: capabilities that carry a real before→after.
      const ex = [...map[b].ex].sort((x, y) => Number(!!(y.before && y.after)) - Number(!!(x.before && x.after)))
      return { name: b, count: map[b].count, ex: ex.slice(0, 3) }
    })
  }, [items])
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
          <a href="#measure">Value</a>
          <a href="#explore">Explore</a>
        </div>
      </div></nav>

      {/* Hero */}
      <header className="hero"><div className="wrap">
        <img className="logo" src={LOGO_WHITE} alt="Zennify" />
        <span className="eyebrow">AI-accelerated delivery</span>
        <h1>Every stage of your Salesforce journey, accelerated by AI.</h1>
        <p className="lead">Zennify pairs a proven sales and delivery methodology with a coordinated ecosystem of
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
        <div className="railrow">{STAGES.filter(s => s[3] === 'Sales').map(s => <StageBtn key={s[0]} s={s} on={s[0] === stage} count={capsFor(s[0]).length} impact={STAGE_IMPACT[s[0]]} onClick={() => setStage(s[0])} />)}</div>
        <div className="raillabel">Delivery</div>
        <div className="railrow">{STAGES.filter(s => s[3] === 'Delivery').map(s => <StageBtn key={s[0]} s={s} on={s[0] === stage} count={capsFor(s[0]).length} impact={STAGE_IMPACT[s[0]]} onClick={() => setStage(s[0])} />)}</div>
        <div className="detail" style={{ marginTop: 20 }}>
          <div className="dcard">
            <span className="eyebrow">{st[1]} &middot; {st[2]}</span>
            <h3>{sv[0]}</h3><p>{sv[1]}</p>
            {STAGE_IMPACT[stage] && caps.length > 0 ? (
              <div className="stopline">
                <div className="slabel">Value at this stage</div>
                <div className="sstat">{STAGE_IMPACT[stage].stat}</div>
                <div className="sdesc">{STAGE_IMPACT[stage].label}</div>
              </div>
            ) : null}
            <div className="metric"><div className="n">{caps.length} AI capabilities</div><div className="l">active at this stage</div></div>
          </div>
          <div className="caps">
            {caps.length ? caps.map(c => {
              const m = mstate(c)
              return (
                <div className="cap" key={c.name} onClick={() => setDrawer(c)}>
                  <div className="top"><span className="nm">{c.name}</span><span className={`tag ${KINDTAG[c.kind] || 'tag-slate'} kt`}>{c.kind}</span></div>
                  <p>{(c.desc || '').slice(0, 120)}</p>
                  <div style={{ marginTop: 8 }}><span className={`mstate ${m[0]}`}>{m[1]}</span></div>
                </div>
              )
            }) : <div className="cap"><p>Cross-cutting capabilities support this stage.</p></div>}
          </div>
        </div>
      </div></section>

      {/* Benefits — the value the ecosystem creates, rolled up from the catalog */}
      <section id="measure" className="score"><div className="wrap">
        <div className="sechead"><span className="eyebrow">The value it creates</span><h2>Six outcomes, backed by real capabilities.</h2>
          <p>Every capability in the ecosystem is built to move one of these outcomes. Here are examples of each, with the time change they drive.</p></div>
        <div className="benefitgrid">
          {benefitSummary.map(b => (
            <div className="bcard" key={b.name}>
              <div className="n">{b.count}</div>
              <div className="h">{b.name}</div>
              <div className="sub">{b.count === 1 ? 'capability delivers this' : 'capabilities deliver this'}</div>
              <div className="bl">
                {b.ex.length
                  ? b.ex.map((e, i) => (
                      <div className="bm" key={i}>
                        <span className="bmn">{e.name}</span>
                        {e.before && e.after
                          ? <span className="bmv"><b className="bfrom">{e.before}</b> → <b className="bto">{e.after}</b></span>
                          : e.headline ? <span className="bmv"><b className="bto">{e.headline}</b></span> : null}
                      </div>
                    ))
                  : <div className="bm"><span className="bmn">Tracked per engagement</span></div>}
              </div>
            </div>
          ))}
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
        {catalogVisible ? (
          <>
            {!filtering ? <button className="catoggle" onClick={() => setCatalogOpen(false)}>Collapse catalog ▲</button> : null}
            <div className="grid">
              {list.map(a => {
                const m = mstate(a)
                return (
                  <div className="item" key={a.name} onClick={() => setDrawer(a)}>
                    <div className="top"><span className="nm">{a.name}</span><span className={`tag ${KINDTAG[a.kind] || 'tag-slate'} kt`}>{a.kind}</span></div>
                    <div className="desc">{(a.desc || '').slice(0, 105)}{(a.desc || '').length > 105 ? '…' : ''}</div>
                    {a.headline ? <div className="qstat">{a.before && a.after ? <span className="qba"><b className="qb">{a.before}</b> → <b className="qa">{a.after}</b></span> : null}<span className="qh">{a.headline}</span></div> : null}
                    <div className="foot">
                      <span className={`mstate ${m[0]}`}>{m[1]}</span>
                      {(a.stages || []).slice(0, 3).map(s => <span className="sc" key={s}>{s.toUpperCase()}</span>)}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <button className="catoggle expand" onClick={() => setCatalogOpen(true)}>Show all {list.length} capabilities ▼</button>
        )}
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

                {drawer.useCases && drawer.useCases.length ? (
                  <>
                    <div className="lbl">Use cases</div>
                    <ul className="uclist">{drawer.useCases.map((u, i) => <li key={i}>{u}</li>)}</ul>
                  </>
                ) : null}

                {drawer.value ? (
                  <>
                    <div className="lbl">Why it matters</div>
                    <div className="val">{drawer.value}</div>
                    {drawer.benefit ? <div className="row" style={{ marginTop: -10 }}><span className="tag tag-mint">{drawer.benefit}</span></div> : null}
                  </>
                ) : null}

                {drawer.headline ? (
                  <>
                    <div className="lbl">Impact</div>
                    <div className="impact">
                      {drawer.before && drawer.after ? (
                        <div className="iba">
                          <div className="ip before"><div className="inum">{drawer.before}</div></div>
                          <span className="iarrow">→</span>
                          <div className="ip after"><div className="inum">{drawer.after}</div></div>
                        </div>
                      ) : null}
                      <div className="ihead">{drawer.headline}</div>
                      {drawer.metric ? <div className="imetric">{drawer.metric}</div> : null}
                      {drawer.basis ? <div className={`ibasis ${drawer.basis.indexOf('Measured') === 0 ? 'meas' : drawer.basis === 'Directional estimate' ? 'est' : 'enab'}`}>{drawer.basis === 'Directional estimate' ? 'Directional estimate — not yet measured' : drawer.basis}</div> : null}
                    </div>
                  </>
                ) : null}

                <div className="lbl">Maturity &amp; platform</div>
                <div className="row"><span className={`mstate ${m[0]}`}>{m[1]}</span>{drawer.built ? <span className="sc">{drawer.built}</span> : null}</div>

                <div className="lbl">Lifecycle stage</div>
                <div className="row">{stages.length ? stages.map(s => <span className="tag tag-dark" key={s}>{stageName[s] || s}</span>) : <span className="tag tag-mint">Runs across the lifecycle</span>}</div>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}

function StageBtn({ s, on, count, impact, onClick }: { s: [string, string, string, string]; on: boolean; count: number; impact?: { stat: string; label: string; basis: string }; onClick: () => void }) {
  return (
    <button className={`stagebtn ${on ? 'on' : ''}`} onClick={onClick}>
      <div className="code">{s[1]}</div><div className="nm">{s[2]}</div><div className="ct">{count} capabilities</div>
      {impact && count > 0 ? <div className="simpact">{impact.stat}</div> : null}
    </button>
  )
}
