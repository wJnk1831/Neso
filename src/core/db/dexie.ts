import Dexie, { Table } from "dexie"
import { Activity, TimeSession } from "@/core/types"

class NesoTrackerDB extends Dexie {
  activities!: Table<Activity, string>
  sessions!: Table<TimeSession, string>

  constructor() {
    super("NesoTrackerDB")
    this.version(1).stores({
      activities: "id, name, createdAt",
      sessions: "id, activityId, startTime, endTime"
    })
  }
}

export const db = new NesoTrackerDB()