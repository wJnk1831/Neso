interface SummaryCardProps {
  label: string
  value: string
  icon: React.ReactNode
  color: string
}

export default function SummaryCard({ label, value, icon, color }: SummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </span>
        <p className="mt-1 text-lg font-extrabold text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}