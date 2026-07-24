import { useState, FormEvent, ReactNode } from 'react'
import { LOGO_WHITE } from '../data/assetsData'

// Temporary soft gate until the site is ready for launch. This is a client-side
// check only (not real security) — remove <PasswordGate> in App.tsx to open it up.
const PASSWORD = 'ZA26'
const KEY = 'za_unlocked'

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(() => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })
  const [val, setVal] = useState('')
  const [err, setErr] = useState(false)

  if (ok) return <>{children}</>

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (val.trim() === PASSWORD) {
      try { localStorage.setItem(KEY, '1') } catch { /* ignore */ }
      setOk(true)
    } else {
      setErr(true)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#1C4A4D',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif", padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <img src={LOGO_WHITE} alt="Zennify" style={{ height: 32, marginBottom: 34 }} />
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '1.6px', textTransform: 'uppercase',
          color: '#62D7B8', marginBottom: 24,
        }}>Private view</div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={val}
            autoFocus
            onChange={e => { setVal(e.target.value); setErr(false) }}
            placeholder="Access code"
            style={{
              padding: '12px 14px', borderRadius: 6, border: err ? '1px solid #FE9732' : '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 15,
              fontFamily: "'DM Sans', system-ui, sans-serif", textAlign: 'center', letterSpacing: '2px',
            }}
          />
          <button type="submit" style={{
            padding: '12px 14px', borderRadius: 6, border: 'none', background: '#27BBAF', color: '#fff',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>Enter</button>
          {err && <div style={{ color: '#FE9732', fontSize: 12.5, fontWeight: 500 }}>Incorrect code, try again.</div>}
        </form>
      </div>
    </div>
  )
}
