import React from 'react'

export function Field({
  label,
  id,
  required,
  children,
}: {
  label: string
  id?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs tracking-widest uppercase text-gray-400 dark:text-white/40"
      >
        {label}
        {required && <span className="text-[#00c8ff] ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}
