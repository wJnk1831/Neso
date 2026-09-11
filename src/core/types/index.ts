export type LogType = "SESSION_START" | "SESSION_END" | "PAUSE" | "RESUME" | "NOTE"

export interface SessionLog {
  id: string
  timestamp: number
  relativeTime: number
  type: LogType
  note?: string
}
export interface TimeSession {
  id: string
  activityId: string
  startTime: number
  endTime: number
  duration: number
  logs: SessionLog[]
}

export interface Activity {
  id: string
  name: string
  color?: string
  createdAt: number
}

export interface UserData {
  id: string
  activities: Activity[]
  sessions: TimeSession[]
}