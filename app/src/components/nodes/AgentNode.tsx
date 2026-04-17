import { Handle, Position, NodeResizer } from '@xyflow/react'
import { useState } from 'react'
import { useChain } from '../../context/ChainContext'
import EditableText from '../EditableText'
import type { Agent } from '../../types'

interface Props {
  data: { agent: Agent; width: number; spanning: boolean }
  selected: boolean
}

const AGENT_STYLES = {
  custom: { bg: '#F0FDFA', border: '#0F6E56', text: '#064E3B', icon: '⬡', iconColor: '#0F6E56', label: 'Agent', labelColor: '#0F6E56', labelBg: '#CCFBEF' },
  platform: { bg: '#FAF5FF', border: '#534AB7', text: '#3B0764', icon: '◈', iconColor: '#534AB7', label: 'Platform', labelColor: '#534AB7', labelBg: '#EDE9FE' },
}

type Status = 'live' | 'wip' | 'planned'
const STATUS_CYCLE: Status[] = ['planned', 'wip', 'live']
const STATUS_STYLE: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  live:    { label: 'Live',    dot: '#10b981', bg: '#d1fae5', text: '#065f46' },
  wip:     { label: 'WIP',     dot: '#f59e0b', bg: '#fef3c7', text: '#78350f' },
  planned: { label: 'Planned', dot: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
}

function defaultStatus(agentStatus: string): Status {
  if (agentStatus === 'production') return 'live'
  if (agentStatus === 'in-development') return 'wip'
  return 'planned'
}

export default function AgentNode({ data, selected }: Props) {
  const { agent, spanning } = data
  const { isEditing, removeAgent, rename, setSize, setPosition, statuses, setStatus, flagged, toggleFlag } = useChain()
  const [hovered, setHovered] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const style = AGENT_STYLES[agent.category === 'platform' ? 'platform' : 'custom']
  const showDelete = isEditing && hovered
  const nodeId = `agent-${agent.id}`
  const isFlagged = flagged.includes(nodeId)

  const currentStatus: Status = statuses[nodeId] ?? defaultStatus(agent.status)
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
        minHeight={24}
        handleStyle={{ width: 7, height: 7, borderRadius: 2, background: '#FAC775', border: '1px solid #854F0B' }}
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
          width: '100%', minHeight: 34,
          background: style.bg,
          border: `1.5px solid ${selected ? '#FAC775' : style.border}`,
          borderRadius: spanning ? 20 : 6,
          boxShadow: selected ? '0 0 0 2px #FAC775' : 'none',
          display: 'flex', flexDirection: 'column',
          padding: '5px 8px', cursor: 'pointer', userSelect: 'none',
          boxSizing: 'border-box', position: 'relative',
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
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
        <Handle type="target" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />

        {/* name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minHeight: 22 }}>
          <span style={{ fontSize: 11, flexShrink: 0, color: style.iconColor }}>{style.icon}</span>

          <EditableText
            value={agent.name}
            onSave={val => rename(agent.id, val)}
            isEditing={isEditing}
            style={{ fontSize: 11, fontWeight: 500, color: style.text, flex: 1, wordBreak: 'break-word', whiteSpace: 'normal', fontFamily: 'DM Sans, Inter, sans-serif' }}
            inputStyle={{ fontSize: 11, fontWeight: 500, color: style.text }}
          />

          {!showDelete && (
            <span style={{ fontSize: 8.5, fontWeight: 600, color: style.labelColor, background: style.labelBg, borderRadius: 4, padding: '1px 5px', flexShrink: 0, letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              {style.label}
            </span>
          )}

          {!isEditing && hovered && agent.description && (
            <button
              onClick={e => { e.stopPropagation(); setShowInfo(v => !v) }}
              title="Info"
              style={{ flexShrink: 0, width: 15, height: 15, borderRadius: '50%', background: '#e2e8f0', border: '1px solid #94a3b8', color: '#475569', fontSize: 9, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'serif', lineHeight: 1 }}
            >i</button>
          )}

          {showDelete && (
            <button
              onClick={e => { e.stopPropagation(); removeAgent(agent.id) }}
              style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
            >×</button>
          )}
        </div>

        {/* info popover */}
        {showInfo && agent.description && (
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, zIndex: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', minWidth: 200, maxWidth: 280, fontFamily: 'DM Sans, Inter, sans-serif' }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>{agent.name}</div>
            <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{agent.description}</div>
          </div>
        )}

        {/* status badge row */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
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
              transition: 'opacity 0.15s',
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
