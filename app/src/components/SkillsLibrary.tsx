import { useState, useMemo } from 'react'
import { useChain } from '../context/ChainContext'
import EditPasswordModal from './EditPasswordModal'
import type { Skill, SkillOverride, Stage, Persona } from '../types'

const STAGE_COLOR    = { bg: '#EEF2FF', border: '#A5B4FC', text: '#3730A3' }
const PRESALES_COLOR = { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' }

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  live:    { bg: '#D1FAE5', text: '#065F46', label: 'Live' },
  wip:     { bg: '#FEF3C7', text: '#92400E', label: 'WIP' },
  planned: { bg: '#EDE9FE', text: '#4C1D95', label: 'Planned' },
}
const TOOL_TAGS: Record<string, { label: string; bg: string; text: string; border: string }> = {
  auctor: { label: 'Auctor', bg: '#FFF7ED', text: '#9A3412', border: '#FDBA74' },
  claude: { label: 'Claude', bg: '#EEF2FF', text: '#3730A3', border: '#A5B4FC' },
}
const SKILL_STATUSES: Array<'live' | 'wip' | 'planned'> = ['live', 'wip', 'planned']
const SKILL_TOOLS: Array<'auctor' | 'claude'> = ['auctor', 'claude']
const FONT = 'DM Sans, Inter, sans-serif'

interface AddForm {
  name: string; command: string; output: string
  tool: 'auctor' | 'claude'; status: 'live' | 'wip' | 'planned'
  stageIds: string[]; personaIds: string[]
}
const EMPTY_FORM: AddForm = { name: '', command: '', output: '', tool: 'auctor', status: 'planned', stageIds: [], personaIds: [] }

