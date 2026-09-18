"use client"

import { Activity, TimeSession } from "@/core/types"
import { formatDuration } from "@/core/utils/utils"

interface ActivityCardProps {
  activity: Activity
  totalTime: number
  lastSession: TimeSession | null
  onEdit: (activity: Activity) => void
  onDelete: (id: string) => void
}

export default function ActivityCard({ activity, totalTime, lastSession, onEdit, onDelete }: ActivityCardProps) {
  return (
    <div className="group relative cursor-pointer hover:opacity-80  [&:has(.ignore-parent-hover:hover)]:opacity-100 break-inside-avoid mb-4 flex w-full  flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow select-none">
      <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: activity.color }} />

      <div className="flex flex-col gap-3 pr-2">
        <h1 className="text-base font-bold text-foreground truncate">
          {activity.name}
        </h1>

        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between text-text-muted">
            <span>Tempo total</span>
            <span className="font-mono font-bold text-foreground">
              {formatDuration(totalTime)}
            </span>
          </div>

          <div className="flex items-center justify-between text-text-muted">
            <span>Última sessão</span>
            <span className="font-medium text-foreground">
              {lastSession
                ? new Date(lastSession.startTime).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                : "—"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center ignore-parent-hover justify-end gap-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={() => onDelete(activity.id)}
          className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger-bg active:scale-[0.98]"
        >
          Excluir
        </button>

        <button
          type="button"
          onClick={() => onEdit(activity)}
          className="cursor-pointer rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-elevated active:scale-[0.98]"
        >
          Editar
        </button>
      </div>
    </div>
  )
}