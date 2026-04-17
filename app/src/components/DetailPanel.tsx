import { useState } from 'react'
import type { SelectedItem } from '../types'
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
}

const badge = (label: string, color: string, bg: string) => (
  <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 600, color, background: bg, borderRadius: 4, padding: '2px 7px', marginRight: 6, marginBottom: 4 }}>
    {label}
  </span>
)

function StageDetail({ stage }: { stage: import('../types').Stage }) {
  const agents = seed.agents.filter(a => a.stageIds.includes(stage.id))
  const delivs = seed.deliverables.filter(d => d.producedAtStageId === stage.id)
  const frameworks = seed.frameworks.filter(f => f.stageIds.includes(stage.id))

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {stage.type === 'presales' ? 'Pre-Sales' : 'Delivery'} · Stage {stage.number}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{stage.name}</div>
      </div>

      {stage.value && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Value</div>
          <div style={{ fontSize: 13, color: '#0F6E56', fontWeight: 500 }}>{stage.value}</div>
        </div>
      )}

      {stage.outcomes.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Outcomes</div>
          {stage.outcomes.map(o => (
            <div key={o} style={{ fontSize: 12, color: '#334155', marginBottom: 3 }}>• {o}</div>
          ))}
        </div>
      )}

      {agents.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Agents</div>
          {agents.map(a => (
            <div key={a.id} style={{ fontSize: 12, color: '#334155', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>⬡</span> {a.name}
              {a.description && <span style={{ color: '#94a3b8', fontSize: 11 }}>— {a.description}</span>}
            </div>
          ))}
        </div>
      )}

      {delivs.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Deliverables</div>
          {delivs.map(d => (
            <div key={d.id} style={{ fontSize: 12, color: '#334155', marginBottom: 3 }}>
              {d.buildStatus === 'likely-gap'
                ? <span style={{ color: '#ef4444' }}>⚑ {d.name} <em>(likely gap)</em></span>
                : <span>▸ {d.name}</span>}
            </div>
          ))}
        </div>
      )}

      {frameworks.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Frameworks</div>
          {frameworks.map(f => (
            <div key={f.id} style={{ fontSize: 12, color: '#534AB7', marginBottom: 3 }}>◈ {f.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function AgentDetail({ agent }: { agent: import('../types').Agent }) {
  const stages = seed.stages.filter(s => agent.stageIds.includes(s.id))
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Agent</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{agent.name}</div>
      </div>
      {agent.description && <div style={{ fontSize: 13, color: '#334155', marginBottom: 16 }}>{agent.description}</div>}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Stages</div>
        {stages.map(s => <div key={s.id} style={{ fontSize: 12, color: '#334155', marginBottom: 3 }}>{s.number} · {s.name}</div>)}
      </div>
      <div><div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Status</div>
        {badge(agent.status, '#92400e', '#fef3c7')}
      </div>
    </div>
  )
}

function DeliverableDetail({ deliv }: { deliv: import('../types').Deliverable }) {
  const producedAt = seed.stages.find(s => s.id === deliv.producedAtStageId)
  const ingestedBy = seed.stages.find(s => s.id === deliv.ingestedByStageId)
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Deliverable</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{deliv.name}</div>
      </div>
      {deliv.buildStatus === 'likely-gap' && (
        <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderRadius: 6, padding: '8px 12px', marginBottom: 16, fontSize: 12, color: '#b91c1c' }}>
          ⚑ Flagged: likely gap — needs validation
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Produced at</div>
        <div style={{ fontSize: 13, color: '#0F6E56', fontWeight: 500 }}>Stage {producedAt?.number} · {producedAt?.name}</div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{ingestedBy ? 'Ingested by' : 'Flows to'}</div>
        <div style={{ fontSize: 13, color: '#534AB7', fontWeight: 500 }}>
          {ingestedBy ? `Stage ${ingestedBy.number} · ${ingestedBy.name}` : 'IP Loop (institutional knowledge)'}
        </div>
      </div>
      {deliv.ws4DocMapping && (
        <div><div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>WS4 Mapping</div>
          {badge(deliv.ws4DocMapping, '#534AB7', '#ede9fe')}
        </div>
      )}
    </div>
  )
}

function OrchestrationDetail({ orch }: { orch: import('../types').Orchestration }) {
  const stages = seed.stages.filter(s => orch.spansStageIds.includes(s.id))
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
          {orch.type === 'rail' ? 'Orchestration Rail' : 'Shared Tool'}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{orch.name}</div>
      </div>
      {orch.description && <div style={{ fontSize: 13, color: '#334155', marginBottom: 16 }}>{orch.description}</div>}
      <div>
        <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Spans stages</div>
        {stages.map(s => <div key={s.id} style={{ fontSize: 12, color: '#334155', marginBottom: 3 }}>{s.number} · {s.name}</div>)}
      </div>
    </div>
  )
}

function NotesSection({ notes, onAdd, onRemove }: { notes: Note[]; onAdd: (t: string) => void; onRemove: (i: number) => void }) {
  const [draft, setDraft] = useState('')

  function submit() {
    const t = draft.trim()
    if (!t) return
    onAdd(t)
    setDraft('')
  }

  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Notes {notes.length > 0 && <span style={{ color: '#94a3b8', fontWeight: 400 }}>({notes.length})</span>}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder="Add a note… (Enter to save)"
          rows={2}
          style={{ flex: 1, padding: '7px 9px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.4 }}
        />
        <button
          onClick={submit}
          disabled={!draft.trim()}
          style={{ alignSelf: 'flex-end', padding: '7px 10px', borderRadius: 6, background: draft.trim() ? '#0F6E56' : '#e2e8f0', color: draft.trim() ? '#fff' : '#9ca3af', border: 'none', fontSize: 12, fontWeight: 600, cursor: draft.trim() ? 'pointer' : 'default', fontFamily: 'DM Sans, Inter, sans-serif' }}
        >
          Add
        </button>
      </div>

      {notes.length === 0 && (
        <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>No notes yet.</div>
      )}

      {notes.map((note, i) => (
        <div key={i} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 10px', marginBottom: 8, position: 'relative' }}>
          <div style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.5, whiteSpace: 'pre-wrap', paddingRight: 20 }}>{note.text}</div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>
            {new Date(note.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
          <button
            onClick={() => onRemove(i)}
            style={{ position: 'absolute', top: 6, right: 7, background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', padding: 0, lineHeight: 1 }}
            title="Remove note"
          >×</button>
        </div>
      ))}
    </div>
  )
}

export default function DetailPanel({ item, nodeId, notes, onAddNote, onRemoveNote, onClose, activePersonaId, activePersonaName, personaNote, onPersonaNoteChange }: Props) {
  if (!item) return null

  return (
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 320, background: '#ffffff', borderLeft: '1px solid #e2e8f0', overflowY: 'auto', zIndex: 10, fontFamily: 'DM Sans, Inter, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#ffffff', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.kind}</span>
          {activePersonaName && (
            <span style={{ fontSize: 10, fontWeight: 600, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '1px 8px' }}>
              Viewing as: {activePersonaName}
            </span>
          )}
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8', lineHeight: 1, padding: '0 4px' }}>×</button>
      </div>

      <div style={{ padding: '20px 20px 32px' }}>
        {item.kind === 'stage' && <StageDetail stage={item.data} />}
        {item.kind === 'agent' && <AgentDetail agent={item.data} />}
        {item.kind === 'deliverable' && <DeliverableDetail deliv={item.data} />}
        {item.kind === 'orchestration' && <OrchestrationDetail orch={item.data} />}
        {item.kind === 'persona' && (
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Persona</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{item.data.name}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 12 }}>Engages all stages in the value chain.</div>
          </div>
        )}

        {activePersonaId && activePersonaName && nodeId && item.kind !== 'persona' && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #fde68a', background: '#fffbeb', borderRadius: 6, padding: '12px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              How {activePersonaName} interacts here
            </div>
            <textarea
              value={personaNote ?? ''}
              onChange={e => onPersonaNoteChange?.(e.target.value)}
              onBlur={e => onPersonaNoteChange?.(e.target.value)}
              placeholder={`Describe how ${activePersonaName} engages with this node…`}
              rows={3}
              style={{ width: '100%', padding: '7px 9px', borderRadius: 6, border: '1px solid #fde68a', fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', resize: 'vertical', outline: 'none', lineHeight: 1.4, boxSizing: 'border-box', background: '#fff' }}
            />
          </div>
        )}

        {nodeId && (
          <NotesSection
            notes={notes}
            onAdd={onAddNote}
            onRemove={onRemoveNote}
          />
        )}
      </div>
    </div>
  )
}
