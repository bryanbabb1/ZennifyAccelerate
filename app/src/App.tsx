import { useState } from 'react'
import { ChainProvider } from './context/ChainContext'
import ValueChain from './components/ValueChain'
import SkillsLibrary from './components/SkillsLibrary'

type View = 'chain' | 'skills'

const FONT = 'DM Sans, Inter, sans-serif'

export default function App() {
  const [view, setView] = useState<View>('chain')

  return (
    <ChainProvider>
      <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* ── Nav bar ── */}
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #E2E8F0',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          height: 44,
          flexShrink: 0,
          zIndex: 20,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F6E56', letterSpacing: '0.05em', marginRight: 16 }}>
            ZENNIFY ACCELERATE
          </span>
          {([
            { id: 'chain', label: 'Value Chain' },
            { id: 'skills', label: 'Skill Library' },
          ] as { id: View; label: string }[]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: 'none',
                background: view === tab.id ? '#EEF2FF' : 'transparent',
                color: view === tab.id ? '#534AB7' : '#64748B',
                fontFamily: FONT,
                fontSize: 12,
                fontWeight: view === tab.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.1s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── View ── */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {view === 'chain' ? <ValueChain /> : <SkillsLibrary />}
        </div>

      </div>
    </ChainProvider>
  )
}
