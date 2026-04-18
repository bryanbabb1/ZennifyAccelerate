import { useCallback, useMemo, useEffect, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useChain } from '../context/ChainContext'
import { buildLayout } from '../data/layout'
import type { SelectedItem } from '../types'

import StageNode from './nodes/StageNode'
import AgentNode from './nodes/AgentNode'
import DeliverableNode from './nodes/DeliverableNode'
import RailNode from './nodes/RailNode'
import SharedToolNode from './nodes/SharedToolNode'
import PersonaBandNode from './nodes/PersonaBandNode'
import HandoffNode from './nodes/HandoffNode'
import AddButtonNode from './nodes/AddButtonNode'
import DetailPanel from './DetailPanel'
import EditPasswordModal from './EditPasswordModal'

const nodeTypes = {
  stageNode: StageNode,
  agentNode: AgentNode,
  deliverableNode: DeliverableNode,
  railNode: RailNode,
  sharedToolNode: SharedToolNode,
  personaBand: PersonaBandNode,
  handoffNode: HandoffNode,
  addButtonNode: AddButtonNode,
}

// ─── add form state ───────────────────────────────────────────────────────────
type AddKind = 'agent' | 'deliverable' | 'orchestration' | 'stage'
interface AddForm { stageId: string; kind: AddKind }

function nodeIdForItem(item: SelectedItem): string {
  switch (item.kind) {
    case 'stage': return `stage-${item.data.id}`
    case 'agent': return `agent-${item.data.id}`
    case 'deliverable': return `deliv-${item.data.id}`
    case 'orchestration': return `${item.data.type === 'rail' ? 'rail' : 'shared'}-${item.data.id}`
    case 'persona': return `persona-band`
  }
}

