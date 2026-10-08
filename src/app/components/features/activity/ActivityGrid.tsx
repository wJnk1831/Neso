"use client"

import { Masonry } from "react-plock"
import { useAppStore } from "@/core/store/useAppStore"
import { Activity } from "@/core/types"
import ActivityCard from "./ActivityCard"

interface ActivityGridProps {
  onEdit: (e: React.MouseEvent, activity: Activity) => void
  onDelete: (id: string) => void
}

export default function ActivityGrid({
  onEdit,
  onDelete,
}: ActivityGridProps) {
  const {
    activities,
    setCurrentActivity,
    getTotalTime,
    getLastSession,
  } = useAppStore()

  return (
    <div className="w-full max-w-7xl">
      <Masonry
        items={activities}
        config={{
          columns: [1, 2, 3, 4],
          gap: [16, 16, 16, 16],
          media: [640, 1024, 1280, 1536],
        }}
        render={(activity: Activity) => (
          <ActivityCard
            activity={activity}
            totalTime={getTotalTime(activity.id)}
            lastSession={getLastSession(activity.id)}
            onSelect={() => setCurrentActivity(activity)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      />
    </div>
  )
}
