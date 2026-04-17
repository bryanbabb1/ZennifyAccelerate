import { useState, useRef, useEffect } from 'react'

interface Props {
  value: string
  onSave: (val: string) => void
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  isEditing: boolean    // global edit mode
}

export default function EditableText({ value, onSave, style, inputStyle, isEditing }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

  function start(e: React.MouseEvent) {
    if (!isEditing) return
    e.stopPropagation()
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed && trimmed !== value) onSave(trimmed)
    else setDraft(value)
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); commit() }
    if (e.key === 'Escape') { setEditing(false); setDraft(value) }
    e.stopPropagation()
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid #FAC775',
          borderRadius: 3,
          outline: 'none',
          padding: '0 4px',
          fontFamily: 'DM Sans, Inter, sans-serif',
          width: '100%',
          minWidth: 60,
          ...inputStyle,
        }}
      />
    )
  }

  return (
    <span
      onClick={start}
      title={isEditing ? 'Click to rename' : undefined}
      style={{
        cursor: isEditing ? 'text' : 'inherit',
        borderBottom: isEditing ? '1px dashed rgba(150,150,150,0.4)' : 'none',
        ...style,
      }}
    >
      {value}
    </span>
  )
}