export default function SkillsLibrary() {
  const { data, rename, setDescription, setSkillOverride, addSkill, removeSkill, owners, setOwner, statusFields, setStatusField } = useChain()
  const { skills, stages, personas } = data

  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterPersona, setFilterPersona] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addForm, setAddForm] = useState<AddForm | null>(null)

  const filtered = useMemo(() => skills.filter(skill => {
    const stageMatch = filterStage === 'all' || skill.stageIds.includes(filterStage)
    const personaMatch = filterPersona === 'all' || skill.personaIds.includes(filterPersona)
    return stageMatch && personaMatch
  }), [skills, filterStage, filterPersona])

  function stageName(id: string) {
    const s = stages.find(s => s.id === id)
    return s ? `${s.number} · ${s.name}` : id
  }
  function personaName(id: string) { return personas.find(p => p.id === id)?.name ?? id }

  const personasWithSkills = useMemo(() => {
    const ids = new Set(skills.flatMap(s => s.personaIds))
    return personas.filter(p => ids.has(p.id))
  }, [skills, personas])

  const selectedSkill = selectedId ? skills.find(s => s.id === selectedId) ?? null : null

  function toggleEdit() {
    if (isEditing) { setIsEditing(false); return }
    if (sessionStorage.getItem('zennify-edit-auth') === '1') { setIsEditing(true) }
    else { setShowPasswordModal(true) }
  }

  function handleAddSubmit() {
    if (!addForm || !addForm.name.trim() || !addForm.command.trim() || !addForm.output.trim()) return
    addSkill({ name: addForm.name.trim(), command: addForm.command.trim(), output: addForm.output.trim(), tool: addForm.tool, status: addForm.status, stageIds: addForm.stageIds, personaIds: addForm.personaIds })
    setAddForm(null)
  }

  return (
    <div style={{ width: '100%', height: '100%', background: '#F8FAFC', fontFamily: FONT, display: 'flex', overflow: 'hidden' }}>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

        {/* ── Header ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '20px 32px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>Skill Library</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{filtered.length} of {skills.length} skills</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {isEditing && (
                <button onClick={() => { setSelectedId(null); setAddForm({ ...EMPTY_FORM }) }}
                  style={{ padding: '7px 14px', borderRadius: 7, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
                  + Skill
                </button>
              )}
              <button onClick={toggleEdit}
                style={{ padding: '7px 14px', borderRadius: 7, border: `1px solid ${isEditing ? '#534AB7' : '#E2E8F0'}`, background: isEditing ? '#EEF2FF' : '#fff', color: isEditing ? '#534AB7' : '#64748B', fontSize: 12, fontWeight: isEditing ? 700 : 500, cursor: 'pointer', fontFamily: FONT }}>
                {isEditing ? '✓ Done' : '✏ Edit'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Stage</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                <FilterPill label="All" active={filterStage === 'all'} onClick={() => setFilterStage('all')} />
                {stages.filter(s => s.type === 'presales').map(s => (
                  <FilterPill key={s.id} label={`S${s.number}`} active={filterStage === s.id} onClick={() => setFilterStage(s.id)} title={s.name} color="presales" />
                ))}
                {stages.filter(s => s.type === 'delivery').map(s => (
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

        {/* Cards */}
        <div style={{ padding: '24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
          {filtered.map(skill => (
            <SkillCard key={skill.id} skill={skill} stageName={stageName} personaName={personaName}
              owner={owners[skill.id]}
              onClick={() => { setAddForm(null); setSelectedId(skill.id) }} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#94A3B8', fontSize: 14 }}>No skills match the current filters.</div>
          )}
        </div>
      </div>

      {/* ── Add Skill panel ── */}
      {addForm && (
        <div style={{ width: 340, borderLeft: '1px solid #E2E8F0', background: '#fff', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>New Skill</span>
            <button onClick={() => setAddForm(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

            <FormField label="Name *">
              <input autoFocus value={addForm.name} onChange={e => setAddForm(f => f && { ...f, name: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddSubmit()}
                placeholder="e.g. Risk Assessment" style={inputStyle} />
            </FormField>

            <FormField label="Command *">
              <input value={addForm.command} onChange={e => setAddForm(f => f && { ...f, command: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddSubmit()}
                placeholder="/my-skill" style={{ ...inputStyle, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }} />
            </FormField>

            <FormField label="Produces *">
              <input value={addForm.output} onChange={e => setAddForm(f => f && { ...f, output: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleAddSubmit()}
                placeholder="e.g. Risk assessment doc" style={inputStyle} />
            </FormField>

            <FormField label="Tool">
              <div style={{ display: 'flex', gap: 6 }}>
                {SKILL_TOOLS.map(t => { const tag = TOOL_TAGS[t]; const active = addForm.tool === t; return (
                  <span key={t} onClick={() => setAddForm(f => f && { ...f, tool: t })} style={{ fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '4px 10px', borderRadius: 4, background: active ? tag.bg : '#F8FAFC', color: active ? tag.text : '#94A3B8', border: `1px solid ${active ? tag.border : '#E2E8F0'}`, userSelect: 'none' }}>{tag.label}</span>
                )})}
              </div>
            </FormField>

            <FormField label="Status">
              <div style={{ display: 'flex', gap: 6 }}>
                {SKILL_STATUSES.map(s => { const sc = STATUS_COLORS[s]; const active = addForm.status === s; return (
                  <span key={s} onClick={() => setAddForm(f => f && { ...f, status: s })} style={{ fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '4px 10px', borderRadius: 4, background: active ? sc.bg : '#F8FAFC', color: active ? sc.text : '#94A3B8', border: `1px solid ${active ? '#CBD5E1' : '#E2E8F0'}`, userSelect: 'none' }}>{sc.label}</span>
                )})}
              </div>
            </FormField>

            <FormField label="Stages">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {stages.map(s => { const active = addForm.stageIds.includes(s.id); const col = s.type === 'presales' ? PRESALES_COLOR : STAGE_COLOR; return (
                  <span key={s.id} onClick={() => setAddForm(f => { if (!f) return f; const ids = f.stageIds.includes(s.id) ? f.stageIds.filter(id => id !== s.id) : [...f.stageIds, s.id]; return { ...f, stageIds: ids } })}
                    style={{ fontSize: 10, fontWeight: 600, cursor: 'pointer', padding: '3px 7px', borderRadius: 4, background: active ? col.bg : '#F8FAFC', color: active ? col.text : '#94A3B8', border: `1px solid ${active ? col.border : '#E2E8F0'}`, userSelect: 'none' }}>
                    {s.type === 'presales' ? `S${s.number}` : s.number} · {s.name}
                  </span>
                )})}
              </div>
            </FormField>

            <FormField label="Personas">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {personas.map(p => { const active = addForm.personaIds.includes(p.id); return (
                  <span key={p.id} onClick={() => setAddForm(f => { if (!f) return f; const ids = f.personaIds.includes(p.id) ? f.personaIds.filter(id => id !== p.id) : [...f.personaIds, p.id]; return { ...f, personaIds: ids } })}
                    style={{ fontSize: 10, cursor: 'pointer', padding: '3px 7px', borderRadius: 4, background: active ? '#F0F9FF' : '#F8FAFC', color: active ? '#0369A1' : '#94A3B8', border: `1px solid ${active ? '#7DD3FC' : '#E2E8F0'}`, fontWeight: active ? 600 : 400, userSelect: 'none' }}>{p.name}</span>
                )})}
              </div>
            </FormField>

            <button onClick={handleAddSubmit}
              disabled={!addForm.name.trim() || !addForm.command.trim() || !addForm.output.trim()}
              style={{ padding: '9px 0', borderRadius: 7, border: 'none', fontFamily: FONT, marginTop: 4, fontSize: 13, fontWeight: 700,
                background: addForm.name.trim() && addForm.command.trim() && addForm.output.trim() ? '#0F6E56' : '#E2E8F0',
                color: addForm.name.trim() && addForm.command.trim() && addForm.output.trim() ? '#fff' : '#94A3B8',
                cursor: addForm.name.trim() && addForm.command.trim() && addForm.output.trim() ? 'pointer' : 'not-allowed' }}>
              Add Skill
            </button>
          </div>
        </div>
      )}

      {/* ── Detail / Edit Modal ── */}
      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          stages={stages}
          personas={personas}
          isEditing={isEditing}
          stageName={stageName}
          personaName={personaName}
          owner={owners[selectedSkill.id] ?? ''}
          statusFields={statusFields[selectedSkill.id] ?? {}}
          onClose={() => setSelectedId(null)}
          onRename={name => rename(selectedSkill.id, name)}
          onSetDescription={text => setDescription(selectedSkill.id, text)}
          onSetOverride={override => setSkillOverride(selectedSkill.id, override)}
          onSetOwner={owner => setOwner(selectedSkill.id, owner)}
          onSetStatusField={(field, value) => setStatusField(selectedSkill.id, field, value)}
          onRemove={() => { removeSkill(selectedSkill.id); setSelectedId(null) }}
        />
      )}

      {/* ── Password modal ── */}
      {showPasswordModal && (
        <EditPasswordModal
          onConfirm={() => { setShowPasswordModal(false); setIsEditing(true) }}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', fontSize: 13, color: '#334155', border: '1px solid #CBD5E1',
  borderRadius: 6, padding: '6px 10px', fontFamily: FONT, outline: 'none', boxSizing: 'border-box',
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  )
}

function FilterPill({ label, active, onClick, title, color }: { label: string; active: boolean; onClick: () => void; title?: string; color?: 'presales' }) {
  const activeBorder = color === 'presales' ? '#86EFAC' : '#534AB7'
  const activeBg    = color === 'presales' ? '#F0FDF4' : '#534AB7'
  const activeText  = color === 'presales' ? '#166534' : '#fff'
  return (
    <button onClick={onClick} title={title} style={{
      padding: '4px 10px', borderRadius: 20,
      border: `1.5px solid ${active ? activeBorder : '#E2E8F0'}`,
      background: active ? activeBg : '#fff', color: active ? activeText : '#64748B',
      fontSize: 11, fontWeight: active ? 600 : 400, cursor: 'pointer', fontFamily: FONT,
      transition: 'all 0.1s', whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

// ── SkillCard ─────────────────────────────────────────────────────────────────

function SkillCard({ skill, stageName, personaName, owner, onClick }: {
  skill: Skill; stageName: (id: string) => string; personaName: (id: string) => string
  owner?: string; onClick: () => void
}) {
  const statusStyle = STATUS_COLORS[skill.status] ?? STATUS_COLORS.planned
  const toolTag = TOOL_TAGS[skill.tool] ?? TOOL_TAGS.auctor
  const isPresales = (id: string) => ['s1','s2','s3','s4','s5'].includes(id)

  return (
    <div onClick={onClick} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', cursor: 'pointer', transition: 'box-shadow 0.15s, border-color 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#A5B4FC' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <code style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 5, padding: '3px 8px', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{skill.command}</code>
        <span style={{ fontSize: 10, fontWeight: 600, background: statusStyle.bg, color: statusStyle.text, borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{statusStyle.label}</span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{skill.name}</div>
      {owner && <div style={{ fontSize: 11, color: '#64748B' }}>Owner: <span style={{ fontWeight: 600 }}>{owner}</span></div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {skill.stageIds.map(id => { const col = isPresales(id) ? PRESALES_COLOR : STAGE_COLOR; return (
          <span key={id} style={{ fontSize: 10, fontWeight: 600, background: col.bg, color: col.text, border: `1px solid ${col.border}`, borderRadius: 4, padding: '2px 7px' }}>{stageName(id)}</span>
        )})}
        <span style={{ fontSize: 10, fontWeight: 600, background: toolTag.bg, color: toolTag.text, border: `1px solid ${toolTag.border}`, borderRadius: 4, padding: '2px 7px' }}>{toolTag.label}</span>
      </div>
      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>Output · </span>{skill.output}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
        {skill.personaIds.map(id => (
          <span key={id} style={{ fontSize: 10, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: '2px 7px' }}>{personaName(id)}</span>
        ))}
      </div>
    </div>
  )
}

// ── SkillDetailModal ──────────────────────────────────────────────────────────

function SkillDetailModal({ skill, stages, personas, isEditing, stageName, personaName, owner, statusFields, onClose, onRename, onSetDescription, onSetOverride, onSetOwner, onSetStatusField, onRemove }: {
  skill: Skill; stages: Stage[]; personas: Persona[]; isEditing: boolean
  stageName: (id: string) => string; personaName: (id: string) => string
  owner: string
  statusFields: { sopUrl?: string; sopLabel?: string; done?: string; inProgress?: string; outstanding?: string; plan?: string }
  onClose: () => void; onRename: (name: string) => void; onSetDescription: (text: string) => void
  onSetOverride: (override: SkillOverride) => void; onSetOwner: (owner: string) => void
  onSetStatusField: (field: string, value: string) => void; onRemove: () => void
}) {
  const [confirmRemove, setConfirmRemove] = useState(false)
  const statusStyle = STATUS_COLORS[skill.status] ?? STATUS_COLORS.planned
  const isCustom = skill.id.startsWith('skill-custom-')
  const isPresales = (id: string) => ['s1','s2','s3','s4','s5'].includes(id)

  function cycleStatus() {
    const idx = SKILL_STATUSES.indexOf(skill.status)
    onSetOverride({ status: SKILL_STATUSES[(idx + 1) % SKILL_STATUSES.length] })
  }
  function toggleStage(id: string) { onSetOverride({ stageIds: skill.stageIds.includes(id) ? skill.stageIds.filter(s => s !== id) : [...skill.stageIds, id] }) }
  function togglePersona(id: string) { onSetOverride({ personaIds: skill.personaIds.includes(id) ? skill.personaIds.filter(p => p !== id) : [...skill.personaIds, id] }) }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 100 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 580, maxWidth: 'calc(100vw - 48px)', maxHeight: 'calc(100vh - 80px)', background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', zIndex: 101, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: FONT }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            {isEditing
              ? <input defaultValue={skill.name} onBlur={e => onRename(e.target.value)} style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', border: '1px solid #A5B4FC', borderRadius: 6, padding: '4px 8px', fontFamily: FONT, flex: 1, outline: 'none', background: '#F8FAFC' }} />
              : <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>{skill.name}</div>}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 20, lineHeight: 1, padding: 4, flexShrink: 0 }}>×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isEditing
              ? <input defaultValue={skill.command} onBlur={e => onSetOverride({ command: e.target.value })} style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', background: '#F1F5F9', border: '1px solid #A5B4FC', borderRadius: 5, padding: '3px 8px', fontFamily: 'ui-monospace, SFMono-Regular, monospace', outline: 'none' }} />
              : <code style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 5, padding: '3px 8px', fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>{skill.command}</code>}
            <span onClick={isEditing ? cycleStatus : undefined} style={{ fontSize: 10, fontWeight: 600, background: statusStyle.bg, color: statusStyle.text, borderRadius: 4, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em', cursor: isEditing ? 'pointer' : 'default', userSelect: 'none' }}>
              {statusStyle.label}{isEditing ? ' ↻' : ''}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Owner */}
          <Sect label="Owner">
            {isEditing
              ? <input defaultValue={owner} onBlur={e => onSetOwner(e.target.value)} placeholder="Assign an owner…" style={{ width: '100%', fontSize: 13, color: '#334155', border: '1px solid #CBD5E1', borderRadius: 6, padding: '6px 10px', fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
              : <p style={{ margin: 0, fontSize: 13, color: owner ? '#334155' : '#94A3B8' }}>{owner || 'Unassigned'}</p>}
          </Sect>

          {/* Description */}
          <Sect label="Description">
            {isEditing
              ? <textarea defaultValue={skill.description ?? ''} onBlur={e => onSetDescription(e.target.value)} placeholder="What does this skill do?" rows={3} style={{ width: '100%', fontSize: 13, color: '#334155', border: '1px solid #CBD5E1', borderRadius: 6, padding: '8px 10px', fontFamily: FONT, resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.5 }} />
              : <p style={{ margin: 0, fontSize: 13, color: skill.description ? '#334155' : '#94A3B8', lineHeight: 1.6 }}>{skill.description || 'No description yet.'}</p>}
          </Sect>

          {/* Produces */}
          <Sect label="Produces">
            {isEditing
              ? <input defaultValue={skill.output} onBlur={e => onSetOverride({ output: e.target.value })} style={{ width: '100%', fontSize: 13, color: '#334155', border: '1px solid #CBD5E1', borderRadius: 6, padding: '6px 10px', fontFamily: FONT, outline: 'none', boxSizing: 'border-box' }} />
              : <p style={{ margin: 0, fontSize: 13, color: '#334155', lineHeight: 1.5 }}>{skill.output}</p>}
          </Sect>

          {/* Status-driven fields */}
          {skill.status === 'live' && (
            <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>SOP / Guide</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input defaultValue={statusFields.sopLabel ?? ''} onBlur={e => onSetStatusField('sopLabel', e.target.value)}
                  placeholder="Label" readOnly={!isEditing}
                  style={{ flex: 1, fontSize: 12, padding: '6px 8px', border: '1px solid #A7F3D0', borderRadius: 6, fontFamily: FONT, outline: 'none', background: isEditing ? '#fff' : '#f9fefb', color: '#334155' }} />
                <input defaultValue={statusFields.sopUrl ?? ''} onBlur={e => onSetStatusField('sopUrl', e.target.value)}
                  placeholder="URL" readOnly={!isEditing}
                  style={{ flex: 2, fontSize: 12, padding: '6px 8px', border: '1px solid #A7F3D0', borderRadius: 6, fontFamily: FONT, outline: 'none', background: isEditing ? '#fff' : '#f9fefb', color: '#334155' }} />
              </div>
              {statusFields.sopUrl && !isEditing && (
                <a href={statusFields.sopUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#0F6E56', fontWeight: 600 }}>{statusFields.sopLabel || statusFields.sopUrl} ↗</a>
              )}
            </div>
          )}

          {skill.status === 'wip' && (
            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Progress Tracker</div>
              {(['done', 'inProgress', 'outstanding'] as const).map((field, i) => (
                <div key={field}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#B45309', marginBottom: 4 }}>{['Done', 'In Progress', 'Outstanding to Enable'][i]}</div>
                  <textarea key={`${skill.id}-${field}`} defaultValue={statusFields[field] ?? ''} onBlur={e => onSetStatusField(field, e.target.value)}
                    readOnly={!isEditing} rows={2} placeholder={isEditing ? 'Add notes…' : undefined}
                    style={{ width: '100%', fontSize: 12, padding: '6px 8px', border: '1px solid #FDE68A', borderRadius: 6, fontFamily: FONT, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: isEditing ? '#fff' : '#fffdf5', color: '#334155', lineHeight: 1.4 }} />
                </div>
              ))}
            </div>
          )}

          {skill.status === 'planned' && (
            <div style={{ background: '#FAF5FF', border: '1px solid #D8B4FE', borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4C1D95', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Build Checklist</div>
              <textarea key={`${skill.id}-plan`} defaultValue={statusFields.plan ?? ''} onBlur={e => onSetStatusField('plan', e.target.value)}
                readOnly={!isEditing} rows={4} placeholder={isEditing ? 'What needs to happen to build this skill?' : undefined}
                style={{ width: '100%', fontSize: 12, padding: '6px 8px', border: '1px solid #D8B4FE', borderRadius: 6, fontFamily: FONT, resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: isEditing ? '#fff' : '#fdf9ff', color: '#334155', lineHeight: 1.4 }} />
            </div>
          )}

          {/* Tool */}
          <Sect label="Tool">
            {isEditing
              ? <div style={{ display: 'flex', gap: 6 }}>
                  {SKILL_TOOLS.map(t => { const tag = TOOL_TAGS[t]; const active = skill.tool === t; return (
                    <span key={t} onClick={() => onSetOverride({ tool: t })} style={{ fontSize: 10, fontWeight: 600, cursor: 'pointer', padding: '3px 8px', borderRadius: 4, background: active ? tag.bg : '#F8FAFC', color: active ? tag.text : '#94A3B8', border: `1px solid ${active ? tag.border : '#E2E8F0'}`, userSelect: 'none' }}>{tag.label}</span>
                  )})}
                </div>
              : <span style={{ fontSize: 10, fontWeight: 600, background: TOOL_TAGS[skill.tool]?.bg, color: TOOL_TAGS[skill.tool]?.text, border: `1px solid ${TOOL_TAGS[skill.tool]?.border}`, borderRadius: 4, padding: '3px 8px', display: 'inline-block' }}>{TOOL_TAGS[skill.tool]?.label ?? skill.tool}</span>}
          </Sect>

          {/* Stages */}
          <Sect label="Stages">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {isEditing
                ? stages.map(s => { const active = skill.stageIds.includes(s.id); const col = s.type === 'presales' ? PRESALES_COLOR : STAGE_COLOR; return (
                    <span key={s.id} onClick={() => toggleStage(s.id)} style={{ fontSize: 10, fontWeight: 600, cursor: 'pointer', padding: '3px 8px', borderRadius: 4, background: active ? col.bg : '#F8FAFC', color: active ? col.text : '#94A3B8', border: `1px solid ${active ? col.border : '#E2E8F0'}`, userSelect: 'none' }}>
                      {s.type === 'presales' ? `S${s.number}` : s.number} · {s.name}
                    </span>)})
                : skill.stageIds.map(id => { const col = isPresales(id) ? PRESALES_COLOR : STAGE_COLOR; return (
                    <span key={id} style={{ fontSize: 10, fontWeight: 600, background: col.bg, color: col.text, border: `1px solid ${col.border}`, borderRadius: 4, padding: '3px 8px' }}>{stageName(id)}</span>)})}
            </div>
          </Sect>

          {/* Personas */}
          <Sect label="Personas">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {isEditing
                ? personas.map(p => { const active = skill.personaIds.includes(p.id); return (
                    <span key={p.id} onClick={() => togglePersona(p.id)} style={{ fontSize: 10, cursor: 'pointer', padding: '3px 8px', borderRadius: 4, background: active ? '#F0F9FF' : '#F8FAFC', color: active ? '#0369A1' : '#94A3B8', border: `1px solid ${active ? '#7DD3FC' : '#E2E8F0'}`, fontWeight: active ? 600 : 400, userSelect: 'none' }}>{p.name}</span>)})
                : skill.personaIds.map(id => (
                    <span key={id} style={{ fontSize: 10, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: '3px 8px' }}>{personaName(id)}</span>))}
            </div>
          </Sect>

          {/* Remove */}
          {isEditing && (
            <div style={{ marginTop: 4, paddingTop: 16, borderTop: '1px solid #FEE2E2' }}>
              {!confirmRemove
                ? <button onClick={() => setConfirmRemove(true)} style={{ background: 'none', border: '1px solid #FCA5A5', borderRadius: 7, padding: '7px 14px', color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>{isCustom ? 'Remove this skill' : 'Hide this skill'}</button>
                : <div style={{ background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#B91C1C', fontFamily: FONT }}>{isCustom ? 'Remove this skill permanently?' : 'Hide this built-in skill?'}</span>
                    {!isCustom && <span style={{ fontSize: 11.5, color: '#6B7280', fontFamily: FONT }}>Built-in skills can be restored via Reset on the canvas.</span>}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={onRemove} style={{ background: '#EF4444', border: 'none', borderRadius: 7, padding: '7px 16px', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>Yes, {isCustom ? 'remove' : 'hide'}</button>
                      <button onClick={() => setConfirmRemove(false)} style={{ background: 'none', border: '1px solid #E2E8F0', borderRadius: 7, padding: '7px 14px', color: '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Cancel</button>
                    </div>
                  </div>}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Sect({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}
