"use client"

import { useState } from "react"
import { BarChart3, Clock, Hash, TrendingUp } from "lucide-react"
import { useAppStore } from "@/core/store/useAppStore"
import { TimeSession } from "@/core/types"
import { formatDuration } from "@/core/utils/utils"
import SummaryCard from "./components/SummaryCard"
import ActivityPieChart from "./components/ActivityPieChart"
import DailyBarChart from "./components/DailyBarChart"
import RecentSessions from "./components/RecentSessions"

type Period = "today" | "7d" | "30d" | "all"

export default function Analytics() {
  const { activities, sessions } = useAppStore()
  const [period, setPeriod] = useState<Period>("all")

  const filteredSessions = filterSessionsByPeriod(sessions, period)

  const totalDuration = filteredSessions.reduce((acc, s) => acc + s.duration, 0)
  const totalSessions = filteredSessions.length
  const avgPerSession = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0

  const activityStats = activities.map((a) => {
    const actSessions = filteredSessions.filter((s) => s.activityId === a.id)
    const dur = actSessions.reduce((acc, s) => acc + s.duration, 0)
    return { activity: a, duration: dur, sessions: actSessions.length }
  }).sort((a, b) => b.duration - a.duration)

  const topActivity = activityStats.length > 0 ? activityStats[0] : null
  const pieData = activityStats.filter((s) => s.duration > 0).map((s) => ({ name: s.activity.name, value: s.duration, color: s.activity.color }))

  const dailyData = buildDailyData(filteredSessions, period)

  const periods: { key: Period; label: string }[] = [
    { key: "today", label: "Hoje" },
    { key: "7d", label: "7 dias" },
    { key: "30d", label: "30 dias" },
    { key: "all", label: "Tudo" },
  ]

  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-[#F4F2F3] px-4 py-6 text-[#14121F]">
      <div className="mb-6 shrink-0 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#14121F]">
            Analytics
          </h1>

          <p className="text-sm text-[#232323]/55">
            Estatisticas do seu trackeamento de tempo
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${period === p.key
                  ? "bg-[#14121F] text-[#FFFFFF]"
                  : "border border-[#232323]/10 bg-[#FFFFFF] text-[#232323] hover:bg-[#F4F2F3]"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Tempo total"
          value={formatDuration(totalDuration)}
          icon={<Clock className="h-5 w-5" />}
          color="bg-blue-500/10 text-blue-600"
        />

        <SummaryCard
          label="Sessoes"
          value={String(totalSessions)}
          icon={<Hash className="h-5 w-5" />}
          color="bg-emerald-500/10 text-emerald-600"
        />

        <SummaryCard
          label="Media por sessao"
          value={formatDuration(avgPerSession)}
          icon={<TrendingUp className="h-5 w-5" />}
          color="bg-violet-500/10 text-violet-600"
        />

        <SummaryCard
          label="Atividade topo"
          value={topActivity ? topActivity.activity.name : "—"}
          icon={<BarChart3 className="h-5 w-5" />}
          color="bg-amber-500/10 text-amber-600"
        />
      </div>

      <div className="mt-6 shrink-0 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActivityPieChart data={pieData} />
        <DailyBarChart data={dailyData} />
      </div>

      <div className="mt-6 min-h-0 flex-1">
        <RecentSessions
          sessions={filteredSessions}
          activities={activities}
        />
      </div>
    </main>
  )
}

function filterSessionsByPeriod(sessions: TimeSession[], period: Period): TimeSession[] {
  if (period === "all") return sessions

  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  let cutoff: number

  switch (period) {
    case "today":
      cutoff = new Date(now).setHours(0, 0, 0, 0)
      break
    case "7d":
      cutoff = now - 7 * dayMs
      break
    case "30d":
      cutoff = now - 30 * dayMs
      break
    default:
      return sessions
  }

  return sessions.filter((s) => s.startTime >= cutoff)
}

function buildDailyData(sessions: TimeSession[], period: Period) {
  const map = new Map<string, number>()

  sessions.forEach((s) => {
    const date = new Date(s.startTime)
    const key = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`
    map.set(key, (map.get(key) || 0) + s.duration)
  })

  const labels: string[] = []
  const values: number[] = []

  if (period === "all") {
    const sortedKeys = Array.from(map.keys()).sort((a, b) => {
      const [da, ma] = a.split("/").map(Number)
      const [db, mb] = b.split("/").map(Number)
      return new Date(2026, ma - 1, da).getTime() - new Date(2026, mb - 1, db).getTime()
    })
    sortedKeys.forEach((k) => {
      labels.push(k)
      values.push(map.get(k) || 0)
    })
  } else {
    const days = period === "today" ? 1 : period === "7d" ? 7 : 30
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`
      labels.push(key)
      values.push(map.get(key) || 0)
    }
  }

  return labels.map((name, idx) => ({ name, tempo: values[idx] }))
}