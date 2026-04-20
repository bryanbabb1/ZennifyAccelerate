import { useState, useMemo } from 'react'
import { useChain } from '../context/ChainContext'
import type { Skill, SkillOverride, Stage, Persona } from '../types'

const AUCTOR_COLOR = { bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412' }
const STAGE_COLOR = { bg: '#EEF2FF', border: '#A5B4FC', text: '#3730A3' }
const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: '#D1FAE5', text: '#065F46', label: 'Active' },
  draft: { bg: '#FEF3C7', text: '#92400E', label: 'Draft' },
  planned: { bg: '#EDE9FE', text: '#4C1D95', label: 'Planned' },
}
const SKILL_STATUSES: Array<'active' | 'draft' | 'planned'> = ['active', 'draft', 'planned']

const FONT = 'DM Sans, Inter, sans-serif'

export default function SkillsLibrary() {
  const { data, isEditing, rename, setDescription, setSkillOverride } = useChain()
  const { skills, stages, personas } = data

  const deliveryStages = useMemo(() => stages.filter(s => s.type === 'delivery'), [stages])

  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterPersona, setFilterPersona] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return skills.filter(skill => {
      const stageMatch = filterStage === 'all' || skill.stageIds.includes(filterStage)
      const personaMatch = filterPersona === 'all' || skill.personaIds.includes(filterPersona)
      return stageMatch && personaMatch
    })
  }, [skills, filterStage, filterPersona])

  function stageName(id: string) {
    const s = stages.find(s => s.id === id)
    return s ? `${s.number} · ${s.name}` : id
  }

  function personaName(id: string) {
    return personas.find(p => p.id === id)?.name ?? id
  }

  const personasWithSkills = useMemo(() => {
    const ids = new Set(skills.flatMap(s => s.personaIds))
    return personas.filter(p => ids.has(p.id))
  }, [skills, personas])

  // Always pull from live data so edits reflect immediately
  const selectedSkill = selectedId ? skills.find(s => s.id === selectedId) ?? null : null

  return (
    <div style={{ width: '100%', height: '100%', background: '#F8FAFC', fontFamily: FONT, overflowY: 'auto', position: 'relative' }}>

      {/* ── Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '20px 32px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>Skill Library</div>
          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            {filtered.length} of {skills.length} delivery skills · invoked in{' '}
            <span style={{ color: AUCTOR_COLOR.text, fontWeight: 600 }}>Auctor</span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Stage</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <FilterPill label="All" active={filterStage === 'all'} onClick={() => setFilterStage('all')} />
              {deliveryStages.map(s => (
                <FilterPill key={s.id} label={s.number} active={filterStage === s.id} onClick={() => setFilterStage(s.id)} title={s.name} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Persona</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <FilterPill label="All" active={filterPersona === 'all'} onClick={() => setFilterPersona('all')} />
              {personasWithSkills.map(p => (
                <FilterPill key={p.id} label={p.name} active={filterPersona === p.id} onClick={() => setFilterPersona(p.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Skill cards ── */}
      <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
        {filtered.map(skill => (
          <SkillCard
            key={skill.id}
            skill={skill}
            stageName={stageName}
            personaName={personaName}
            onClick={() => setSelectedId(skill.id)}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#94A3B8', fontSize: 14 }}>
            No skills match the current filters.
          </div>
        )}
      </div>

      {/* ── Detail / Edit Modal ── */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          deliveryStages={deliveryStages}
          personas={personas}
          isEditing={isEditing}
          stageName={stageName}
          personaName={personaName}
          onClose={() => setSelectedId(null)}
          onRename={name => rename(selectedSkill.id, name)}
          onSetDescription={text => setDescription(selectedSkill.id, text)}
          onSetOverride={override => setSkillOverride(selectedSkill.id, override)}
        />
      )}
    </div>
  )
}

// ── FilterPill ────────────────────────────────────────────────────────────────

