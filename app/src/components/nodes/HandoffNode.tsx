import { Handle, Position } from '@xyflow/react'

export default function HandoffNode() {
  return (
    <div
      style={{
        width: 88,
        height: 36,
        background: 'linear-gradient(90deg, #0F6E56 0%, #534AB7 100%)',
        border: '1.5px solid #334155',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />

      <span style={{
        fontFamily: 'DM Sans, Inter, sans-serif',
        fontSize: 9,
        fontWeight: 600,
        color: '#ffffff',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        ⟶ Handoff
      </span>
    </div>
  )
}
