import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useChain } from '../../context/ChainContext'
import EditableText from '../EditableText'
import type { Stage } from '../../types'

interface Props {
  data: { stage: Stage }
  selected: boolean
}

export default function StageNode({ data, selected }: Props) {
  const { stage } = data
  const { isEditing, rename, setSize, setPosition, flagged, toggleFlag } = useChain()
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const isPresales = stage.type === 'presales'
  const bg = isPresales ? '#0F6E56' : '#534AB7'
  const border = isPresales ? '#04342C' : '#26215C'
  const subtleColor = isPresales ? '#99f6e0' : '#c4b5fd'
  const nodeId = `stage-${stage.id}`
  const isCustom = stage.id.startsWith('stage-custom-')
  const isFlagged = flagged.includes(nodeId)

  return (
    <>
      <NodeResizer
        isVisible={isEditing}
        minWidth={100}
        minHeight={60}
        handleStyle={{ width: 8, height: 8, borderRadius: 2, background: '#FAC775', border: '1px solid #854F0B' }}
        lineStyle={{ borderColor: '#FAC775', borderWidth: 1 }}
        onResizeEnd={(_, { x, y, width, height }) => {
          setSize(nodeId, { width, height })
          setPosition(nodeId, { x, y })
        }}
      />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setShowInfo(false) }}
        style={{
          width: '100%', minHeight: 90,
          background: bg,
          border: `1.5px solid ${selected ? '#FAC775' : border}`,
          borderRadius: 8,
          boxShadow: selected ? '0 0 0 2px #FAC775' : 'none',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '8px 10px', cursor: isEditing ? 'grab' : 'pointer', userSelect: 'none',
          position: 'relative', boxSizing: 'border-box', overflow: 'hidden',
        }}
      >
        {isFlagged && (
          <span style={{ position: 'absolute', top: -6, right: -6, fontSize: 11, zIndex: 10, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))' }}>🚩</span>
        )}
        {isEditing && (hovered || isFlagged) && (
          <button
            onClick={e => { e.stopPropagation(); toggleFlag(nodeId) }}
            title={isFlagged ? 'Remove flag' : 'Flag this node'}
            style={{ position: 'absolute', top: -8, right: isFlagged ? 10 : -8, fontSize: 10, zIndex: 11, background: isFlagged ? '#fee2e2' : 'rgba(255,255,255,0.9)', border: '1px solid #fca5a5', borderRadius: 4, cursor: 'pointer', padding: '1px 4px', lineHeight: 1.4 }}
          >{isFlagged ? '✕🚩' : '🚩'}</button>
        )}
        <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
        <Handle type="target" position={Position.Left} style={{ opacity: 0, pointerEvents: 'none' }} />
        <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 10, fontWeight: 600, color: subtleColor, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {isPresales ? 'Pre-Sales' : 'Delivery'} {stage.number}
          </span>
        </div>

        <EditableText
          value={stage.name}
          onSave={val => rename(stage.id, val)}
          isEditing={isEditing}
          style={{ fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#ffffff', lineHeight: 1.3, wordBreak: 'break-word', whiteSpace: 'normal' }}
          inputStyle={{ fontSize: 12, fontWeight: 600, color: '#0f172a', lineHeight: 1.3, background: 'rgba(255,255,255,0.95)' }}
        />

        {stage.cadence && !isEditing && (
          <div style={{ fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
            {stage.cadence}
          </div>
        )}

        {!isEditing && hovered && (stage.value || stage.outcomes.length > 0) && (
          <button
            onClick={e => { e.stopPropagation(); setShowInfo(v => !v) }}
            style={{ position: 'absolute', bottom: 6, right: 8, width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.5)', color: '#fff', fontSize: 9, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', lineHeight: 1 }}
          >i</button>
        )}

        {isEditing && hovered && !isCustom && (
          <div style={{ position: 'absolute', bottom: 5, right: 8, fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>drag ✥</div>
        )}

        {showInfo && (
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 200, maxWidth: 280, fontFamily: 'DM Sans, Inter, sans-serif' }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{stage.name}</div>
            {stage.value && <div style={{ fontSize: 11, color: '#0F6E56', fontWeight: 500, marginBottom: 6 }}>{stage.value}</div>}
            {stage.outcomes.slice(0, 4).map((o, i) => (
              <div key={i} style={{ fontSize: 10.5, color: '#475569', lineHeight: 1.5 }}>• {o}</div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
