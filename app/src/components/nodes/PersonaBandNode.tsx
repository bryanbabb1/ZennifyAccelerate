import { Handle, Position } from '@xyflow/react'
import type { Persona } from '../../types'

interface Props {
  data: {
    personas: Persona[]
    width: number
    activePersonaId?: string | null
    personaConfigId?: string | null
    onPersonaClick?: (id: string) => void
    onPersonaConfig?: () => void
  }
}

export default function PersonaBandNode({ data }: Props) {
  const { personas, width, activePersonaId, personaConfigId, onPersonaClick, onPersonaConfig } = data

  const inConfigMode = !!personaConfigId
  const inViewMode = !!activePersonaId && !personaConfigId

  return (
    <div
      style={{
        width,
        height: 48,
        background: inConfigMode ? '#fffbeb' : '#f1f5f9',
        border: `1px solid ${inConfigMode ? '#fde68a' : '#e2e8f0'}`,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 0,
        userSelect: 'none',
      }}
    >
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />

      <span style={{
        fontFamily: 'DM Sans, Inter, sans-serif',
        fontSize: 9.5,
        fontWeight: 600,
        color: inConfigMode ? '#92400e' : '#64748b',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginRight: 16,
        flexShrink: 0,
      }}>
        {inConfigMode ? 'Configuring' : 'Personas'}
      </span>

      <div style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, overflow: 'hidden', flex: 1 }}>
        {personas.map(p => {
          const isActive = (activePersonaId === p.id) || (personaConfigId === p.id)
          return (
            <span
              key={p.id}
              onClick={e => { e.stopPropagation(); onPersonaClick?.(p.id) }}
              style={{
                fontFamily: 'DM Sans, Inter, sans-serif',
                fontSize: 10.5,
                fontWeight: isActive ? 600 : 400,
                color: isActive
                  ? (inConfigMode ? '#78350f' : '#0F6E56')
                  : '#475569',
                background: isActive
                  ? (inConfigMode ? '#fef3c7' : '#ffffff')
                  : '#e2e8f0',
                border: isActive
                  ? `1.5px solid ${inConfigMode ? '#FAC775' : '#0F6E56'}`
                  : '1.5px solid transparent',
                borderRadius: 12,
                padding: '3px 9px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: onPersonaClick ? 'pointer' : 'default',
                transition: 'all 0.15s',
              }}
            >
              {p.name}
            </span>
          )
        })}
      </div>

      {!inViewMode && onPersonaConfig && (
        <button
          onClick={e => { e.stopPropagation(); onPersonaConfig?.() }}
          style={{
            marginLeft: 12,
            flexShrink: 0,
            padding: '3px 10px',
            borderRadius: 6,
            background: inConfigMode ? '#FAC775' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${inConfigMode ? '#854F0B' : '#e2e8f0'}`,
            color: inConfigMode ? '#78350f' : '#374151',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'DM Sans, Inter, sans-serif',
          }}
        >
          {inConfigMode ? 'Configuring…' : 'Edit Personas'}
        </button>
      )}

      {!onPersonaConfig && !inViewMode && (
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'DM Sans, Inter, sans-serif',
          fontSize: 9,
          color: '#94a3b8',
          flexShrink: 0,
          paddingLeft: 12,
        }}>
          All personas engage all stages
        </span>
      )}

      {inViewMode && (
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'DM Sans, Inter, sans-serif',
          fontSize: 9,
          color: '#0F6E56',
          flexShrink: 0,
          paddingLeft: 12,
          fontWeight: 600,
        }}>
          Viewing persona journey — click pane to clear
        </span>
      )}
    </div>
  )
}
