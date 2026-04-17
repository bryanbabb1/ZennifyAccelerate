import { Handle, Position } from '@xyflow/react'

interface Props {
  data: {
    label: string
    stageId: string
    kind: 'agent' | 'deliverable'
    onAdd: (stageId: string, kind: 'agent' | 'deliverable') => void
  }
}

export default function AddButtonNode({ data }: Props) {
  const { label, stageId, kind, onAdd } = data

  return (
    <div
      onClick={() => onAdd(stageId, kind)}
      style={{
        width: 148,
        height: 26,
        border: '1.5px dashed #94a3b8',
        borderRadius: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        gap: 5,
        background: 'transparent',
        transition: 'border-color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = '#FAC775'
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(250,199,117,0.08)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = '#94a3b8'
        ;(e.currentTarget as HTMLDivElement).style.background = 'transparent'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />

      <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1 }}>+</span>
      <span style={{
        fontFamily: 'DM Sans, Inter, sans-serif',
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: 500,
      }}>
        {label}
      </span>
    </div>
  )
}
