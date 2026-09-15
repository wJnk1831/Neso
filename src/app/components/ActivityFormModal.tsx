"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Activity } from "@/core/types"
import { formatDuration } from "@/core/utils/utils"

interface ActivityFormModalProps {
  open: boolean
  activity: Activity | null
  initialName?: string
  onClose: () => void
  onSave: (data: { name: string; color?: string }) => void
  onDelete: (id: string) => void
  totalTime: number
}

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
  "#14121F", "#6b7280",
]

export default function ActivityFormModal({
  open,
  activity,
  initialName,
  onClose,
  onSave,
  onDelete,
  totalTime,
}: ActivityFormModalProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (open) {
      if (activity) {
        setName(activity.name)
        setColor(activity.color)
      } else {
        setName(initialName || "")
        setColor(PRESET_COLORS[0])
      }
    }
  }, [open, activity, initialName])

  if (!open) return null

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({ name: name.trim(), color })
  }

  function handleDelete() {
    if (activity?.id) onDelete(activity.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14121F]/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-6 shadow-[0_20px_60px_rgba(20,18,31,0.18)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#14121F]">
            {activity ? "Edit Activity" : "New Activity"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-[#232323]/35 transition-colors hover:bg-[#F4F2F3] hover:text-[#14121F]"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#232323]/55">
              Activity Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#232323]/10 bg-[#F4F2F3] px-4 py-3 text-sm font-medium text-[#14121F] outline-none transition-all placeholder:text-[#232323]/35 focus:border-[#14121F]/20 focus:bg-[#FFFFFF] focus:ring-4 focus:ring-[#E9EAFF]"
              placeholder="e.g. Study Next.js"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#232323]/55">
              Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? "border-[#14121F] scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {activity && (
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#232323]/55">
                Total time
              </span>
              <div className="w-full rounded-xl border border-[#232323]/10 bg-[#F4F2F3] px-4 py-3 text-sm font-medium text-[#14121F]">
                {formatDuration(totalTime)}
              </div>
            </div>
          )}

          <div className="mt-1 flex justify-between gap-2 border-t border-[#232323]/6 pt-5">
            {activity ? (
              <button
                type="button"
                onClick={handleDelete}
                className="cursor-pointer rounded-xl border border-[#ca0606]/10 px-4 py-2.5 text-sm font-semibold text-[#ca0606] transition-colors hover:bg-[#ca0606]/10"
              >
                Delete
              </button>
            ) : <div />}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl border border-[#232323]/10 bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#232323] transition-colors hover:bg-[#F4F2F3]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-[#14121F] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-[#232323]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}