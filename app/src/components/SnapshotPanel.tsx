import { useState, useEffect } from 'react'
import { useChain } from '../context/ChainContext'
import { saveSnapshot, listSnapshots, loadSnapshot, deleteSnapshot } from '../lib/persistence'
import type { SnapshotMeta } from '../lib/persistence'
import type { Customizations } from '../context/ChainContext'

interface Props {
  onClose: () => void
}

export default function SnapshotPanel({ onClose }: Props) {
  const { customizations, restore } = useChain()
  const [snapshots, setSnapshots] = useState<SnapshotMeta[]>([])
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmRestore, setConfirmRestore] = useState<SnapshotMeta | null>(null)

  useEffect(() => { listSnapshots().then(setSnapshots) }, [])

  async function handleSave() {
    if (!newName.trim() || saving) return
    setSaving(true)
    await saveSnapshot(newName.trim(), customizations)
    const updated = await listSnapshots()
    setSnapshots(updated)
    setNewName('')
    setSaving(false)
  }

  async function handleRestore(snap: SnapshotMeta) {
    setRestoring(snap.id)
    const state = await loadSnapshot(snap.id)
    if (state) restore(state as Customizations)
    setRestoring(null)
    setConfirmRestore(null)
    onClose()
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await deleteSnapshot(id)
    setSnapshots(prev => prev.filter(s => s.id !== id))
    setDeleting(null)
  }

  const btn: React.CSSProperties = { fontFamily: 'DM Sans, Inter, sans-serif', cursor: 'pointer', border: 'none' }

  return (
    <>
      {/* backdrop to close on outside click */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9 }} />

      <div style={{ position: 'absolute', top: 52, right: 16, zIndex: 10, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontFamily: 'DM Sans, Inter, sans-serif', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', width: 340 }}>
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>Snapshots</span>
          <button onClick={onClose} style={{ ...btn, background: 'none', fontSize: 16, color: '#94a3b8', padding: 0, lineHeight: 1 }}>×</button>
        </div>

        {/* save row */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>Save current state before making changes.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Bryan Apr 22"
              style={{ flex: 1, padding: '7px 10px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 12, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none' }}
            />
            <button
              onClick={handleSave}
              disabled={saving || !newName.trim()}
              style={{ ...btn, padding: '7px 12px', borderRadius: 6, background: newName.trim() ? '#0F6E56' : '#e2e8f0', color: newName.trim() ? '#fff' : '#9ca3af', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {/* list */}
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {snapshots.length === 0 && (
            <div style={{ padding: '20px 16px', fontSize: 12, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>No snapshots yet.</div>
          )}
          {snapshots.map(snap => (
            <div key={snap.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderBottom: '1px solid #f8fafc' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{snap.snapshot_name}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{new Date(snap.created_at).toLocaleString()}</div>
              </div>
              <button
                onClick={() => setConfirmRestore(snap)}
                disabled={restoring === snap.id}
                style={{ ...btn, padding: '4px 8px', borderRadius: 5, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                {restoring === snap.id ? '…' : 'Restore'}
              </button>
              <button
                onClick={() => handleDelete(snap.id)}
                disabled={deleting === snap.id}
                style={{ ...btn, padding: '4px 8px', borderRadius: 5, background: 'none', color: '#ef4444', border: '1px solid #fca5a5', fontSize: 12 }}>
                {deleting === snap.id ? '…' : '×'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* restore confirmation modal */}
      {confirmRestore && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', fontFamily: 'DM Sans, Inter, sans-serif', textAlign: 'center', width: 340 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Restore "{confirmRestore.snapshot_name}"?</div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 24 }}>This will replace the current canvas state. The autosave will catch up in ~2 seconds.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmRestore(null)} style={{ flex: 1, padding: '9px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>Cancel</button>
              <button onClick={() => handleRestore(confirmRestore)} style={{ flex: 1, padding: '9px', borderRadius: 7, border: 'none', background: '#1d4ed8', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>
                {restoring ? 'Restoring…' : 'Yes, restore'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
