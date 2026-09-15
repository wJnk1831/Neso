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
      <div className="flex h-75 items-center justify-center rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] text-sm text-[#232323]/40">
        Sem dados no periodo selecionado
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)]">
      <h3 className="mb-4 text-base font-bold text-[#14121F]">
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
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(35,35,35,0.1)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            formatter={(value: any) => [formatDuration(Number(value) || 0), "Tempo"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-[#232323]/70">
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