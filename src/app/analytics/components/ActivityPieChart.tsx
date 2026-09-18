import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface PieDataItem {
  name: string
  value: number
  color?: string
}

interface ActivityPieChartProps {
  data: PieDataItem[]
}

export default function ActivityPieChart({ data }: ActivityPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-2xl border border-border bg-card text-sm text-text-muted">
        Sem dados no periodo selecionado
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow">
      <h3 className="mb-4 text-base font-bold text-foreground">
        Tempo por atividade
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color || "#3b82f6"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
            formatter={(value: any) => [formatDuration(Number(value) || 0), "Tempo"]} // eslint-disable-line @typescript-eslint/no-explicit-any
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-text-muted">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color || "#3b82f6" }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}