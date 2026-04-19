import { useState, useEffect } from 'react'
import type { SelectedItem, Persona, Stage } from '../types'
import type { Note } from '../context/ChainContext'
import seed from '../data/seed'

interface Props {
  item: SelectedItem | null
  nodeId: string | null
  notes: Note[]
  onAddNote: (text: string) => void
  onRemoveNote: (index: number) => void
  onClose: () => void
  activePersonaId?: string | null
  activePersonaName?: string | null
  personaNote?: string
  onPersonaNoteChange?: (text: string) => void
  personaInteractions?: Record<string, { nodeIds: string[]; notes: Record<string, string> }>
  allPersonas?: Persona[]
  descriptions?: Record<string, string>
  owners?: Record<string, string>
  onSetDescription?: (text: string) => void
  onSetOwner?: (owner: string) => void
  onRename?: (id: string, name: string) => void
  isEditing?: boolean
  allStages?: Stage[]
  onSetStageOverride?: (stageIds: string[]) => void
  nodeLinks?: { url: string; label: string }[]
  onAddLink?: (url: string, label: string) => void
  onRemoveLink?: (index: number) => void
  nodeStatus?: 'live' | 'wip' | 'planned' | null
  nodeStatusFields?: { sopUrl?: string; sopLabel?: string; done?: string; inProgress?: string; outstanding?: string; plan?: string }
  onSetStatusField?: (field: string, value: string) => void
}

// ─── colour tokens ────────────────────────────────────────────────────────────
const Z = {
  green: '#0F6E56', greenMid: '#1a8a6f', greenDark: '#064E3B',
  greenLight: '#F0FDFA', greenBorder: '#a7f3d0',
  purple: '#534AB7', purpleMid: '#6B63D0',
  purpleLight: '#FAF5FF', purpleBorder: '#c4b5fd',
  teal: '#0e7490', tealMid: '#0891b2',
  tealLight: '#ecfeff', tealBorder: '#a5f3fc',
  gold: '#FAC775', goldDark: '#854F0B',
  goldLight: '#fffbeb', goldBorder: '#fde68a',
  red: '#ef4444', redLight: '#fff5f5', redBorder: '#fca5a5',
  slate: '#64748b', dark: '#0f172a', border: '#e2e8f0', bg: '#f8fafc',
}

// ─── small primitives ─────────────────────────────────────────────────────────
function SectionLabel({ text, color = Z.slate }: { text: string; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <span style={{ width: 3, height: 11, background: color, borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontSize: 9.5, fontWeight: 700, color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{text}</span>
    </div>
  )
}

function Chip({ label, color, bg, border }: { label: string; color: string; bg: string; border?: string }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 10.5, fontWeight: 500, color, background: bg, border: `1px solid ${border ?? bg}`, borderRadius: 20, padding: '3px 10px', marginRight: 5, marginBottom: 5 }}>
      {label}
    </span>
  )
}

function Card({ children, bg = '#fff', border = Z.border, mb = 14 }: { children: React.ReactNode; bg?: string; border?: string; mb?: number }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: '12px 14px', marginBottom: mb }}>
      {children}
    </div>
  )
}

