'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import styles from './assessment.module.css'
import {
  AssessmentFormData,
  PAIN_POINTS,
  TOOL_OPTIONS,
  TEAM_SIZES,
  REVENUE_RANGES,
  BUDGET_RANGES,
  TIMELINES,
  INDUSTRIES,
} from '@/types/assessment'

const TOTAL_STEPS = 3

const emptyForm: AssessmentFormData = {
  business_name: '',
  contact_name: '',
  email: '',
  phone: '',
  industry: '',
  team_size: '',
  pain_points: [],
  current_tools: [],
  time_drains: '',
  desired_outcomes: '',
  revenue_range: '',
  budget_range: '',
  timeline: '',
  additional_notes: '',
}

export default function AssessmentPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<AssessmentFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setField = (field: keyof AssessmentFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const toggleArray = (field: 'pain_points' | 'current_tools', value: string) => {
    setForm((prev) => {
      const arr = prev[field] as string[]
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }
      router.push('/confirmation')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Top bar */}
      <div className="px-4 md:px-8 py-5 flex items-center justify-between border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs tracking-widest uppercase">
          <ArrowLeft size={14} />
          Back
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extralight tracking-[0.15em] uppercase text-white/50">
            Wagon Back
          </span>
          <span className="w-px h-3 bg-[#00c8ff]/40" />
          <span className="text-xs font-light tracking-[0.12em] uppercase text-[#00c8ff]/70">
            Solutions
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-px bg-white/5">
        <div
          className={styles.progressFill}
          style={{ '--progress': `${(step / TOTAL_STEPS) * 100}%` } as React.CSSProperties}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-12 md:py-16">
        <div className="w-full max-w-xl md:max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-[9px] tracking-[0.3em] uppercase text-[#00c8ff]/60">
              Step {step} of {TOTAL_STEPS}
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 w-6 rounded-full transition-all duration-300 ${
                    i + 1 <= step ? 'bg-[#00c8ff]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: About Your Business */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extralight tracking-wide uppercase text-white mb-2">
                  About Your Business
                </h1>
                <p className="text-sm text-white/40">Tell us a bit about who you are.</p>
              </div>

              <div className="space-y-5">
                <Field label="Business Name" id="business_name" required>
                  <Input
                    id="business_name"
                    placeholder="Acme (Pty) Ltd"
                    value={form.business_name}
                    onChange={(v) => setField('business_name', v)}
                  />
                </Field>
                <Field label="Your Name" id="contact_name" required>
                  <Input
                    id="contact_name"
                    placeholder="Jane Smith"
                    value={form.contact_name}
                    onChange={(v) => setField('contact_name', v)}
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Email Address" id="email" required>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@acme.co.za"
                      value={form.email}
                      onChange={(v) => setField('email', v)}
                    />
                  </Field>
                  <Field label="Phone Number" id="phone">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+27 71 000 0000"
                      value={form.phone}
                      onChange={(v) => setField('phone', v)}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Industry" id="industry" required>
                    <Select
                      id="industry"
                      value={form.industry}
                      onChange={(v) => setField('industry', v)}
                      options={INDUSTRIES as unknown as string[]}
                      placeholder="Select industry"
                    />
                  </Field>
                  <Field label="Team Size" id="team_size" required>
                    <Select
                      id="team_size"
                      value={form.team_size}
                      onChange={(v) => setField('team_size', v)}
                      options={TEAM_SIZES as unknown as string[]}
                      placeholder="Select team size"
                    />
                  </Field>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!form.business_name || !form.contact_name || !form.email || !form.industry || !form.team_size}
                  className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-white disabled:opacity-30 font-medium tracking-widest text-xs uppercase rounded-full px-8 h-11 touch-manipulation"
                >
                  Continue
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Current Challenges */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extralight tracking-wide uppercase text-white mb-2">
                  Current Challenges
                </h1>
                <p className="text-sm text-white/40">Help us understand what&#39;s slowing you down.</p>
              </div>

              <div className="space-y-7">
                <Field label="What are your biggest pain points? (Select all that apply)">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {PAIN_POINTS.map((pt) => (
                      <CheckItem
                        key={pt}
                        label={pt}
                        checked={form.pain_points.includes(pt)}
                        onChange={() => toggleArray('pain_points', pt)}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Which tools / platforms does your business currently use?">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {TOOL_OPTIONS.map((tool) => (
                      <CheckItem
                        key={tool}
                        label={tool}
                        checked={form.current_tools.includes(tool)}
                        onChange={() => toggleArray('current_tools', tool)}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Describe your biggest time drains in your own words" id="time_drains">
                  <textarea
                    id="time_drains"
                    value={form.time_drains}
                    onChange={(e) => setField('time_drains', e.target.value)}
                    placeholder="e.g. Every morning I manually copy orders from Shopify into Xero and update our CRM..."
                    rows={4}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 resize-none transition-colors"
                  />
                </Field>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="text-white/40 hover:text-white border border-white/10 hover:border-white/30 tracking-widest text-xs uppercase rounded-full px-6 h-11 touch-manipulation"
                >
                  <ArrowLeft size={14} className="mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-white font-medium tracking-widest text-xs uppercase rounded-full px-8 h-11 touch-manipulation"
                >
                  Continue
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Budget */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extralight tracking-wide uppercase text-white mb-2">
                  Goals &amp; Budget
                </h1>
                <p className="text-sm text-white/40">Help us scope the right solution for you.</p>
              </div>

              <div className="space-y-5">
                <Field label="What outcomes are you hoping for?" id="desired_outcomes" required>
                  <textarea
                    id="desired_outcomes"
                    value={form.desired_outcomes}
                    onChange={(e) => setField('desired_outcomes', e.target.value)}
                    placeholder="e.g. I want my team to stop doing manual data entry. I want leads from Shopify to flow into HubSpot automatically..."
                    rows={4}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 resize-none transition-colors"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Annual Revenue Range" id="revenue_range" required>
                    <Select
                      id="revenue_range"
                      value={form.revenue_range}
                      onChange={(v) => setField('revenue_range', v)}
                      options={REVENUE_RANGES as unknown as string[]}
                      placeholder="Select range"
                    />
                  </Field>
                  <Field label="Monthly Automation Budget" id="budget_range" required>
                    <Select
                      id="budget_range"
                      value={form.budget_range}
                      onChange={(v) => setField('budget_range', v)}
                      options={BUDGET_RANGES as unknown as string[]}
                      placeholder="Select budget"
                    />
                  </Field>
                </div>

                <Field label="Timeline" id="timeline" required>
                  <Select
                    id="timeline"
                    value={form.timeline}
                    onChange={(v) => setField('timeline', v)}
                    options={TIMELINES as unknown as string[]}
                    placeholder="When do you want to get started?"
                  />
                </Field>

                <Field label="Anything else you&#39;d like us to know?" id="additional_notes">
                  <textarea
                    id="additional_notes"
                    value={form.additional_notes}
                    onChange={(e) => setField('additional_notes', e.target.value)}
                    placeholder="Any context, constraints, or questions..."
                    rows={3}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 resize-none transition-colors"
                  />
                </Field>
              </div>

              {error && (
                <div role="alert" className="text-xs text-red-400 border border-red-400/20 bg-red-400/5 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(2)}
                  className="text-white/40 hover:text-white border border-white/10 hover:border-white/30 tracking-widest text-xs uppercase rounded-full px-6 h-11 touch-manipulation"
                >
                  <ArrowLeft size={14} className="mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !form.desired_outcomes || !form.revenue_range || !form.budget_range || !form.timeline}
                  className="bg-[#00c8ff] text-[#0d0d0d] hover:bg-white disabled:opacity-30 font-medium tracking-widest text-xs uppercase rounded-full px-8 h-11 touch-manipulation"
                >
                  {submitting ? 'Sending...' : 'Submit Assessment'}
                  {!submitting && <Check size={14} className="ml-2" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Reusable form primitives ──────────────────────────────────────────────

function Field({ label, id, required, children }: { label: string; id?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs tracking-widest uppercase text-white/40">
        {label}
        {required && <span className="text-[#00c8ff] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 transition-colors h-11 touch-manipulation"
    />
  )
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 transition-colors h-11 appearance-none cursor-pointer touch-manipulation"
    >
      <option value="" disabled className="text-white/20">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-[#1a1a1a]">
          {opt}
        </option>
      ))}
    </select>
  )
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left text-xs transition-all duration-150 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 ${
        checked
          ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5 text-white'
          : 'border-white/8 bg-[#1a1a1a] text-white/40 hover:border-white/20 hover:text-white/60'
      }`}
    >
      <div
        className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
          checked ? 'bg-[#00c8ff] border-[#00c8ff]' : 'border-white/20'
        }`}
      >
        {checked && <Check size={10} className="text-[#0d0d0d]" />}
      </div>
      <span className="leading-tight">{label}</span>
    </button>
  )
}
