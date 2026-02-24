'use client'

import { useState, useTransition } from 'react'
import { loginAction } from './actions'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">Wagon Back</span>
          <span className="w-px h-3 bg-[#00c8ff]/40" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#00c8ff]/70">Admin</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <div className="w-8 h-px bg-[#00c8ff] mb-5" />
          <h1 className="text-2xl font-extralight tracking-wide uppercase text-white">
            Sign In
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-xs tracking-widest uppercase text-white/40">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 transition-colors h-11"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#00c8ff] text-[#0d0d0d] font-medium tracking-widest text-xs uppercase rounded-full h-11 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
