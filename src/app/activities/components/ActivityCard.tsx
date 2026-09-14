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
    <div className="group relative cursor-pointer hover:opacity-80  [&:has(.ignore-parent-hover:hover)]:opacity-100 break-inside-avoid mb-4 flex w-full  flex-col justify-between overflow-hidden rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)] select-none">
      <div className="absolute top-0 left-0 bottom-0 w-1.5" style={{ backgroundColor: activity.color }} />

      <div className="flex flex-col gap-3 pr-2">
        <h1 className="text-base font-bold text-[#14121F] truncate">
          {activity.name}
        </h1>

        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between text-[#232323]/60">
            <span>Tempo total</span>
            <span className="font-mono font-bold text-[#14121F]">
              {formatDuration(totalTime)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#232323]/60">
            <span>Última sessão</span>
            <span className="font-medium text-[#14121F]">
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

      <div className="mt-5 flex items-center ignore-parent-hover justify-end gap-2 border-t border-[#232323]/10 pt-3">
        <button
          type="button"
          onClick={() => onDelete(activity.id)}
          className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/10 active:scale-[0.98]"
        >
          Excluir
        </button>

        <button
          type="button"
          onClick={() => onEdit(activity)}
          className="cursor-pointer rounded-lg border border-[#232323]/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#14121F] transition-colors hover:bg-[#F4F2F3] active:scale-[0.98]"
        >
          Editar
        </button>
      </div>
    </div>
  )
}