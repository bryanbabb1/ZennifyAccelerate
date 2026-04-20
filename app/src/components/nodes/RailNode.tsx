import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useChain } from '../../context/ChainContext'
import EditableText from '../EditableText'
import type { Orchestration } from '../../types'

interface Props {
  data: { orch: Orchestration; width: number; height: number }
  selected: boolean
}

export default function RailNode({ data, selected }: Props) {
  const { orch } = data
  const { isEditing, rename, setSize, setPosition, flagged, toggleFlag, statuses, setStatus } = useChain()
  const [hovered, setHovered] = useState(false)

  const isSales = orch.id === 'sales-brain'
  const nodeId = `rail-${orch.id}`
  const isFlagged = flagged.includes(nodeId)

  type Status = 'live' | 'wip' | 'planned'
  const STATUS_CYCLE: Status[] = ['planned', 'wip', 'live']
  const STATUS_STYLE: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
    live:    { label: 'Live',    dot: '#10b981', bg: '#d1fae5', text: '#065f46' },
    wip:     { label: 'WIP',     dot: '#f59e0b', bg: '#fef3c7', text: '#78350f' },
    planned: { label: 'Planned', dot: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
  }
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
        minWidth={80}
        minHeight={28}
        handleStyle={{ width: 7, height: 7, borderRadius: 2, background: '#854F0B', border: '1px solid #78350f' }}
        lineStyle={{ borderColor: '#854F0B', borderWidth: 1 }}
        onResizeEnd={(_, { x, y, width, height }) => {
          setSize(nodeId, { width, height })
          setPosition(nodeId, { x, y })
        }}
      />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%', minHeight: 40,
          background: '#FAC775',
          border: '1.5px solid #854F0B',
          borderRadius: 6,
          boxShadow: selected ? '0 0 0 2px #FAC775' : 'none',
          display: 'flex', alignItems: 'center',
          padding: '0 12px', cursor: isEditing ? 'grab' : 'pointer',
          userSelect: 'none', gap: 8, position: 'relative',
          boxSizing: 'border-box', overflow: 'hidden',
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

        <span style={{ fontSize: 11, flexShrink: 0 }}>{isSales ? '🧠' : '⚙️'}</span>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
          <EditableText
            value={orch.name}
            onSave={val => rename(orch.id, val)}
            isEditing={isEditing}
            style={{ fontSize: 11, fontWeight: 700, color: '#78350f', letterSpacing: '0.02em', fontFamily: 'DM Sans, Inter, sans-serif', wordBreak: 'break-word', whiteSpace: 'normal' }}
            inputStyle={{ fontSize: 11, fontWeight: 700, color: '#78350f' }}
          />
        </div>

        <span
          onClick={cycleStatus}
          title={isEditing ? 'Click to change status' : currentStatus}
          style={{
            marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
            fontSize: 8.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
            color: ss.text, background: ss.bg, borderRadius: 20, padding: '1px 6px 1px 4px',
            cursor: isEditing ? 'pointer' : 'default', userSelect: 'none', fontFamily: 'DM Sans, Inter, sans-serif',
            border: `1px solid ${ss.dot}33`,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
          {ss.label}
          {isEditing && <span style={{ opacity: 0.5, fontSize: 7 }}>▸</span>}
        </span>

      </div>

    </>
  )
}
