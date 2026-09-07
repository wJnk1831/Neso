import { db } from "./dexie"
import { Activity, TimeSession } from "@/core/types"

export async function loadUserData() {
  const [activities, sessions] = await Promise.all([
    db.activities.toArray(),
    db.sessions.toArray()
  ])
  return { activities, sessions }
}

export async function createActivity(activity: Activity) {
  await db.activities.add(activity)
}

export async function updateActivity(id: string, changes: Partial<Omit<Activity, "id">>) {
  await db.activities.update(id, changes)
}

export async function deleteActivity(id: string) {
  await db.transaction("rw", [db.activities, db.sessions], async () => {
    await db.activities.delete(id)
    await db.sessions.where("activityId").equals(id).delete()
  })
}

export async function createSession(session: TimeSession) {
  await db.sessions.add(session)
}

export async function deleteSession(id: string) {
  await db.sessions.delete(id)
}