// ─── stage picker ─────────────────────────────────────────────────────────────
function StagePicker({ selectedIds, allStages, onChange }: {
  selectedIds: string[]
  allStages: Stage[]
  onChange: (ids: string[]) => void
}) {
  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter(s => s !== id) : [...selectedIds, id])
  }
  const presales = allStages.filter(s => s.type === 'presales')
  const delivery = allStages.filter(s => s.type === 'delivery')

  function row(stages: typeof allStages, active: { color: string; bg: string; border: string }, inactive: { color: string; bg: string; border: string }) {
    return stages.map(s => {
      const on = selectedIds.includes(s.id)
      const c = on ? active : inactive
      return (
        <button key={s.id} onClick={() => toggle(s.id)}
          style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, cursor: 'pointer', borderRadius: 20, padding: '4px 11px', fontFamily: 'DM Sans, Inter, sans-serif', border: `1.5px solid ${c.border}`, background: c.bg, color: c.color, outline: 'none' }}>
          {s.number} · {s.name}
        </button>
      )
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {row(presales,
          { color: Z.greenDark, bg: Z.greenLight, border: Z.green },
          { color: Z.slate, bg: '#f8fafc', border: Z.border }
        )}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {row(delivery,
          { color: Z.purple, bg: Z.purpleLight, border: Z.purple },
          { color: Z.slate, bg: '#f8fafc', border: Z.border }
        )}
      </div>
    </div>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function getHeaderGradient(item: SelectedItem): string {
  switch (item.kind) {
    case 'stage':         return item.data.type === 'presales'
                            ? `linear-gradient(135deg, ${Z.green} 0%, ${Z.greenMid} 100%)`
                            : `linear-gradient(135deg, ${Z.purple} 0%, ${Z.purpleMid} 100%)`
    case 'agent':         return item.data.category === 'platform'
                            ? `linear-gradient(135deg, ${Z.purple} 0%, ${Z.purpleMid} 100%)`
                            : `linear-gradient(135deg, ${Z.green} 0%, ${Z.greenMid} 100%)`
    case 'orchestration': return `linear-gradient(135deg, ${Z.goldDark} 0%, #B45309 100%)`
    case 'deliverable':   return `linear-gradient(135deg, ${Z.teal} 0%, ${Z.tealMid} 100%)`
    default:              return `linear-gradient(135deg, ${Z.green} 0%, ${Z.greenMid} 100%)`
  }
}

function getKindLabel(item: SelectedItem): string {
  switch (item.kind) {
    case 'stage':         return item.data.type === 'presales' ? `Pre-Sales · Stage ${item.data.number}` : `Delivery · Stage ${item.data.number}`
    case 'agent':         return item.data.category === 'platform' ? 'Platform / Core Tech' : 'Custom Agent'
    case 'deliverable':   return 'Deliverable'
    case 'orchestration': return item.data.type === 'rail' ? 'Orchestration Rail' : 'Shared Tool'
    case 'persona':       return 'Persona'
  }
}

function getDerivedOwner(item: SelectedItem): { name: string; wsName: string } | null {
  const ws = seed.workstreamsMapping.workstreams
  let matches = [] as typeof ws
  if (item.kind === 'stage')         matches = ws.filter(w => w.coversStageIds?.includes(item.data.id))
  else if (item.kind === 'agent')    matches = ws.filter(w => w.coversElements?.includes('agents'))
  else if (item.kind === 'deliverable') matches = ws.filter(w => w.coversElements?.includes('deliverables'))
  else if (item.kind === 'orchestration') matches = ws.filter(w => w.coversElements?.includes('orchestration'))
  const real = matches.find(w => w.owner && w.owner !== 'TBD')
  if (!real) return null
  return { name: real.owner, wsName: real.name }
}

function statusStyle(status: string): { color: string; bg: string; label: string } {
  switch (status) {
    case 'production':     return { color: Z.greenDark, bg: Z.greenLight, label: '● Live' }
    case 'in-development': return { color: '#92400e',   bg: Z.goldLight,  label: '◐ In Development' }
    case 'concept':        return { color: Z.purple,    bg: Z.purpleLight, label: '○ Concept' }
    default:               return { color: Z.slate,     bg: Z.bg,          label: '? Unknown' }
  }
}

// ─── editable description ─────────────────────────────────────────────────────
function DescriptionField({ nodeId, descriptions, onSetDescription, placeholder, defaultValue }: {
  nodeId: string | null; descriptions?: Record<string, string>;
  onSetDescription?: (t: string) => void; placeholder: string; defaultValue?: string
}) {
  const value = nodeId ? (descriptions?.[nodeId] ?? defaultValue ?? '') : ''
  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel text="Description" color={Z.slate} />
      <textarea
        value={value}
        onChange={e => onSetDescription?.(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{ width: '100%', padding: '8px 10px', borderRadius: 7, border: `1px solid ${Z.border}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box', color: Z.dark, background: '#fafafa' }}
      />
    </div>
  )
}

// ─── editable owner ───────────────────────────────────────────────────────────
function OwnerField({ nodeId, savedOwner, derivedOwner, onSetOwner }: {
  nodeId: string | null; savedOwner?: string; derivedOwner?: string | null; onSetOwner?: (o: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const display = savedOwner || derivedOwner || null

  if (editing) {
    return (
      <div style={{ marginBottom: 14 }}>
        <SectionLabel text="Owner" color={Z.slate} />
        <div style={{ display: 'flex', gap: 6 }}>
          <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { onSetOwner?.(draft.trim()); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
            placeholder="Name or team…"
            style={{ flex: 1, padding: '6px 9px', borderRadius: 6, border: `1px solid ${Z.green}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none' }} />
          <button onClick={() => { onSetOwner?.(draft.trim()); setEditing(false) }}
            style={{ padding: '6px 12px', borderRadius: 6, background: Z.green, color: '#fff', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>Save</button>
          <button onClick={() => setEditing(false)}
            style={{ padding: '6px 10px', borderRadius: 6, background: Z.bg, color: Z.slate, border: `1px solid ${Z.border}`, fontSize: 11, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel text="Owner" color={Z.slate} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {display
          ? <span style={{ fontSize: 12.5, fontWeight: 600, color: Z.dark }}>{display}</span>
          : <span style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No owner set</span>}
        <button onClick={() => { setDraft(display ?? ''); setEditing(true) }}
          style={{ fontSize: 10, color: Z.green, background: 'none', border: `1px solid ${Z.greenBorder}`, borderRadius: 4, padding: '2px 7px', cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif', fontWeight: 600 }}>
          Edit
        </button>
        {savedOwner && (
          <button onClick={() => onSetOwner?.('')}
            style={{ fontSize: 10, color: Z.slate, background: 'none', border: `1px solid ${Z.border}`, borderRadius: 4, padding: '2px 7px', cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>
            Reset
          </button>
        )}
      </div>
    </div>
  )
}

// ─── node-type bodies ─────────────────────────────────────────────────────────
function StageBody({ stage, nodeId, taggedPersonas, descriptions, onSetDescription }: {
  stage: import('../types').Stage; nodeId: string | null
  taggedPersonas: Persona[]; descriptions?: Record<string, string>; onSetDescription?: (t: string) => void
}) {
  const agents     = seed.agents.filter(a => a.stageIds.includes(stage.id))
  const delivs     = seed.deliverables.filter(d => d.producedAtStageId === stage.id)
  const frameworks = seed.frameworks.filter(f => f.stageIds.includes(stage.id))

  return (
    <>
      <DescriptionField nodeId={nodeId} descriptions={descriptions} onSetDescription={onSetDescription}
        placeholder={`What is the primary purpose of ${stage.name}? What does the team do here?`} />

      {stage.outcomes.length > 0 && (
        <Card bg={Z.greenLight} border={Z.greenBorder}>
          <SectionLabel text="Outcomes" color={Z.green} />
          {stage.outcomes.map(o => <Chip key={o} label={o} color={Z.greenDark} bg="#d1fae5" border={Z.greenBorder} />)}
          {stage.cadence && <div style={{ marginTop: 8, fontSize: 11.5, color: Z.green, fontWeight: 500 }}>Cadence: {stage.cadence}</div>}
        </Card>
      )}

      {agents.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text={`AI Agents (${agents.length})`} color={Z.green} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agents.map(a => {
              const knownStatuses = ['production', 'in-development', 'concept']
              const ss = knownStatuses.includes(a.status) ? statusStyle(a.status) : null
              return (
                <div key={a.id} style={{ background: '#fff', border: `1px solid ${Z.border}`, borderRadius: 7, padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: Z.dark }}>{a.name}</div>
                    {a.description && <div style={{ fontSize: 11, color: Z.slate, marginTop: 1 }}>{a.description}</div>}
                  </div>
                  {ss && <span style={{ fontSize: 9.5, fontWeight: 700, color: ss.color, background: ss.bg, borderRadius: 10, padding: '2px 8px', whiteSpace: 'nowrap', marginLeft: 10, flexShrink: 0 }}>{ss.label}</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {delivs.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text={`Deliverables (${delivs.length})`} color={Z.goldDark} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {delivs.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: Z.tealLight, border: `1px solid ${Z.tealBorder}`, borderRadius: 6, fontSize: 12, color: Z.dark }}>
                <span style={{ flexShrink: 0, color: Z.teal }}>▸</span>
                <span style={{ flex: 1 }}>{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {frameworks.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text={`Frameworks (${frameworks.length})`} color={Z.purple} />
          <div>{frameworks.map(f => <Chip key={f.id} label={f.name} color={Z.purple} bg={Z.purpleLight} border={Z.purpleBorder} />)}</div>
        </div>
      )}

      {taggedPersonas.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text="Personas Engaged" color={Z.slate} />
          <div>{taggedPersonas.map(p => <Chip key={p.id} label={p.name} color={Z.dark} bg={Z.bg} border={Z.border} />)}</div>
        </div>
      )}
    </>
  )
}

function AgentBody({ agent, nodeId, taggedPersonas, descriptions, onSetDescription, isEditing, allStages, onSetStageOverride }: {
  agent: import('../types').Agent; nodeId: string | null
  taggedPersonas: Persona[]; descriptions?: Record<string, string>; onSetDescription?: (t: string) => void
  isEditing?: boolean; allStages?: Stage[]; onSetStageOverride?: (ids: string[]) => void
}) {
  const stages = seed.stages.filter(s => agent.stageIds.includes(s.id))
  const knownStatuses = ['production', 'in-development', 'concept']
  const ss = knownStatuses.includes(agent.status) ? statusStyle(agent.status) : null

  return (
    <>
      <Card bg={agent.category === 'platform' ? Z.purpleLight : Z.greenLight} border={agent.category === 'platform' ? Z.purpleBorder : Z.greenBorder}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: agent.category === 'platform' ? Z.purple : Z.green }}>
            {agent.category === 'platform' ? '◈ Platform / Core Technology' : '⬡ Custom-Built Agent'}
          </div>
          {ss && <span style={{ fontSize: 11, fontWeight: 700, color: ss.color, background: ss.bg, borderRadius: 10, padding: '3px 10px' }}>{ss.label}</span>}
        </div>
      </Card>

      <DescriptionField nodeId={nodeId} descriptions={descriptions} onSetDescription={onSetDescription}
        placeholder={`What does ${agent.name} do? What inputs does it take and what does it produce?`}
        defaultValue={agent.description} />

      <div style={{ marginBottom: 14 }}>
        <SectionLabel text="Active In Stages" color={Z.green} />
        {isEditing && allStages ? (
          <StagePicker selectedIds={agent.stageIds} allStages={allStages} onChange={ids => onSetStageOverride?.(ids)} />
        ) : stages.length > 0 ? (
          <div>
            {stages.map(s => (
              <Chip key={s.id} label={`${s.number} · ${s.name}`}
                color={s.type === 'presales' ? Z.greenDark : Z.purple}
                bg={s.type === 'presales' ? Z.greenLight : Z.purpleLight}
                border={s.type === 'presales' ? Z.greenBorder : Z.purpleBorder} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No stages assigned</div>
        )}
      </div>

      {taggedPersonas.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text="Personas Engaged" color={Z.slate} />
          <div>{taggedPersonas.map(p => <Chip key={p.id} label={p.name} color={Z.dark} bg={Z.bg} border={Z.border} />)}</div>
        </div>
      )}
    </>
  )
}

function DeliverableBody({ deliv, nodeId, taggedPersonas, descriptions, onSetDescription }: {
  deliv: import('../types').Deliverable; nodeId: string | null
  taggedPersonas: Persona[]; descriptions?: Record<string, string>; onSetDescription?: (t: string) => void
}) {
  const producedAt = seed.stages.find(s => s.id === deliv.producedAtStageId)
  const ingestedBy = seed.stages.find(s => s.id === deliv.ingestedByStageId)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Card bg={Z.tealLight} border={Z.tealBorder} mb={0}>
          <div style={{ fontSize: 9, fontWeight: 700, color: Z.teal, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 5 }}>Produced At</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: Z.dark }}>Stage {producedAt?.number}</div>
          <div style={{ fontSize: 11, color: Z.slate, marginTop: 2 }}>{producedAt?.name}</div>
        </Card>
        <Card bg={Z.purpleLight} border={Z.purpleBorder} mb={0}>
          <div style={{ fontSize: 9, fontWeight: 700, color: Z.purple, textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 5 }}>{ingestedBy ? 'Ingested By' : 'Flows To'}</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: Z.dark }}>{ingestedBy ? `Stage ${ingestedBy.number}` : 'IP Loop'}</div>
          <div style={{ fontSize: 11, color: Z.slate, marginTop: 2 }}>{ingestedBy?.name ?? 'Institutional knowledge'}</div>
        </Card>
      </div>

      <DescriptionField nodeId={nodeId} descriptions={descriptions} onSetDescription={onSetDescription}
        placeholder={`What is this deliverable? What does it contain and who uses it?`} />

      {taggedPersonas.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text="Personas Engaged" color={Z.slate} />
          <div>{taggedPersonas.map(p => <Chip key={p.id} label={p.name} color={Z.dark} bg={Z.bg} border={Z.border} />)}</div>
        </div>
      )}
    </>
  )
}

function OrchestrationBody({ orch, nodeId, taggedPersonas, descriptions, onSetDescription, isEditing, allStages, onSetStageOverride }: {
  orch: import('../types').Orchestration; nodeId: string | null
  taggedPersonas: Persona[]; descriptions?: Record<string, string>; onSetDescription?: (t: string) => void
  isEditing?: boolean; allStages?: Stage[]; onSetStageOverride?: (ids: string[]) => void
}) {
  const stages = seed.stages.filter(s => orch.spansStageIds.includes(s.id))

  return (
    <>
      <Card bg={Z.goldLight} border={Z.goldBorder}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: Z.goldDark }}>
          {orch.type === 'rail' ? '🧠 Orchestration Rail — persistent context & knowledge layer' : '⚙ Shared Tool — cross-stage capability'}
        </div>
      </Card>

      <DescriptionField nodeId={nodeId} descriptions={descriptions} onSetDescription={onSetDescription}
        placeholder={`What does ${orch.name} do? What does it provide across stages?`}
        defaultValue={orch.description} />

      <div style={{ marginBottom: 14 }}>
        <SectionLabel text="Spans Stages" color={Z.goldDark} />
        {isEditing && allStages ? (
          <StagePicker selectedIds={orch.spansStageIds} allStages={allStages} onChange={ids => onSetStageOverride?.(ids)} />
        ) : stages.length > 0 ? (
          <div>
            {stages.map(s => (
              <Chip key={s.id} label={`${s.number} · ${s.name}`}
                color={s.type === 'presales' ? Z.greenDark : Z.purple}
                bg={s.type === 'presales' ? Z.greenLight : Z.purpleLight}
                border={s.type === 'presales' ? Z.greenBorder : Z.purpleBorder} />
            ))}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No stages assigned</div>
        )}
      </div>

      {taggedPersonas.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <SectionLabel text="Personas Engaged" color={Z.slate} />
          <div>{taggedPersonas.map(p => <Chip key={p.id} label={p.name} color={Z.dark} bg={Z.bg} border={Z.border} />)}</div>
        </div>
      )}
    </>
  )
}

// ─── status-driven fields ─────────────────────────────────────────────────────
type StatusFields = { sopUrl?: string; sopLabel?: string; done?: string; inProgress?: string; outstanding?: string; plan?: string }

function StatusSection({ status, fields = {}, onChange }: {
  status: 'live' | 'wip' | 'planned'
  fields?: StatusFields
  onChange: (field: string, value: string) => void
}) {
  const ta = (field: string, value: string, placeholder: string, rows = 3) => (
    <textarea value={value} onChange={e => onChange(field, e.target.value)}
      placeholder={placeholder} rows={rows}
      style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: `1px solid ${Z.border}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.5, boxSizing: 'border-box', background: '#fafafa' }} />
  )

  if (status === 'live') {
    return (
      <Card bg={Z.greenLight} border={Z.greenBorder} mb={14}>
        <SectionLabel text="● Live — SOP & Documentation" color={Z.green} />
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input value={fields.sopUrl ?? ''} onChange={e => onChange('sopUrl', e.target.value)}
            placeholder="https://…  (SOP or guide document URL)"
            style={{ flex: 2, padding: '6px 9px', borderRadius: 6, border: `1px solid ${Z.greenBorder}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none', background: '#fff' }} />
          <input value={fields.sopLabel ?? ''} onChange={e => onChange('sopLabel', e.target.value)}
            placeholder="Link label"
            style={{ flex: 1, padding: '6px 9px', borderRadius: 6, border: `1px solid ${Z.greenBorder}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none', background: '#fff' }} />
        </div>
        {fields.sopUrl ? (
          <a href={fields.sopUrl} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: Z.green, fontWeight: 600, textDecoration: 'none' }}>
            🔗 {fields.sopLabel || fields.sopUrl}
          </a>
        ) : (
          <div style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>No SOP linked yet — paste a URL above.</div>
        )}
      </Card>
    )
  }

  if (status === 'wip') {
    const rows: { field: string; label: string; icon: string; placeholder: string }[] = [
      { field: 'done',        label: 'Done',                    icon: '✅', placeholder: 'What has been completed so far…' },
      { field: 'inProgress',  label: 'In Progress',             icon: '⏳', placeholder: 'What is actively being worked on…' },
      { field: 'outstanding', label: 'Outstanding to Enable',   icon: '⚑',  placeholder: "Blockers, missing pieces, what's needed to go live…" },
    ]
    return (
      <Card bg={Z.goldLight} border={Z.goldBorder} mb={14}>
        <SectionLabel text="◐ In Progress — Status Tracker" color="#92400e" />
        {rows.map(({ field, label, icon, placeholder }) => (
          <div key={field} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>{icon} {label}</div>
            {ta(field, (fields as Record<string, string>)[field] ?? '', placeholder, 2)}
          </div>
        ))}
      </Card>
    )
  }

  if (status === 'planned') {
    return (
      <Card bg={Z.purpleLight} border={Z.purpleBorder} mb={14}>
        <SectionLabel text="○ Planned — Build Checklist" color={Z.purple} />
        {ta('plan', fields.plan ?? '', 'What needs to happen to build this? List requirements, blockers, dependencies, owners…', 5)}
      </Card>
    )
  }

  return null
}

// ─── links + notes ────────────────────────────────────────────────────────────
function LinksSection({ links = [], onAdd, onRemove }: {
  links?: { url: string; label: string }[]
  onAdd?: (url: string, label: string) => void
  onRemove?: (index: number) => void
}) {
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')

  function submit() {
    const trimmed = url.trim()
    if (!trimmed) return
    const safe = trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : `https://${trimmed}`
    onAdd?.(safe, label.trim() || safe)
    setUrl(''); setLabel('')
  }

  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel text="Links & Resources" color={Z.slate} />
      {links.length === 0 && (
        <div style={{ fontSize: 11.5, color: '#94a3b8', fontStyle: 'italic', padding: '2px 0 8px' }}>
          No links yet — attach Notion docs, Miro boards, Confluence pages, etc.
        </div>
      )}
      {links.map((link, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', background: Z.bg, border: `1px solid ${Z.border}`, borderRadius: 6, marginBottom: 5 }}>
          <a href={link.url} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, fontSize: 12, color: Z.teal, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={link.url}>
            🔗 {link.label}
          </a>
          {onRemove && (
            <button onClick={() => onRemove(i)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1, flexShrink: 0 }}>×</button>
          )}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
        <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="https://…"
          style={{ flex: 2, padding: '6px 9px', borderRadius: 6, border: `1px solid ${Z.border}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none' }} />
        <input value={label} onChange={e => setLabel(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Label (optional)"
          style={{ flex: 1, padding: '6px 9px', borderRadius: 6, border: `1px solid ${Z.border}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none' }} />
        <button onClick={submit} disabled={!url.trim()}
          style={{ padding: '6px 12px', borderRadius: 6, background: url.trim() ? Z.teal : '#e2e8f0', color: url.trim() ? '#fff' : '#9ca3af', border: 'none', fontSize: 11, fontWeight: 600, cursor: url.trim() ? 'pointer' : 'default', fontFamily: 'DM Sans, Inter, sans-serif', flexShrink: 0 }}>
          Add
        </button>
      </div>
    </div>
  )
}

function NotesSection({ notes, onAdd, onRemove }: { notes: Note[]; onAdd: (t: string) => void; onRemove: (i: number) => void }) {
  const [draft, setDraft] = useState('')
  function submit() { const t = draft.trim(); if (!t) return; onAdd(t); setDraft('') }

  return (
    <div style={{ borderTop: `1px solid ${Z.border}`, paddingTop: 14 }}>
      <SectionLabel text={`Notes${notes.length > 0 ? ` (${notes.length})` : ''}`} color={Z.slate} />
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <textarea value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder="Add a note… (Enter to save)" rows={2}
          style={{ flex: 1, padding: '7px 9px', borderRadius: 6, border: `1px solid ${Z.border}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.4 }} />
        <button onClick={submit} disabled={!draft.trim()}
          style={{ alignSelf: 'flex-end', padding: '7px 14px', borderRadius: 6, background: draft.trim() ? Z.green : '#e2e8f0', color: draft.trim() ? '#fff' : '#9ca3af', border: 'none', fontSize: 12, fontWeight: 600, cursor: draft.trim() ? 'pointer' : 'default', fontFamily: 'DM Sans, Inter, sans-serif' }}>
          Add
        </button>
      </div>
      {notes.length === 0 && <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No notes yet.</div>}
      {notes.map((note, i) => (
        <div key={i} style={{ background: Z.goldLight, border: `1px solid ${Z.goldBorder}`, borderRadius: 6, padding: '8px 10px', marginBottom: 7, position: 'relative' }}>
          <div style={{ fontSize: 12, color: Z.dark, lineHeight: 1.5, whiteSpace: 'pre-wrap', paddingRight: 20 }}>{note.text}</div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            {new Date(note.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <button onClick={() => onRemove(i)} style={{ position: 'absolute', top: 6, right: 7, background: 'none', border: 'none', color: '#94a3b8', fontSize: 14, cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
        </div>
      ))}
    </div>
  )
}

// ─── main export ──────────────────────────────────────────────────────────────
export default function DetailPanel({
  item, nodeId, notes, onAddNote, onRemoveNote, onClose,
  activePersonaId, activePersonaName, personaNote, onPersonaNoteChange,
  personaInteractions, allPersonas, descriptions, owners, onSetDescription, onSetOwner, onRename,
  isEditing, allStages, onSetStageOverride,
  nodeLinks, onAddLink, onRemoveLink,
  nodeStatus, nodeStatusFields, onSetStatusField,
}: Props) {
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  useEffect(() => { setEditingName(false) }, [nodeId])

  if (!item) return null

  const derivedOwner = getDerivedOwner(item)
  const savedOwner = nodeId ? (owners?.[nodeId] ?? '') : ''
  const taggedPersonas = allPersonas
    ? allPersonas.filter(p => (personaInteractions?.[p.id]?.nodeIds ?? []).includes(nodeId ?? ''))
    : []

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, Inter, sans-serif' }}
    >
      <div style={{ background: '#ffffff', borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.24)', width: '90%', maxWidth: 700, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Header ── */}
        <div style={{ background: getHeaderGradient(item), padding: '22px 26px 18px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                {getKindLabel(item)}
              </div>
              {editingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <input autoFocus value={nameDraft}
                    onChange={e => setNameDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && nameDraft.trim()) { onRename?.(item.data.id, nameDraft.trim()); setEditingName(false) }
                      if (e.key === 'Escape') setEditingName(false)
                    }}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 7, padding: '5px 10px', fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none', minWidth: 0 }}
                  />
                  <button onClick={() => { if (nameDraft.trim()) { onRename?.(item.data.id, nameDraft.trim()); setEditingName(false) } }}
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11, color: '#fff', borderRadius: 6, padding: '5px 10px', fontFamily: 'DM Sans, Inter, sans-serif', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    Save
                  </button>
                  <button onClick={() => setEditingName(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'rgba(255,255,255,0.7)', padding: '4px', flexShrink: 0 }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 23, fontWeight: 800, color: '#ffffff', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                    {item.data.name}
                  </div>
                  {onRename && item.kind !== 'persona' && (
                    <button onClick={() => { setNameDraft(item.data.name); setEditingName(true) }}
                      title="Rename"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 10, color: 'rgba(255,255,255,0.7)', borderRadius: 5, padding: '3px 8px', fontFamily: 'DM Sans, Inter, sans-serif', flexShrink: 0 }}>
                      ✎ Rename
                    </button>
                  )}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <button onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1, padding: '4px 9px', borderRadius: 7 }}>
                ×
              </button>
              {activePersonaName && (
                <span style={{ fontSize: 10, fontWeight: 600, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '2px 9px' }}>
                  Viewing as: {activePersonaName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>

          <OwnerField nodeId={nodeId} savedOwner={savedOwner || undefined} derivedOwner={derivedOwner?.name} onSetOwner={onSetOwner} />

          {nodeStatus && onSetStatusField && (
            <StatusSection status={nodeStatus} fields={nodeStatusFields} onChange={onSetStatusField} />
          )}

          {item.kind === 'stage' && (
            <StageBody stage={item.data} nodeId={nodeId} taggedPersonas={taggedPersonas}
              descriptions={descriptions} onSetDescription={onSetDescription} />
          )}
          {item.kind === 'agent' && (
            <AgentBody agent={item.data} nodeId={nodeId} taggedPersonas={taggedPersonas}
              descriptions={descriptions} onSetDescription={onSetDescription}
              isEditing={isEditing} allStages={allStages} onSetStageOverride={onSetStageOverride} />
          )}
          {item.kind === 'deliverable' && (
            <DeliverableBody deliv={item.data} nodeId={nodeId} taggedPersonas={taggedPersonas}
              descriptions={descriptions} onSetDescription={onSetDescription} />
          )}
          {item.kind === 'orchestration' && (
            <OrchestrationBody orch={item.data} nodeId={nodeId} taggedPersonas={taggedPersonas}
              descriptions={descriptions} onSetDescription={onSetDescription}
              isEditing={isEditing} allStages={allStages} onSetStageOverride={onSetStageOverride} />
          )}
          {item.kind === 'persona' && (
            <div style={{ fontSize: 13, color: Z.slate, marginBottom: 14 }}>This persona engages all stages in the value chain.</div>
          )}

          {activePersonaId && activePersonaName && nodeId && item.kind !== 'persona' && (
            <Card bg={Z.goldLight} border={Z.goldBorder}>
              <SectionLabel text={`How ${activePersonaName} Interacts Here`} color="#92400e" />
              <textarea
                value={personaNote ?? ''} onChange={e => onPersonaNoteChange?.(e.target.value)}
                onBlur={e => onPersonaNoteChange?.(e.target.value)}
                placeholder={`Describe how ${activePersonaName} engages with this node…`} rows={3}
                style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: `1px solid ${Z.goldBorder}`, fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.4, boxSizing: 'border-box', background: '#fff' }}
              />
            </Card>
          )}

          <LinksSection links={nodeLinks} onAdd={onAddLink} onRemove={onRemoveLink} />

          {nodeId && <NotesSection notes={notes} onAdd={onAddNote} onRemove={onRemoveNote} />}
        </div>
      </div>
    </div>
  )
}
