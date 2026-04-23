import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useChain } from '../../context/ChainContext'
import EditableText from '../EditableText'
import type { Deliverable } from '../../types'

interface Props {
  data: { deliv: Deliverable; width: number }
  selected: boolean
}

type Status = 'live' | 'wip' | 'planned'
const STATUS_CYCLE: Status[] = ['planned', 'wip', 'live']
const STATUS_STYLE: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  live:    { label: 'Live',    dot: '#10b981', bg: '#d1fae5', text: '#065f46' },
  wip:     { label: 'WIP',     dot: '#f59e0b', bg: '#fef3c7', text: '#78350f' },
  planned: { label: 'Planned', dot: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
}

export default function DeliverableNode({ data, selected }: Props) {
  const { deliv } = data
  const { isEditing, rename, setSize, setPosition, flagged, toggleFlag, statuses, setStatus } = useChain()
  const [hovered, setHovered] = useState(false)

  const nodeId = `deliv-${deliv.id}`
  const isFlagged = flagged.includes(nodeId)

  const currentStatus: Status = statuses[nodeId] ?? 'planned'
  const ss = STATUS_STYLE[currentStatus]

  function cycleStatus(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isEditing) return
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(currentStatus) + 1) % STATUS_CYCLE.length]
    setStatus(nodeId, next)
  }

  return (
    <>
      <NodeResizer
        isVisible={isEditing}
        minWidth={60}
        minHeight={22}
        handleStyle={{ width: 7, height: 7, borderRadius: 2, background: '#0e7490', border: '1px solid #0e7490' }}
        lineStyle={{ borderColor: '#0e7490', borderWidth: 1 }}
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
          background: deliv.isRecurring ? '#fffbeb' : '#ecfeff',
          border: `1px solid ${selected ? '#0e7490' : deliv.isRecurring ? '#fcd34d' : '#67e8f9'}`,
          borderRadius: 5,
          boxShadow: selected ? '0 0 0 2px #a5f3fc' : 'none',
          display: 'flex', flexDirection: 'column',
          padding: '4px 7px', cursor: 'pointer', userSelect: 'none',
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

        {/* name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minHeight: 20 }}>
          <span style={{ fontSize: 10, flexShrink: 0, color: deliv.isRecurring ? '#b45309' : '#0e7490' }}>{deliv.isRecurring ? '↺' : '▸'}</span>
          <EditableText
            value={deliv.name}
            onSave={val => rename(deliv.id, val)}
            isEditing={isEditing}
            style={{ fontSize: 10.5, fontWeight: 500, color: deliv.isRecurring ? '#92400e' : '#164e63', flex: 1, wordBreak: 'break-word', whiteSpace: 'normal', fontFamily: 'DM Sans, Inter, sans-serif' }}
            inputStyle={{ fontSize: 10.5, color: '#164e63' }}
          />
        </div>

        {/* status badge */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 3 }}>
          <span
            onClick={cycleStatus}
            title={isEditing ? 'Click to change status' : currentStatus}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 9, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: ss.text, background: ss.bg,
              borderRadius: 20, padding: '1px 7px 1px 5px',
              cursor: isEditing ? 'pointer' : 'default',
              userSelect: 'none', fontFamily: 'DM Sans, Inter, sans-serif',
              border: `1px solid ${ss.dot}33`,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, flexShrink: 0, display: 'inline-block' }} />
            {ss.label}
            {isEditing && <span style={{ opacity: 0.5, fontSize: 8 }}>▸</span>}
          </span>
        </div>
      </div>
    </>
  )
}
