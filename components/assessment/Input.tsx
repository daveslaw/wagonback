export function Input({
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
      className="w-full bg-[#f5f5f5] dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-white/80 placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c8ff]/60 focus:border-[#00c8ff]/40 transition-colors h-11 touch-manipulation"
    />
  )
}
