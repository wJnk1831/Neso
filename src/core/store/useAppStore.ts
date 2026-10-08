import { create } from "zustand"
import { Activity, SessionLog, TimeSession, ActiveRun, LogType } from "@/core/types"
import { loadUserData, loadRunningSession, saveRunningSession, createActivity as dbCreateActivity, updateActivity as dbUpdateActivity, deleteActivity as dbDeleteActivity, createSession as dbCreateSession } from "@/core/db/dexieServices"
import { nanoid } from "nanoid"

interface AppStore {
  activities: Activity[]
  sessions: TimeSession[]
  currentActivity: Activity | null
  activeRun: ActiveRun | null
  isLoading: boolean
  tempActivity: Partial<Activity> | null,

  initStore: () => Promise<void>
  setCurrentActivity: (activity: Activity | null) => void

  createActivity: (name: string, color?: string) => void
  updateActivity: (id: string, changes: Partial<Omit<Activity, "id">>) => void
  deleteActivity: (id: string) => void
  addSession: (durationInSeconds: number, logs: SessionLog[]) => void
  setTempActivity: (value: Partial<Activity>) => void

  startRun: (activityId: string) => void
  pauseRun: () => void
  resumeRun: () => void
  resetRun: () => void
  addRunLog: (type: LogType, note?: string) => void
  finishRun: () => void

  // Derived selectors
  getTotalTime: (activityId: string) => number
  getSessionsByActivity: (activityId: string) => TimeSession[]
  getTotalTimeAll: () => number
  getLastSession: (activityId: string) => TimeSession | null
}

function elapsedMsOf(run: ActiveRun): number {
  return run.accumulatedMs + (run.runningSince ? Date.now() - run.runningSince : 0)
}

function buildLog(type: LogType, run: ActiveRun, note?: string): SessionLog {
  return {
    id: nanoid(),
    timestamp: Date.now(),
    relativeTime: Math.floor(elapsedMsOf(run) / 1000),
    type,
    ...(type === "NOTE" && note?.trim() ? { note: note.trim() } : {}),
  }
}

function persistRun(run: ActiveRun | null) {
  saveRunningSession(run)
}

export const useAppStore = create<AppStore>((set, get) => ({
  activities: [],
  sessions: [],
  currentActivity: null,
  activeRun: null,
  isLoading: true,
  tempActivity: null,

  initStore: async () => {
    if (!get().isLoading) return

    const [data, savedRun] = await Promise.all([
      loadUserData(),
      loadRunningSession(),
    ])

    const activeRun =
      savedRun && data.activities.some((a) => a.id === savedRun.activityId)
        ? savedRun
        : null

    set({
      activities: data.activities,
      sessions: data.sessions,
      activeRun,
      isLoading: false,
    })

    if (savedRun && !activeRun) persistRun(null)
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
    const wasRunning = get().activeRun?.activityId === id

    set((state) => ({
      activities: state.activities.filter((a) => a.id !== id),
      sessions: state.sessions.filter((s) => s.activityId !== id),
      currentActivity: state.currentActivity?.id === id ? null : state.currentActivity,
      activeRun: state.activeRun?.activityId === id ? null : state.activeRun
    }))

    if (wasRunning) persistRun(null)
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

  startRun: (activityId) => {
    const now = Date.now()
    const run: ActiveRun = {
      id: "active-run",
      activityId,
      startedAt: now,
      accumulatedMs: 0,
      runningSince: now,
      logs: [
        {
          id: nanoid(),
          timestamp: now,
          relativeTime: 0,
          type: "SESSION_START",
        },
      ],
    }

    set({ activeRun: run })
    persistRun(run)
  },

  pauseRun: () => {
    const run = get().activeRun
    if (!run || run.runningSince === null) return

    const now = Date.now()
    const updated: ActiveRun = {
      ...run,
      accumulatedMs: run.accumulatedMs + (now - run.runningSince),
      runningSince: null,
      logs: [...run.logs, buildLog("PAUSE", run)],
    }

    set({ activeRun: updated })
    persistRun(updated)
  },

  resumeRun: () => {
    const run = get().activeRun
    if (!run || run.runningSince !== null) return

    const now = Date.now()
    const updated: ActiveRun = {
      ...run,
      runningSince: now,
      logs: [...run.logs, buildLog("RESUME", run)],
    }

    set({ activeRun: updated })
    persistRun(updated)
  },

  resetRun: () => {
    set({ activeRun: null })
    persistRun(null)
  },

  addRunLog: (type, note) => {
    const run = get().activeRun
    if (!run) return
    if (type === "NOTE" && !note?.trim()) return

    const updated: ActiveRun = {
      ...run,
      logs: [...run.logs, buildLog(type, run, note)],
    }

    set({ activeRun: updated })
    persistRun(updated)
  },

  finishRun: () => {
    const run = get().activeRun
    if (!run) return

    const durationInSeconds = Math.floor(elapsedMsOf(run) / 1000)

    if (durationInSeconds <= 0) {
      set({ activeRun: null })
      persistRun(null)
      return
    }

    const endTime = Date.now()
    const newSession: TimeSession = {
      id: nanoid(),
      activityId: run.activityId,
      startTime: run.startedAt,
      endTime,
      duration: durationInSeconds,
      logs: [...run.logs, buildLog("SESSION_END", run)],
    }

    set((state) => ({
      sessions: [...state.sessions, newSession],
      activeRun: null,
    }))

    dbCreateSession(newSession)
    persistRun(null)
  },

  // Derived selectors
  getTotalTime: (activityId) => {
    return get().sessions
      .filter((s) => s.activityId === activityId)
      .reduce((acc, s) => acc + s.duration, 0)
  },

  getSessionsByActivity: (activityId) => {
    return get().sessions
      .filter((s) => s.activityId === activityId)
      .sort((a, b) => a.startTime - b.startTime)
  },

  getTotalTimeAll: () => {
    return get().sessions.reduce((acc, s) => acc + s.duration, 0)
  },

  getLastSession: (activityId) => {
    const sessions = get().sessions
      .filter((s) => s.activityId === activityId)
      .sort((a, b) => b.startTime - a.startTime)
    return sessions.length > 0 ? sessions[0] : null
  },
}))

if (typeof window !== "undefined") { useAppStore.getState().initStore() }