export default function ValueChain() {
  const { data, isEditing, toggleEditing, positions, setPosition, sizes,
          addAgent, addDeliverable, addOrchestration, addStage, notes, addNote, removeNote, reset,
          statuses, togglePersonaNode, setPersonaNote, personaInteractions,
          descriptions, owners, setDescription, setOwner, rename } = useChain()

  function handleExport() {
    const raw = localStorage.getItem('zennify-chain-v2') ?? '{}'
    const blob = new Blob([raw], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `value-chain-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string
          localStorage.setItem('zennify-chain-v2', text)
          window.location.reload()
        } catch { alert('Invalid save file') }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const [selected, setSelected] = useState<SelectedItem | null>(null)
  const [addForm, setAddForm] = useState<AddForm | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null)
  const [personaConfigId, setPersonaConfigId] = useState<string | null>(null)

  // Add form fields
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState<'custom' | 'platform'>('custom')
  const [newOrchType, setNewOrchType] = useState<'rail' | 'shared-tool'>('shared-tool')
  const [newOrchStages, setNewOrchStages] = useState<string[]>([])
  const [newStageType, setNewStageType] = useState<'presales' | 'delivery'>('presales')
  const [newStageNumber, setNewStageNumber] = useState('')

  const handleAddClick = useCallback((stageId: string, kind: 'agent' | 'deliverable') => {
    setSelected(null); setAddForm({ stageId, kind }); setNewName(''); setNewDesc(''); setNewCategory('custom')
  }, [])

  const computed = useMemo(
    () => buildLayout(data, isEditing, handleAddClick, positions, sizes),
    [data, isEditing, handleAddClick, positions, sizes]
  )

  const nodesWithPersona = useMemo(() => {
    const onPersonaClick = (id: string) => {
      if (personaConfigId !== null) {
        // in config mode: switch which persona we're configuring
        setPersonaConfigId(id)
      } else {
        // in view mode: toggle the active viewing persona
        setActivePersonaId(prev => prev === id ? null : id)
        setSelected(null)
      }
    }
    const onPersonaConfig = () => setPersonaConfigId(prev => prev === null ? (data.personas[0]?.id ?? null) : null)

    const base = computed.nodes.map(n => {
      if (n.id === 'persona-band') {
        return {
          ...n,
          data: {
            ...n.data,
            activePersonaId,
            personaConfigId,
            onPersonaClick,
            onPersonaConfig,
          },
        }
      }
      return n
    })

    if (!activePersonaId && !personaConfigId) return base

    const activeId = personaConfigId ?? activePersonaId
    const touchedIds = activeId ? (personaInteractions[activeId]?.nodeIds ?? []) : []

    return base.map(n => {
      if (n.id.startsWith('add-') || n.id === 'persona-band' || n.id === 'handoff-bridge') return n
      const isTouched = touchedIds.includes(n.id)
      if (personaConfigId) {
        return {
          ...n,
          style: {
            ...((n.style as Record<string, unknown>) ?? {}),
            opacity: isTouched ? 1 : 0.35,
            outline: isTouched ? '2px solid #FAC775' : 'none',
            transition: 'opacity 0.15s',
          },
        }
      } else {
        return {
          ...n,
          style: {
            ...((n.style as Record<string, unknown>) ?? {}),
            opacity: isTouched ? 1 : 0.15,
            transition: 'opacity 0.15s',
          },
        }
      }
    })
  }, [computed.nodes, activePersonaId, personaConfigId, personaInteractions, isEditing, data.personas])

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithPersona)
  const [edges, setEdges, onEdgesChange] = useEdgesState(computed.edges)

  useEffect(() => { setNodes(nodesWithPersona) }, [nodesWithPersona, setNodes])
  useEffect(() => { setEdges(computed.edges) }, [computed.edges, setEdges])
  // Entering persona config mode exits edit mode so nodes aren't accidentally renamed/moved
  useEffect(() => { if (personaConfigId && isEditing) toggleEditing() }, [personaConfigId])

  const onNodeDragStop = useCallback((_evt: unknown, node: { id: string; position: { x: number; y: number } }) => {
    if (!node.id.startsWith('add-') && !node.id.startsWith('handoff')) {
      setPosition(node.id, node.position)
    }
  }, [setPosition])

  const onNodeClick: NodeMouseHandler = useCallback((_evt: unknown, node: { id: string }) => {
    if (node.id.startsWith('add-')) return
    const id = node.id
    const isSkipNode = id === 'persona-band' || id.startsWith('handoff') || id.startsWith('add-')

    // In persona config mode: toggle node membership
    if (personaConfigId && !isSkipNode) {
      togglePersonaNode(personaConfigId, id)
      return
    }

    setAddForm(null)
    if (id.startsWith('stage-')) {
      const stage = data.stages.find(s => `stage-${s.id}` === id)
      if (stage) setSelected({ kind: 'stage', data: stage })
    } else if (id.startsWith('agent-')) {
      const agent = data.agents.find(a => `agent-${a.id}` === id)
      if (agent) setSelected({ kind: 'agent', data: agent })
    } else if (id.startsWith('deliv-')) {
      const deliv = data.deliverables.find(d => `deliv-${d.id}` === id)
      if (deliv) setSelected({ kind: 'deliverable', data: deliv })
    } else if (id.startsWith('rail-') || id.startsWith('shared-')) {
      const orchId = id.replace('rail-', '').replace('shared-', '')
      const orch = data.orchestration.find(o => o.id === orchId)
      if (orch) setSelected({ kind: 'orchestration', data: orch })
    } else if (id === 'persona-band') {
      // handled by persona pill clicks inside the node — do nothing here
    }
  }, [data, personaConfigId, togglePersonaNode])

  const onPaneClick = useCallback(() => {
    setSelected(null)
    setAddForm(null)
    setActivePersonaId(null)
  }, [])

  function handleAddSubmit() {
    if (!addForm || !newName.trim()) return
    if (addForm.kind === 'agent') addAgent(addForm.stageId, newName.trim(), newDesc.trim(), newCategory)
    else if (addForm.kind === 'deliverable') addDeliverable(addForm.stageId, newName.trim())
    else if (addForm.kind === 'orchestration') {
      const stages = newOrchStages.length > 0 ? newOrchStages : ['s1']
      addOrchestration(newName.trim(), newDesc.trim(), newOrchType, stages)
    } else if (addForm.kind === 'stage') {
      addStage(newStageType, newName.trim(), newStageNumber.trim() || '?')
    }
    setAddForm(null); setNewName(''); setNewDesc(''); setNewStageNumber('')
  }

  const sidebarOpen = addForm !== null || personaConfigId !== null
  const selectedNodeId = selected ? nodeIdForItem(selected) : null
  const selectedNotes = selectedNodeId ? (notes[selectedNodeId] ?? []) : []
  const activePersonaName = activePersonaId ? (data.personas.find(p => p.id === activePersonaId)?.name ?? null) : null
  const personaConfigName = personaConfigId ? (data.personas.find(p => p.id === personaConfigId)?.name ?? null) : null
  const personaConfigNodeIds = personaConfigId ? (personaInteractions[personaConfigId]?.nodeIds ?? []) : []

  const stageName = addForm?.kind !== 'orchestration' && addForm?.kind !== 'stage'
    ? data.stages.find(s => s.id === addForm?.stageId)?.name
    : null
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* ── Legend ── */}
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 5, background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontFamily: 'DM Sans, Inter, sans-serif', display: 'flex', gap: 12, alignItems: 'center', fontSize: 10.5, flexWrap: 'wrap', maxWidth: 700 }}>
        {[
          { label: 'Pre-Sales', color: '#0F6E56', bg: '#0F6E56' },
          { label: 'Delivery', color: '#534AB7', bg: '#534AB7' },
          { label: 'Custom Agent', color: '#0F6E56', bg: '#F0FDFA', bordered: true },
          { label: 'Platform / Core Tech', color: '#534AB7', bg: '#FAF5FF', bordered: true },
          { label: 'Orchestration', color: '#854F0B', bg: '#FAC775' },
        ].map(({ label, color, bg, bordered }) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 11, height: 11, borderRadius: 2, background: bg, border: bordered ? `1.5px solid ${color}` : 'none', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: '#374151' }}>{label}</span>
          </span>
        ))}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444' }}>
          <span style={{ width: 11, height: 11, borderRadius: 2, background: '#fff5f5', border: '1px solid #ef4444', display: 'inline-block' }} />
          Likely gap
        </span>
      </div>

      {/* ── Top-right controls ── */}
      <div style={{ position: 'absolute', top: 16, right: sidebarOpen ? 336 : 16, zIndex: 5, display: 'flex', alignItems: 'center', gap: 8, transition: 'right 0.2s ease' }}>

        {isEditing && (
          <>
            <button
              onClick={() => { setAddForm({ stageId: 's1', kind: 'stage' }); setNewName(''); setNewStageNumber(''); setNewStageType('presales') }}
              style={{ background: 'rgba(255,255,255,0.95)', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              + Stage
            </button>
            <button
              onClick={() => { setAddForm({ stageId: 's1', kind: 'orchestration' }); setNewName(''); setNewDesc(''); setNewOrchType('shared-tool'); setNewOrchStages([]) }}
              style={{ background: 'rgba(255,255,255,0.95)', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              + Orchestration
            </button>
            <button onClick={() => setShowResetConfirm(true)}
              style={{ background: 'rgba(255,255,255,0.95)', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: 8, padding: '7px 12px', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
              Reset
            </button>
          </>
        )}

        <button onClick={handleExport}
          title="Export save file"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          ↓ Export
        </button>
        <button onClick={handleImport}
          title="Import save file"
          style={{ background: 'rgba(255,255,255,0.95)', color: '#374151', border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
          ↑ Import
        </button>

        <button onClick={() => {
            if (isEditing) { toggleEditing(); return }
            const pwd = import.meta.env.VITE_EDIT_PASSWORD as string | undefined
            if (!pwd || sessionStorage.getItem('zennify-edit-auth') === '1') { toggleEditing() }
            else { setShowPasswordModal(true) }
          }}
          style={{ background: isEditing ? '#0F6E56' : 'rgba(255,255,255,0.95)', color: isEditing ? '#fff' : '#374151', border: `1px solid ${isEditing ? '#0F6E56' : '#e2e8f0'}`, borderRadius: 8, padding: '8px 14px', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          {isEditing ? '✓ Editing' : '✏ Edit'}
        </button>

        <div style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', fontFamily: 'DM Sans, Inter, sans-serif' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0F6E56', letterSpacing: '0.04em' }}>ZENNIFY ACCELERATE</div>
          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1 }}>AI Value Chain · Phase 0</div>
        </div>
      </div>

      {/* ── Edit mode banner ── */}
      {isEditing && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 4, background: '#0F6E56', color: '#fff', fontFamily: 'DM Sans, Inter, sans-serif', fontSize: 11, fontWeight: 500, padding: '5px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          ✏ Edit mode — <strong>drag</strong> to reposition · <strong>drag corner</strong> to resize · <strong>click name</strong> to rename · <strong>hover</strong> to delete · <strong>+ buttons</strong> to add
        </div>
      )}

      {/* ── Password modal ── */}
      {showPasswordModal && (
        <EditPasswordModal
          onConfirm={() => { setShowPasswordModal(false); toggleEditing() }}
          onCancel={() => setShowPasswordModal(false)}
        />
      )}

      {/* ── Reset confirm ── */}
      {showResetConfirm && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', fontFamily: 'DM Sans, Inter, sans-serif', textAlign: 'center', width: 320 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Reset to defaults?</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>This will clear all edits, renames, moves, resizes, and additions. The seed data will be restored.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowResetConfirm(false)} style={{ flex: 1, padding: '9px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>Cancel</button>
            <button onClick={() => { reset(); setShowResetConfirm(false) }} style={{ flex: 1, padding: '9px', borderRadius: 7, border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>Reset</button>
          </div>
        </div>
      )}

      {/* ── Canvas ── */}
      <ReactFlow
        nodes={nodes} edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        minZoom={0.15} maxZoom={2}
        fitView fitViewOptions={{ padding: 0.08 }}
        snapToGrid={isEditing} snapGrid={[20, 20]}
        nodesDraggable={isEditing}
        nodesConnectable={false}
        elementsSelectable={true}
        style={{ background: '#f8fafc', paddingTop: isEditing ? 28 : 0 }}
      >
        <Background color="#e2e8f0" gap={24} size={1} />
        <Controls position="bottom-left" />
        <MiniMap position="bottom-right"
          style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
          nodeColor={n => {
            if (n.type === 'stageNode') { const s = data.stages.find(s => `stage-${s.id}` === n.id); return s?.type === 'presales' ? '#0F6E56' : '#534AB7' }
            if (n.type === 'agentNode') { const a = data.agents.find(a => `agent-${a.id}` === n.id); return a?.category === 'platform' ? '#534AB7' : '#0F6E56' }
            if (n.type === 'railNode') return '#FAC775'
            return '#e2e8f0'
          }}
        />
      </ReactFlow>

      {/* ── Detail + Notes panel ── */}
      {selected && !addForm && !personaConfigId && (
        <DetailPanel
          key={selectedNodeId}
          item={selected}
          nodeId={selectedNodeId}
          notes={selectedNotes}
          onAddNote={text => selectedNodeId && addNote(selectedNodeId, text)}
          onRemoveNote={i => selectedNodeId && removeNote(selectedNodeId, i)}
          onClose={() => setSelected(null)}
          activePersonaId={activePersonaId}
          activePersonaName={activePersonaName}
          personaNote={activePersonaId && selectedNodeId ? (personaInteractions[activePersonaId]?.notes[selectedNodeId] ?? '') : ''}
          onPersonaNoteChange={(text) => {
            if (activePersonaId && selectedNodeId) setPersonaNote(activePersonaId, selectedNodeId, text)
          }}
          personaInteractions={personaInteractions}
          allPersonas={data.personas}
          descriptions={descriptions}
          owners={owners}
          onSetDescription={(text) => selectedNodeId && setDescription(selectedNodeId, text)}
          onSetOwner={(owner) => selectedNodeId && setOwner(selectedNodeId, owner)}
          onRename={(id, name) => {
            rename(id, name)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (selected) setSelected({ ...selected, data: { ...selected.data, name } } as any)
          }}
        />
      )}

      {/* ── Persona config panel ── */}
      {personaConfigId && (
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 320, background: '#fff', borderLeft: '1px solid #e2e8f0', overflowY: 'auto', zIndex: 10, fontFamily: 'DM Sans, Inter, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Configure Persona</span>
            <button onClick={() => setPersonaConfigId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8', padding: '0 4px' }}>×</button>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{personaConfigName}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16 }}>Use the persona pills above to switch personas.</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16, background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 6, padding: '8px 12px' }}>
              Click any node on the canvas to toggle whether <strong>{personaConfigName}</strong> interacts with it.
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              {personaConfigNodeIds.length} node{personaConfigNodeIds.length !== 1 ? 's' : ''} assigned
            </div>

            {personaConfigNodeIds.length === 0 && (
              <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginBottom: 20 }}>No nodes assigned yet — click nodes on the canvas.</div>
            )}

            {personaConfigNodeIds.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                {personaConfigNodeIds.map(nid => (
                  <div key={nid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', background: '#f8fafc', borderRadius: 4, marginBottom: 4, fontSize: 11, color: '#334155' }}>
                    <span>{nid}</span>
                    <button
                      onClick={() => togglePersonaNode(personaConfigId, nid)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13, padding: 0 }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setPersonaConfigId(null)}
              style={{ width: '100%', padding: '10px', borderRadius: 6, background: '#0F6E56', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Add form panel ── */}
      {addForm && (
        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 320, background: '#fff', borderLeft: '1px solid #e2e8f0', overflowY: 'auto', zIndex: 10, fontFamily: 'DM Sans, Inter, sans-serif' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Add {addForm.kind === 'agent' ? 'Agent' : addForm.kind === 'deliverable' ? 'Deliverable' : addForm.kind === 'stage' ? 'Stage' : 'Orchestration'}
            </span>
            <button onClick={() => setAddForm(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#94a3b8', padding: '0 4px' }}>×</button>
          </div>

          <div style={{ padding: '20px' }}>
            {stageName && (
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Adding to: <strong style={{ color: '#0F6E56' }}>{stageName}</strong></div>
            )}

            {/* Stage type selector */}
            {addForm.kind === 'stage' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['presales', 'delivery'] as const).map(t => (
                    <button key={t} onClick={() => setNewStageType(t)}
                      style={{ flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer', border: `1.5px solid ${newStageType === t ? (t === 'presales' ? '#0F6E56' : '#534AB7') : '#e2e8f0'}`, background: newStageType === t ? (t === 'presales' ? '#F0FDFA' : '#FAF5FF') : '#fff', color: newStageType === t ? (t === 'presales' ? '#064E3B' : '#3B0764') : '#6b7280', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, Inter, sans-serif' }}>
                      {t === 'presales' ? 'Pre-Sales' : 'Delivery'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stage number */}
            {addForm.kind === 'stage' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stage Number</label>
                <input value={newStageNumber} onChange={e => setNewStageNumber(e.target.value)}
                  placeholder="e.g. 6 or D4"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'DM Sans, Inter, sans-serif', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name *</label>
              <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSubmit()}
                placeholder={addForm.kind === 'agent' ? 'e.g. Discovery Agent' : addForm.kind === 'deliverable' ? 'e.g. Requirements Doc' : addForm.kind === 'stage' ? 'e.g. Post-Delivery Review' : 'e.g. Knowledge Layer'}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'DM Sans, Inter, sans-serif', boxSizing: 'border-box', outline: 'none' }} />
            </div>

            {/* Description */}
            {addForm.kind !== 'stage' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                  placeholder="What does it do?"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, fontFamily: 'DM Sans, Inter, sans-serif', boxSizing: 'border-box', outline: 'none' }} />
              </div>
            )}

            {/* Agent type */}
            {addForm.kind === 'agent' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['custom', 'platform'] as const).map(cat => (
                    <button key={cat} onClick={() => setNewCategory(cat)}
                      style={{ flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer', border: `1.5px solid ${newCategory === cat ? (cat === 'custom' ? '#0F6E56' : '#534AB7') : '#e2e8f0'}`, background: newCategory === cat ? (cat === 'custom' ? '#F0FDFA' : '#FAF5FF') : '#fff', color: newCategory === cat ? (cat === 'custom' ? '#064E3B' : '#3B0764') : '#6b7280', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, Inter, sans-serif' }}>
                      {cat === 'custom' ? '⬡ Custom' : '◈ Platform'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Orchestration-specific */}
            {addForm.kind === 'orchestration' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['rail', 'shared-tool'] as const).map(t => (
                      <button key={t} onClick={() => setNewOrchType(t)}
                        style={{ flex: 1, padding: '8px', borderRadius: 6, cursor: 'pointer', border: `1.5px solid ${newOrchType === t ? '#854F0B' : '#e2e8f0'}`, background: newOrchType === t ? '#FEF3C7' : '#fff', color: newOrchType === t ? '#78350f' : '#6b7280', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans, Inter, sans-serif' }}>
                        {t === 'rail' ? '🧠 Rail' : '⚙ Tool'}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spans stages</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {data.stages.map(s => {
                      const on = newOrchStages.includes(s.id)
                      return (
                        <button key={s.id} onClick={() => setNewOrchStages(prev => on ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                          style={{ padding: '4px 8px', borderRadius: 5, cursor: 'pointer', border: `1px solid ${on ? '#0F6E56' : '#e2e8f0'}`, background: on ? '#F0FDFA' : '#fff', color: on ? '#064E3B' : '#6b7280', fontSize: 11, fontWeight: on ? 600 : 400, fontFamily: 'DM Sans, Inter, sans-serif' }}>
                          {s.number}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <button onClick={handleAddSubmit} disabled={!newName.trim()}
              style={{ width: '100%', padding: '10px', borderRadius: 6, background: newName.trim() ? '#0F6E56' : '#e2e8f0', color: newName.trim() ? '#fff' : '#9ca3af', border: 'none', fontSize: 13, fontWeight: 600, cursor: newName.trim() ? 'pointer' : 'default', fontFamily: 'DM Sans, Inter, sans-serif' }}>
              Add {addForm.kind === 'agent' ? 'Agent' : addForm.kind === 'deliverable' ? 'Deliverable' : addForm.kind === 'stage' ? 'Stage' : 'Orchestration'}
            </button>

            {addForm.kind === 'stage' && (
              <div style={{ marginTop: 10, fontSize: 11, color: '#94a3b8', textAlign: 'center' }}>
                New stage will appear to the right — drag it into position.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
