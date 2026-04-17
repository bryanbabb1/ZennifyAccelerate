import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useChain } from '../../context/ChainContext'
import EditableText from '../EditableText'
import type { Deliverable } from '../../types'

interface Props {
  data: { deliv: Deliverable; width: number }
  selected: boolean
}

export default function DeliverableNode({ data, selected }: Props) {
  const { deliv } = data
  const { isEditing, removeDeliverable, rename, setSize, setPosition, flagged, toggleFlag } = useChain()
  const [hovered, setHovered] = useState(false)

  const isGap = deliv.buildStatus === 'likely-gap'
  const showDelete = isEditing && hovered
  const nodeId = `deliv-${deliv.id}`
  const isFlagged = flagged.includes(nodeId)

  return (
    <>
      <NodeResizer
        isVisible={isEditing}
        minWidth={60}
        minHeight={22}
        handleStyle={{ width: 7, height: 7, borderRadius: 2, background: '#FAC775', border: '1px solid #854F0B' }}
        lineStyle={{ borderColor: '#FAC775', borderWidth: 1 }}
        onResizeEnd={(_, { x, y, width, height }) => {
          setSize(nodeId, { width, height })
          setPosition(nodeId, { x, y })
        }}
      />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', minHeight: 30,
          background: isGap ? '#fff5f5' : '#f8fafc',
          border: `1px solid ${selected ? '#FAC775' : isGap ? '#ef4444' : '#e2e8f0'}`,
          borderRadius: 5,
          boxShadow: selected ? '0 0 0 2px #FAC775' : 'none',
          display: 'flex', alignItems: 'center',
          padding: '0 7px', cursor: 'pointer', userSelect: 'none', gap: 5,
          boxSizing: 'border-box', overflow: 'visible', position: 'relative',
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
        <Handle type="source" position={Position.Right} style={{ opacity: 0, pointerEvents: 'none' }} />

        <span style={{ fontSize: 10, flexShrink: 0, color: isGap ? '#ef4444' : '#64748b' }}>
          {isGap ? '⚑' : '▸'}
        </span>

        <EditableText
          value={deliv.name}
          onSave={val => rename(deliv.id, val)}
          isEditing={isEditing}
          style={{ fontSize: 10.5, fontWeight: 400, color: isGap ? '#b91c1c' : '#334155', flex: 1, wordBreak: 'break-word', whiteSpace: 'normal', fontFamily: 'DM Sans, Inter, sans-serif' }}
          inputStyle={{ fontSize: 10.5, color: '#334155' }}
        />

        {!showDelete && deliv.ws4DocMapping && (
          <span style={{ fontSize: 9, fontWeight: 600, color: '#534AB7', background: '#ede9fe', borderRadius: 3, padding: '1px 4px', flexShrink: 0 }}>WS4</span>
        )}

        {showDelete && (
          <button
            onClick={e => { e.stopPropagation(); removeDeliverable(deliv.id) }}
            style={{ flexShrink: 0, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
          >×</button>
        )}
      </div>
    </>
  )
}
