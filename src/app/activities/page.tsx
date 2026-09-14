'use client'
import { Masonry } from "react-plock";
import ActivityCard from "./components/ActivityCard";
import { useAppStore } from "@/core/store/useAppStore";
import { useState } from "react";
import { Activity } from "@/core/types";
import { formatDuration } from "@/core/utils/utils";
import ActivityFormModal from "@/app/components/ActivityFormModal";

export default function Activities() {
  const { activities, updateActivity, deleteActivity, getTotalTime, getLastSession } = useAppStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)

  function handleOpenEdit(activity: Activity) {
    setEditingActivity(activity)
    setModalOpen(true)
  }

  function handleSave(data: { name: string; color?: string }) {
    if (!editingActivity) return
    updateActivity(editingActivity.id, data)
    setModalOpen(false)
    setEditingActivity(null)
  }

  function handleDelete(id: string) {
    deleteActivity(id)
    setModalOpen(false)
    setEditingActivity(null)
  }

  return (
    <main className="max-h-screen pt-12 gap-4 w-full bg-[#F4F2F3] px-4 py-6 text-[#14121F] overflow-y-auto overflow-x-hidden">
      <Masonry
        items={activities}
        config={{
          columns: [1, 2, 3, 4],
          gap: [16, 16, 16, 16],
          media: [640, 1024, 1280, 1536],
        }}
        render={(item: Activity) => (
          <ActivityCard
            activity={item}
            totalTime={getTotalTime(item.id)}
            lastSession={getLastSession(item.id)}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        )}
      />

      <ActivityFormModal
        open={modalOpen}
        activity={editingActivity}
        onClose={() => {
          setModalOpen(false)
          setEditingActivity(null)
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        totalTime={editingActivity ? getTotalTime(editingActivity.id) : 0}
      />
    </main>
  )
}