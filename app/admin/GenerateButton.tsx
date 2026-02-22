'use client'

import { useState } from 'react'

interface GenerateButtonProps {
  id: string
  token: string
  alreadySent: boolean
}

export function GenerateButton({ id, token, alreadySent }: GenerateButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>(
    alreadySent ? 'sent' : 'idle'
  )
  const [errorMsg, setErrorMsg] = useState('')

  async function handleClick() {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, token }),
      })
      if (res.status === 409) {
        setStatus('sent')
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      setStatus('sent')
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  if (status === 'sent') {
    return (
      <span className="text-xs text-[#00c8ff] tracking-widest uppercase font-medium">
        Sent ✓
      </span>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col gap-1">
        <button
          onClick={handleClick}
          className="text-xs text-red-400 tracking-widest uppercase underline"
        >
          Retry
        </button>
        <span className="text-[10px] text-red-400/70">{errorMsg}</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      className="text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-[#00c8ff]/40 text-[#00c8ff] hover:bg-[#00c8ff]/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {status === 'loading' ? 'Generating…' : 'Generate & Send'}
    </button>
  )
}
