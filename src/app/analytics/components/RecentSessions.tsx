import { Activity, TimeSession } from "@/core/types"
import { formatDuration } from "@/core/utils/utils"

interface RecentSessionsProps {
  sessions: TimeSession[]
  activities: Activity[]
}

export default function RecentSessions({ sessions, activities }: RecentSessionsProps) {
  const sorted = [...sessions]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 10)

  if (sorted.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 shadow">
        <h3 className="mb-4 text-base font-bold text-foreground">
          Sessoes recentes
        </h3>
        <p className="py-8 text-center text-sm text-text-muted">
          Nenhuma sessao no periodo selecionado
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow">
      <h3 className="mb-4 text-base font-bold text-foreground">
        Sessoes recentes
      </h3>
      <div className="max-h-80 overflow-y-auto overflow-x-auto rounded-xl border border-border bg-card scroll-smooth">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-elevated text-text-muted shadow-sm">
            <tr className="border-b border-border">
              <th className="py-2 pr-2 pl-3 font-semibold">Atividade</th>
              <th className="px-2 py-2 font-semibold">Data</th>
              <th className="py-2 pr-3 pl-2 font-semibold">Duracao</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {sorted.map((session) => {
              const activity = activities.find((a) => a.id === session.activityId)
              return (
                <tr key={session.id} className="hover:bg-elevated">
                  <td className="whitespace-nowrap py-2.5 pr-2 pl-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: activity?.color || "var(--accent-soft)" }}
                      />
                      <span className="font-medium text-foreground">{activity?.name || "—"}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 font-medium text-text-secondary">
                    {new Date(session.startTime).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-3 pl-2 font-mono font-medium text-text-secondary">
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