import { Check } from 'lucide-react'

export function CheckItem({
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
          ? 'border-[#00c8ff]/40 bg-[#00c8ff]/5 text-gray-900 dark:text-white'
          : 'border-gray-200 dark:border-white/8 bg-[#f5f5f5] dark:bg-[#1a1a1a] text-gray-400 dark:text-white/40 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-600 dark:hover:text-white/60'
      }`}
    >
      <div
        className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${
          checked ? 'bg-[#00c8ff] border-[#00c8ff]' : 'border-gray-300 dark:border-white/20'
        }`}
      >
        {checked && <Check size={10} className="text-[#0d0d0d]" />}
      </div>
      <span className="leading-tight">{label}</span>
    </button>
  )
}
