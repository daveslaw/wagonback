'use client'

// PROTOTYPE — throwaway UI-prototype switcher (see .claude/skills/prototype). Lets ticket
// #12 be reacted to live on the real hero. Gated on NODE_ENV so it can never ship.

import { useEffect, type CSSProperties } from 'react'

export type PrototypeVariant = { key: string; label: string }

export function PrototypeSwitcher({
  variants,
  current,
  onChange,
}: {
  variants: PrototypeVariant[]
  current: string
  onChange: (key: string) => void
}) {
  if (process.env.NODE_ENV === 'production') return null

  const index = variants.findIndex((v) => v.key === current)
  const cycle = (dir: 1 | -1) => {
    const next = (index + dir + variants.length) % variants.length
    onChange(variants[next].key)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return
      if (e.key === 'ArrowLeft') cycle(-1)
      if (e.key === 'ArrowRight') cycle(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const active = variants[index]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 10px 8px 16px',
        borderRadius: 999,
        background: 'rgba(10, 14, 20, 0.92)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#fff',
      }}
    >
      <span style={{ opacity: 0.6 }}>PROTOTYPE</span>
      <button onClick={() => cycle(-1)} style={btnStyle} aria-label="Previous variant">
        ←
      </button>
      <span style={{ minWidth: 140, textAlign: 'center' }}>
        {active.key} — {active.label}
      </span>
      <button onClick={() => cycle(1)} style={btnStyle} aria-label="Next variant">
        →
      </button>
    </div>
  )
}

const btnStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.1)',
  border: 'none',
  color: '#fff',
  width: 26,
  height: 26,
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: 14,
}
