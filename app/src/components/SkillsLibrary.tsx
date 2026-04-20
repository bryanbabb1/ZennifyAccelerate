import { useState, useMemo } from 'react'
import { useChain } from '../context/ChainContext'
import type { Skill } from '../types'

const AUCTOR_COLOR = { bg: '#FFF7ED', border: '#FDBA74', text: '#9A3412' }
const STAGE_COLOR = { bg: '#EEF2FF', border: '#A5B4FC', text: '#3730A3' }
const WS4_COLOR = { bg: '#F0FDF4', border: '#86EFAC', text: '#166534' }
const STATUS_COLORS = {
  active: { bg: '#D1FAE5', text: '#065F46', label: 'Active' },
  draft: { bg: '#FEF3C7', text: '#92400E', label: 'Draft' },
  planned: { bg: '#EDE9FE', text: '#4C1D95', label: 'Planned' },
}

const FONT = 'DM Sans, Inter, sans-serif'

export default function SkillsLibrary() {
  const { data } = useChain()
  const { skills, stages, personas, ws4EightDocFramework } = data

  const deliveryStages = useMemo(() => stages.filter(s => s.type === 'delivery'), [stages])

  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterPersona, setFilterPersona] = useState<string>('all')

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

  function ws4DocName(docId: string) {
    return ws4EightDocFramework.docs.find(d => d.id === docId)?.name ?? null
  }

  const personasWithSkills = useMemo(() => {
    const ids = new Set(skills.flatMap(s => s.personaIds))
    return personas.filter(p => ids.has(p.id))
  }, [skills, personas])

  return (
    <div style={{ width: '100%', height: '100%', background: '#F8FAFC', fontFamily: FONT, overflowY: 'auto' }}>

      {/* ── Header ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0', padding: '20px 32px 16px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.01em' }}>Skill Library</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
              {filtered.length} of {skills.length} delivery skills · invoked in <span style={{ color: AUCTOR_COLOR.text, fontWeight: 600 }}>Auctor</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>WS4 docs covered:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
              {skills.filter(s => s.ws4DocId).length} / {ws4EightDocFramework.docs.length}
            </span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Stage</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <FilterPill label="All" active={filterStage === 'all'} onClick={() => setFilterStage('all')} />
              {deliveryStages.map(s => (
                <FilterPill
                  key={s.id}
                  label={s.number}
                  active={filterStage === s.id}
                  onClick={() => setFilterStage(s.id)}
                  title={s.name}
                />
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Persona</div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <FilterPill label="All" active={filterPersona === 'all'} onClick={() => setFilterPersona('all')} />
              {personasWithSkills.map(p => (
                <FilterPill
                  key={p.id}
                  label={p.name}
                  active={filterPersona === p.id}
                  onClick={() => setFilterPersona(p.id)}
                />
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
            ws4DocName={ws4DocName}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: '#94A3B8', fontSize: 14 }}>
            No skills match the current filters.
          </div>
        )}
      </div>
    </div>
  )
}

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

function SkillCard({ skill, stageName, personaName, ws4DocName }: {
  skill: Skill
  stageName: (id: string) => string
  personaName: (id: string) => string
  ws4DocName: (docId: string) => string | null
}) {
  const statusStyle = STATUS_COLORS[skill.status]
  const ws4Name = skill.ws4DocId ? ws4DocName(skill.ws4DocId) : null

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 10,
      padding: '16px 18px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)')}
    >
      {/* Top row: command + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <code style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#0F172A',
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: 5,
          padding: '3px 8px',
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          letterSpacing: '0.01em',
        }}>
          {skill.command}
        </code>
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          background: statusStyle.bg,
          color: statusStyle.text,
          borderRadius: 4,
          padding: '2px 7px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
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
            fontSize: 10,
            fontWeight: 600,
            background: STAGE_COLOR.bg,
            color: STAGE_COLOR.text,
            border: `1px solid ${STAGE_COLOR.border}`,
            borderRadius: 4,
            padding: '2px 7px',
          }}>
            {stageName(id)}
          </span>
        ))}
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          background: AUCTOR_COLOR.bg,
          color: AUCTOR_COLOR.text,
          border: `1px solid ${AUCTOR_COLOR.border}`,
          borderRadius: 4,
          padding: '2px 7px',
        }}>
          Auctor
        </span>
      </div>

      {/* Output */}
      <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.05em' }}>Output · </span>
        {skill.output}
      </div>

      {/* WS4 badge */}
      {ws4Name && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            background: WS4_COLOR.bg,
            color: WS4_COLOR.text,
            border: `1px solid ${WS4_COLOR.border}`,
            borderRadius: 4,
            padding: '2px 7px',
          }}>
            WS4 · {ws4Name}
          </span>
        </div>
      )}

      {/* Personas */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 2 }}>
        {skill.personaIds.map(id => (
          <span key={id} style={{
            fontSize: 10,
            color: '#64748B',
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            padding: '2px 7px',
          }}>
            {personaName(id)}
          </span>
        ))}
      </div>
    </div>
  )
}
