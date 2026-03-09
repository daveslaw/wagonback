export function Select({
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
      className="w-full bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 transition-colors h-11 appearance-none cursor-pointer touch-manipulation"
    >
      <option value="" disabled className="text-gray-400 dark:text-white/20">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-white dark:bg-[#1a1a1a]">
          {opt}
        </option>
      ))}
    </select>
  )
}
