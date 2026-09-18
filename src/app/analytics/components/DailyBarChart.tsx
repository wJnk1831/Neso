import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface DailyDataItem {
  name: string
  tempo: number
}

interface DailyBarChartProps {
  data: DailyDataItem[]
}

export default function DailyBarChart({ data }: DailyBarChartProps) {
  if (data.length === 0 || data.every((d) => d.tempo === 0)) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-2xl border border-border bg-card text-sm text-text-muted">
        Sem dados no periodo selecionado
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow">
      <h3 className="mb-4 text-base font-bold text-foreground">
        Tempo por dia
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={16}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: any) => formatShort(Number(value) || 0)} // eslint-disable-line @typescript-eslint/no-explicit-any
          />
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
          <Bar dataKey="tempo" fill="var(--accent)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function formatDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function formatShort(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h}h`
  if (m > 0) return `${m}m`
  return `${totalSeconds}s`
}