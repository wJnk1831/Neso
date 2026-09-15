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
      <div className="flex h-75 items-center justify-center rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] text-sm text-[#232323]/40">
        Sem dados no periodo selecionado
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)]">
      <h3 className="mb-4 text-base font-bold text-[#14121F]">
        Tempo por dia
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={16}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: any) => formatShort(Number(v) || 0)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(35,35,35,0.1)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(value: any) => [formatDuration(Number(value) || 0), "Tempo"]}
          />
          <Bar dataKey="tempo" fill="#14121F" radius={[6, 6, 0, 0]} />
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