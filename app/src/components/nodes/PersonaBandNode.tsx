import { Handle, Position } from '@xyflow/react'
import type { Persona } from '../../types'

interface Props {
  data: {
    personas: Persona[]
    height: number
    activePersonaId?: string | null
    personaConfigId?: string | null
    onPersonaClick?: (id: string) => void
    onPersonaConfig?: () => void
  }
}

export default function PersonaBandNode({ data }: Props) {
  const { personas, height, activePersonaId, personaConfigId, onPersonaClick, onPersonaConfig } = data

  const inConfigMode = !!personaConfigId
  const inViewMode = !!activePersonaId && !personaConfigId

  return (
    <div style={{
      width: 118,
      height: height ?? 720,
      background: inConfigMode ? '#fffbeb' : '#f8fafc',
      border: `1.5px solid ${inConfigMode ? '#fde68a' : '#e2e8f0'}`,
      borderRadius: 10,
      display: 'flex',
      flexDirection: 'column',
      padding: '14px 10px 12px',
      userSelect: 'none',
    }}>
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />

      <div style={{
        fontSize: 8.5,
        fontWeight: 700,
        color: inConfigMode ? '#92400e' : '#94a3b8',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 12,
        textAlign: 'center',
      }}>
        {inConfigMode ? 'Configuring' : 'Personas'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {personas.map(p => {
          const isActive = activePersonaId === p.id || personaConfigId === p.id
          return (
            <span
              key={p.id}
              onClick={e => { e.stopPropagation(); onPersonaClick?.(p.id) }}
              style={{
                fontFamily: 'DM Sans, Inter, sans-serif',
                fontSize: 10,
                fontWeight: isActive ? 700 : 400,
                color: isActive
                  ? (inConfigMode ? '#78350f' : '#0F6E56')
                  : '#64748b',
                background: isActive
                  ? (inConfigMode ? '#fef3c7' : '#F0FDFA')
                  : '#ffffff',
                border: `1.5px solid ${isActive
                  ? (inConfigMode ? '#FAC775' : '#0F6E56')
                  : '#e2e8f0'}`,
                borderRadius: 6,
                padding: '5px 6px',
                textAlign: 'center',
                cursor: onPersonaClick ? 'pointer' : 'default',
                transition: 'all 0.15s',
                lineHeight: 1.2,
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
            marginTop: 10,
            padding: '5px 6px',
            borderRadius: 6,
            background: inConfigMode ? '#FAC775' : '#ffffff',
            border: `1px solid ${inConfigMode ? '#854F0B' : '#e2e8f0'}`,
            color: inConfigMode ? '#78350f' : '#374151',
            fontSize: 9,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'DM Sans, Inter, sans-serif',
            width: '100%',
          }}
        >
          {inConfigMode ? 'Configuring…' : 'Edit'}
        </button>
      )}

      {inViewMode && (
        <div style={{
          marginTop: 10,
          fontSize: 8,
          color: '#0F6E56',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.4,
        }}>
          Click pane to clear
        </div>
      )}
    </div>
  )
}
