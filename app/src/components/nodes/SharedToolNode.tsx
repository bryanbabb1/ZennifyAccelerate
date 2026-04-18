import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useChain } from '../../context/ChainContext'
import EditableText from '../EditableText'
import type { Orchestration } from '../../types'

interface Props {
  data: { orch: Orchestration; width: number; height: number }
  selected: boolean
}

function getStyle(id: string) {
  if (id === 'claude-project') return { bg: 'rgba(83,74,183,0.1)', border: '#534AB7', text: '#26215C' }
  return { bg: 'rgba(250,199,117,0.18)', border: '#854F0B', text: '#78350f' }
}

export default function SharedToolNode({ data, selected }: Props) {
  const { orch } = data
  const { isEditing, removeOrchestration, rename, setSize, setPosition, flagged, toggleFlag, statuses, setStatus } = useChain()
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const s = getStyle(orch.id)
  const showDelete = isEditing && hovered
  const nodeId = `shared-${orch.id}`

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
  const isFlagged = flagged.includes(nodeId)

  return (
    <>
      <NodeResizer
        isVisible={isEditing}
        minWidth={80}
        minHeight={22}
        handleStyle={{ width: 7, height: 7, borderRadius: 2, background: '#FAC775', border: '1px solid #854F0B' }}
        lineStyle={{ borderColor: s.border, borderWidth: 1 }}
        onResizeEnd={(_, { x, y, width, height }) => {
          setSize(nodeId, { width, height })
          setPosition(nodeId, { x, y })
        }}
      />
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setShowInfo(false) }}
        style={{
          width: '100%', minHeight: 30,
          background: s.bg,
          border: `1px dashed ${showDelete ? '#ef4444' : s.border}`,
          borderRadius: 4,
          boxShadow: selected ? '0 0 0 2px #FAC775' : 'none',
          display: 'flex', alignItems: 'center',
          padding: '0 8px', cursor: isEditing ? 'grab' : 'pointer',
          userSelect: 'none', gap: 6,
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

        {orch.id === 'claude-project' && <span style={{ fontSize: 10, color: s.border, flexShrink: 0 }}>◈</span>}

        <EditableText
          value={orch.name}
          onSave={val => rename(orch.id, val)}
          isEditing={isEditing}
          style={{ fontSize: 10, fontWeight: 600, color: s.text, wordBreak: 'break-word', whiteSpace: 'normal', flex: 1, fontFamily: 'DM Sans, Inter, sans-serif' }}
          inputStyle={{ fontSize: 10, fontWeight: 600, color: s.text }}
        />

        {!showDelete && (
          <span
            onClick={cycleStatus}
            title={isEditing ? 'Click to change status' : currentStatus}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0,
              fontSize: 8, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
              color: ss.text, background: ss.bg, borderRadius: 20, padding: '1px 5px 1px 4px',
              cursor: isEditing ? 'pointer' : 'default', userSelect: 'none', fontFamily: 'DM Sans, Inter, sans-serif',
              border: `1px solid ${ss.dot}33`,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
            {ss.label}
            {isEditing && <span style={{ opacity: 0.5, fontSize: 7 }}>▸</span>}
          </span>
        )}

        {showDelete && (
          <button
            onClick={e => { e.stopPropagation(); removeOrchestration(orch.id) }}
            style={{ flexShrink: 0, padding: '1px 7px', borderRadius: 4, background: '#ef4444', border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'DM Sans, Inter, sans-serif' }}
          >× Remove</button>
        )}

        {!isEditing && !showDelete && hovered && orch.description && (
          <button
            onClick={e => { e.stopPropagation(); setShowInfo(v => !v) }}
            style={{ flexShrink: 0, width: 14, height: 14, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', border: `1px solid ${s.border}`, color: s.text, fontSize: 9, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif' }}
          >i</button>
        )}
      </div>

      {showInfo && orch.description && (
        <div
          onClick={e => e.stopPropagation()}
          style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 180, maxWidth: 260, fontFamily: 'DM Sans, Inter, sans-serif' }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{orch.name}</div>
          <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{orch.description}</div>
        </div>
      )}
    </>
  )
}
