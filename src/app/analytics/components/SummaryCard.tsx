interface SummaryCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}

export default function SummaryCard({ label, value, icon, color }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)]">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-[#232323]/55">
          {label}
        </span>
        <p className="mt-1 text-lg font-extrabold text-[#14121F]">
          {value}
        </p>
      </div>
    </div>
  )
}