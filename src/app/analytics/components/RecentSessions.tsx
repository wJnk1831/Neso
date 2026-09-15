import { Activity, TimeSession } from "@/core/types"
import { formatDuration } from "@/core/utils/utils"

interface RecentSessionsProps {
  sessions: TimeSession[]
  activities: Activity[]
}

export default function RecentSessions({ sessions, activities }: RecentSessionsProps) {
  const sorted = [...sessions].sort((a, b) => b.startTime - a.startTime).slice(0, 10)

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)]">
        <h3 className="mb-4 text-base font-bold text-[#14121F]">
          Sessoes recentes
        </h3>
        <p className="py-8 text-center text-sm text-[#232323]/40">
          Nenhuma sessao no periodo selecionado
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)]">
      <h3 className="mb-4 text-base font-bold text-[#14121F]">
        Sessoes recentes
      </h3>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-auto rounded-xl border border-[#232323]/10 bg-[#FFFFFF] scroll-smooth">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-[#F4F2F3] text-[#232323]/60 shadow-sm">
            <tr className="border-b border-[#232323]/10">
              <th className="py-2 pr-2 pl-3 font-semibold">Atividade</th>
              <th className="px-2 py-2 font-semibold">Data</th>
              <th className="py-2 pr-3 pl-2 font-semibold">Duracao</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#232323]/6 text-[#14121F]">
            {sorted.map((session) => {
              const activity = activities.find((a) => a.id === session.activityId)
              return (
                <tr key={session.id} className="hover:bg-[#F4F2F3]/40">
                  <td className="whitespace-nowrap py-2.5 pr-2 pl-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: activity?.color || "#E9EAFF" }}
                      />
                      <span className="font-medium">{activity?.name || "—"}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 font-medium text-[#232323]/70">
                    {new Date(session.startTime).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-3 pl-2 font-mono font-medium text-[#232323]/70">
                    {formatDuration(session.duration)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}