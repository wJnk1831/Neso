import Dexie, { Table } from "dexie"
import { Activity, TimeSession, ActiveRun } from "@/core/types"

class NesoTrackerDB extends Dexie {
  activities!: Table<Activity, string>
  sessions!: Table<TimeSession, string>
  runningSession!: Table<ActiveRun, string>

  constructor() {
    super("NesoTrackerDB")
    this.version(3).stores({
      activities: "id, name, createdAt",
      sessions: "id, activityId, startTime, endTime",
      runningSession: "id",
    })
  }
}

export const db = new NesoTrackerDB()