export interface TimeSession {
  id: string
  activityId: string
  startTime: number
  endTime: number 
  duration: number
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