import { create } from "zustand"
import { Activity, SessionLog, TimeSession } from "@/core/types"
import { loadUserData, createActivity as dbCreateActivity, updateActivity as dbUpdateActivity, deleteActivity as dbDeleteActivity, createSession as dbCreateSession } from "@/core/db/dexieServices"
import { nanoid } from "nanoid"

interface AppStore {
  activities: Activity[]
  sessions: TimeSession[]
  currentActivity: Activity | null
  isLoading: boolean
  tempActivity: Partial<Activity> | null,

  initStore: () => Promise<void>
  setCurrentActivity: (activity: Activity | null) => void

  createActivity: (name: string, color?: string) => void
  updateActivity: (id: string, changes: Partial<Omit<Activity, "id">>) => void
  deleteActivity: (id: string) => void
  addSession: (durationInSeconds: number, logs: SessionLog[]) => void
  setTempActivity: (value: Partial<Activity>) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  activities: [],
  sessions: [],
  currentActivity: null,
  isLoading: true,
  tempActivity: null,

  initStore: async () => {
    if (!get().isLoading) return

    const data = await loadUserData()
    set({
      activities: data.activities,
      sessions: data.sessions,
      isLoading: false
    })
  },

  setCurrentActivity: (activity) => {
    set({ currentActivity: activity })
  },

  createActivity: (name, color) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: Date.now()
    }

    set((state) => ({ activities: [...state.activities, newActivity] }))
    dbCreateActivity(newActivity)
  },

  updateActivity: (id, changes) => {
    set((state) => ({
      activities: state.activities.map((a) => (a.id === id ? { ...a, ...changes } : a)),
      currentActivity:
        state.currentActivity?.id === id
          ? { ...state.currentActivity, ...changes }
          : state.currentActivity
    }))

    dbUpdateActivity(id, changes)
  },

  deleteActivity: (id) => {
    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
      sessions: state.sessions.filter((s) => s.activityId !== id),
      currentActivity: state.currentActivity?.id === id ? null : state.currentActivity
    }))

    dbDeleteActivity(id)
  },

  addSession: (durationInSeconds, logs) => {
    const { currentActivity } = get()
    if (!currentActivity || durationInSeconds <= 0) return

    const endTime = Date.now()
    const newSession: TimeSession = {
      id: nanoid(),
      activityId: currentActivity.id,
      startTime: endTime - durationInSeconds * 1000,
      endTime,
      duration: durationInSeconds,
      logs
    }

    set((state) => ({ sessions: [...state.sessions, newSession] }))
    dbCreateSession(newSession)
  },

  setTempActivity: (value) => set({ tempActivity: value }),
}))

if (typeof window !== "undefined") { useAppStore.getState().initStore() }