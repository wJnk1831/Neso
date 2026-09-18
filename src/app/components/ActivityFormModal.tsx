"use client"

import { useState } from "react"
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

interface FormState {
  name: string
  color: string | undefined
}

function buildInitialState(activity: Activity | null, initialName?: string): FormState {
  if (activity) {
    return { name: activity.name, color: activity.color }
  }
  return { name: initialName || "", color: PRESET_COLORS[0] }
}

export default function ActivityFormModal({
  open,
  activity,
  initialName,
  onClose,
  onSave,
  onDelete,
  totalTime,
}: ActivityFormModalProps) {
  const formKey = activity ? `edit-${activity.id}` : `create-${initialName || ""}`
  const [formState, setFormState] = useState<FormState>(() =>
    buildInitialState(activity, initialName)
  )

  if (!open) return null

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormState((prev) => ({ ...prev, name: e.target.value }))
  }

  function handleColorSelect(c: string) {
    setFormState((prev) => ({ ...prev, color: c }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!formState.name.trim()) return
    onSave({ name: formState.name.trim(), color: formState.color })
  }

  function handleDelete() {
    if (activity?.id) onDelete(activity.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {activity ? "Edit Activity" : "New Activity"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg p-1.5 text-text-disabled transition-colors hover:bg-elevated hover:text-foreground"
          >
            <X size={19} />
          </button>
        </div>

        <form
          key={formKey}
          onSubmit={handleSave}
          className="flex flex-col gap-5"
        >
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Activity Name
            </label>
            <input
              type="text"
              required
              value={formState.name}
              onChange={handleNameChange}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm font-medium text-foreground outline-none transition-all placeholder:text-text-disabled focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent-soft"
              placeholder="e.g. Study Next.js"
              autoFocus
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleColorSelect(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${formState.color === c ? "border-accent scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {activity && (
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                Total time
              </span>
              <div className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm font-medium text-foreground">
                {formatDuration(totalTime)}
              </div>
            </div>
          )}

          <div className="mt-1 flex justify-between gap-2 border-t border-border pt-5">
            {activity ? (
              <button
                type="button"
                onClick={handleDelete}
                className="cursor-pointer rounded-xl border border-danger/20 px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger-bg"
              >
                Delete
              </button>
            ) : <div />}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-elevated"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-card transition-colors hover:bg-accent-hover"
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