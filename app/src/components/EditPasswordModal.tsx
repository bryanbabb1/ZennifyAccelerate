import { useState } from 'react'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export default function EditPasswordModal({ onConfirm, onCancel }: Props) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState(false)
  const expected = import.meta.env.VITE_EDIT_PASSWORD as string | undefined

  function attempt() {
    if (!expected || pwd === expected) {
      sessionStorage.setItem('zennify-edit-auth', '1')
      onConfirm()
    } else {
      setError(true)
      setPwd('')
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, Inter, sans-serif' }}
    >
      <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', width: 360, padding: '32px 28px' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Edit Mode</div>
        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Enter the password to unlock editing.</div>
        <input
          autoFocus
          type="password"
          value={pwd}
          onChange={e => { setPwd(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="Password"
          style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`, fontSize: 14, fontFamily: 'DM Sans, Inter, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: error ? 6 : 20 }}
        />
        {error && <div style={{ fontSize: 12, color: '#ef4444', marginBottom: 14 }}>Incorrect password.</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel}
            style={{ flex: 1, padding: '10px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif', color: '#64748b' }}>
            Cancel
          </button>
          <button onClick={attempt}
            style={{ flex: 2, padding: '10px', borderRadius: 7, border: 'none', background: '#0F6E56', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, Inter, sans-serif' }}>
            Unlock Edit Mode
          </button>
        </div>
      </div>
    </div>
  )
}