function FilterPill({ label, active, onClick, title }: { label: string; active: boolean; onClick: () => void; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: '4px 10px',
        borderRadius: 20,
        border: `1.5px solid ${active ? '#534AB7' : '#E2E8F0'}`,
        background: active ? '#534AB7' : '#fff',
        color: active ? '#fff' : '#64748B',
        fontSize: 11,
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        fontFamily: FONT,
        transition: 'all 0.1s',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

// ── SkillCard ─────────────────────────────────────────────────────────────────

function SkillCard({ skill, stageName, personaName, onClick }: {
  skill: Skill
  stageName: (id: string) => string
  personaName: (id: string) => string
  onClick: () => void
}) {
  const statusStyle = STATUS_COLORS[skill.status] ?? STATUS_COLORS.draft

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        border: '1px solid #E2E8F0',
        borderRadius: 10,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
        e.currentTarget.style.borderColor = '#A5B4FC'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'
        e.currentTarget.style.borderColor = '#E2E8F0'
      }}
    >
      {/* Top row: command + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <code style={{
          fontSize: 12, fontWeight: 700, color: '#0F172A',
          background: '#F1F5F9', border: '1px solid #E2E8F0',
          borderRadius: 5, padding: '3px 8px',
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        }}>
          {skill.command}
        </code>
        <span style={{
          fontSize: 10, fontWeight: 600,
          background: statusStyle.bg, color: statusStyle.text,
          borderRadius: 4, padding: '2px 7px',
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {statusStyle.label}
        </span>
      </div>

      {/* Skill name */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{skill.name}</div>

      {/* Stage tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {skill.stageIds.map(id => (
          <span key={id} style={{
            fontSize: 10, fontWeight: 600,
            background: STAGE_COLOR.bg, color: STAGE_COLOR.text,
            border: `1px solid ${STAGE_COLOR.border}`,
            borderRadius: 4, padding: '2px 7px',
          }}>
            {stageName(id)}
          </span>
        ))}
        <span style={{
          fontSize: 10, fontWeight: 600,
          background: AUCTOR_COLOR.bg, color: AUCTOR_COLOR.text,
          border: `1px solid ${AUCTOR_COLOR.border}`,
          borderRadius: 4, padding: '2px 7px',
        }}>
          Auctor
        </span>
      </div>

      {/* Output */}
      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>Output · </span>
        {skill.output}
      </div>

      {/* Personas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
        {skill.personaIds.map(id => (
          <span key={id} style={{
            fontSize: 10, color: '#64748B',
            background: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: 4, padding: '2px 7px',
          }}>
            {personaName(id)}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── SkillDetailModal ──────────────────────────────────────────────────────────

function SkillDetailModal({ skill, deliveryStages, personas, isEditing, stageName, personaName, onClose, onRename, onSetDescription, onSetOverride }: {
  skill: Skill
  deliveryStages: Stage[]
  personas: Persona[]
  isEditing: boolean
  stageName: (id: string) => string
  personaName: (id: string) => string
  onClose: () => void
  onRename: (name: string) => void
  onSetDescription: (text: string) => void
  onSetOverride: (override: SkillOverride) => void
}) {
  const statusStyle = STATUS_COLORS[skill.status] ?? STATUS_COLORS.draft

  function cycleStatus() {
    const idx = SKILL_STATUSES.indexOf(skill.status)
    onSetOverride({ status: SKILL_STATUSES[(idx + 1) % SKILL_STATUSES.length] })
  }

  function toggleStage(stageId: string) {
    const current = skill.stageIds
    const next = current.includes(stageId)
      ? current.filter(id => id !== stageId)
      : [...current, stageId]
    onSetOverride({ stageIds: next })
  }

  function togglePersona(personaId: string) {
    const current = skill.personaIds
    const next = current.includes(personaId)
      ? current.filter(id => id !== personaId)
      : [...current, personaId]
    onSetOverride({ personaIds: next })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 100 }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 560, maxWidth: 'calc(100vw - 48px)',
        maxHeight: 'calc(100vh - 80px)',
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        zIndex: 101,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: FONT,
      }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            {isEditing ? (
              <input
                defaultValue={skill.name}
                onBlur={e => onRename(e.target.value)}
                style={{
                  fontSize: 18, fontWeight: 700, color: '#0F172A',
                  border: '1px solid #A5B4FC', borderRadius: 6,
                  padding: '4px 8px', fontFamily: FONT, flex: 1,
                  outline: 'none', background: '#F8FAFC',
                }}
              />
            ) : (
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{skill.name}</div>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#94A3B8', fontSize: 20, lineHeight: 1, padding: 4, flexShrink: 0,
              }}
            >×</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isEditing ? (
              <input
                defaultValue={skill.command}
                onBlur={e => onSetOverride({ command: e.target.value })}
                style={{
                  fontSize: 12, fontWeight: 700, color: '#0F172A',
                  background: '#F1F5F9', border: '1px solid #A5B4FC',
                  borderRadius: 5, padding: '3px 8px',
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  outline: 'none',
                }}
              />
            ) : (
              <code style={{
                fontSize: 12, fontWeight: 700, color: '#0F172A',
                background: '#F1F5F9', border: '1px solid #E2E8F0',
                borderRadius: 5, padding: '3px 8px',
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              }}>
                {skill.command}
              </code>
            )}

            <span
              onClick={isEditing ? cycleStatus : undefined}
              style={{
                fontSize: 10, fontWeight: 600,
                background: statusStyle.bg, color: statusStyle.text,
                borderRadius: 4, padding: '2px 7px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                cursor: isEditing ? 'pointer' : 'default',
                userSelect: 'none',
              }}
            >
              {statusStyle.label}{isEditing ? ' ↻' : ''}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Description */}
          <Section label="Description">
            {isEditing ? (
              <textarea
                defaultValue={skill.description ?? ''}
                onBlur={e => onSetDescription(e.target.value)}
                placeholder="What does this skill do?"
                rows={3}
                style={{
                  width: '100%', fontSize: 13, color: '#334155',
                  border: '1px solid #CBD5E1', borderRadius: 6,
                  padding: '8px 10px', fontFamily: FONT, resize: 'vertical',
                  outline: 'none', boxSizing: 'border-box', lineHeight: 1.5,
                }}
              />
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: skill.description ? '#334155' : '#94A3B8', lineHeight: 1.6 }}>
                {skill.description || 'No description yet.'}
              </p>
            )}
          </Section>

          {/* Output */}
          <Section label="Produces">
            {isEditing ? (
              <input
                defaultValue={skill.output}
                onBlur={e => onSetOverride({ output: e.target.value })}
                style={{
                  width: '100%', fontSize: 13, color: '#334155',
                  border: '1px solid #CBD5E1', borderRadius: 6,
                  padding: '6px 10px', fontFamily: FONT,
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{skill.output}</p>
            )}
          </Section>

          {/* Stages */}
          <Section label="Delivery Stages">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {isEditing ? (
                deliveryStages.map(s => {
                  const active = skill.stageIds.includes(s.id)
                  return (
                    <span
                      key={s.id}
                      onClick={() => toggleStage(s.id)}
                      style={{
                        fontSize: 10, fontWeight: 600, cursor: 'pointer',
                        background: active ? STAGE_COLOR.bg : '#F8FAFC',
                        color: active ? STAGE_COLOR.text : '#94A3B8',
                        border: `1px solid ${active ? STAGE_COLOR.border : '#E2E8F0'}`,
                        borderRadius: 4, padding: '3px 8px', userSelect: 'none',
                        transition: 'all 0.1s',
                      }}
                    >
                      {s.number} · {s.name}
                    </span>
                  )
                })
              ) : (
                skill.stageIds.map(id => (
                  <span key={id} style={{
                    fontSize: 10, fontWeight: 600,
                    background: STAGE_COLOR.bg, color: STAGE_COLOR.text,
                    border: `1px solid ${STAGE_COLOR.border}`,
                    borderRadius: 4, padding: '3px 8px',
                  }}>
                    {stageName(id)}
                  </span>
                ))
              )}
              <span style={{
                fontSize: 10, fontWeight: 600,
                background: AUCTOR_COLOR.bg, color: AUCTOR_COLOR.text,
                border: `1px solid ${AUCTOR_COLOR.border}`,
                borderRadius: 4, padding: '3px 8px',
              }}>
                Auctor
              </span>
            </div>
          </Section>

          {/* Personas */}
          <Section label="Personas">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {isEditing ? (
                personas.map(p => {
                  const active = skill.personaIds.includes(p.id)
                  return (
                    <span
                      key={p.id}
                      onClick={() => togglePersona(p.id)}
                      style={{
                        fontSize: 10, cursor: 'pointer',
                        background: active ? '#F0F9FF' : '#F8FAFC',
                        color: active ? '#0369A1' : '#94A3B8',
                        border: `1px solid ${active ? '#7DD3FC' : '#E2E8F0'}`,
                        borderRadius: 4, padding: '3px 8px',
                        fontWeight: active ? 600 : 400, userSelect: 'none',
                        transition: 'all 0.1s',
                      }}
                    >
                      {p.name}
                    </span>
                  )
                })
              ) : (
                skill.personaIds.map(id => (
                  <span key={id} style={{
                    fontSize: 10, color: '#64748B',
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    borderRadius: 4, padding: '3px 8px',
                  }}>
                    {personaName(id)}
                  </span>
                ))
              )}
            </div>
          </Section>

        </div>
      </div>
    </>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  )
}
