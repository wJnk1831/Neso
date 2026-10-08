"use client"

import { useAppStore } from "@/core/store/useAppStore"
import { Play, Pause, Square, RotateCwFadingClock } from "lucide-react"
import { useEffect, useState } from "react"
import LogsPanel from "./LogsPanel"
import { LogType } from "@/core/types"

export default function Timer() {
  const {
    activities,
    currentActivity,
    activeRun,
    startRun,
    pauseRun,
    resumeRun,
    resetRun,
    finishRun,
    addRunLog,
  } = useAppStore()

  const [logNoteInput, setLogNoteInput] = useState("")
  const [now, setNow] = useState(() => Date.now())

  const isRunning = !!activeRun && activeRun.runningSince !== null
  const totalSeconds = activeRun
    ? Math.max(0,
      Math.floor(
        (activeRun.accumulatedMs +
          (activeRun.runningSince ? now - activeRun.runningSince : 0)) /
        1000
      )
    ) : 0

  const displayActivity = activeRun
    ? (activities.find((a) => a.id === activeRun.activityId) ?? null)
    : currentActivity

  useEffect(() => {
    if (!activeRun?.runningSince) return

    const interval = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(interval)
  }, [activeRun?.runningSince])

  function handleStart() {
    if (!currentActivity) return
    startRun(currentActivity.id)
  }

  function handleRestart() {
    resetRun()
  }

  function handleResumeAndPause() {
    if (!activeRun) return
    if (isRunning) {
      pauseRun()
    } else {
      resumeRun()
    }
  }

  function handleFinishSession() {
    if (!activeRun) return
    finishRun()
  }

  function formatDuration(total: number) {
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  function handleCreateNewLog(type: LogType) {
    if (!activeRun) return
    if (type === "NOTE" && !logNoteInput.trim()) return

    addRunLog(type, logNoteInput)

    if (type === "NOTE") {
      setLogNoteInput("")
    }
  }

  return (
    <section className="mt-8 flex w-full max-w-7xl flex-col items-center justify-center rounded-2xl md:p-8 select-none">
      {/* Header */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px]  font-bold tracking-widest text-text-muted uppercase">
          Atividade Atual
        </span>
        <h1 className="text-2xl md:text-4xl text-center font-extrabold tracking-wide text-foreground">
          {displayActivity?.name || "Nenhuma atividade selecionada"}
        </h1>
      </div>

      {/* Timer Display */}
      <div className="my-6 flex items-center justify-center rounded-2xl border border-border-strong bg-card px-10 py-6 shadow">
        <span className="font-mono text-6xl font-black tracking-tight text-foreground">
          {formatDuration(totalSeconds)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 ">
        {totalSeconds === 0 && !isRunning && (
          <button
            type="button"
            onClick={handleStart}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-3 text-xs font-semibold text-card transition-colors hover:bg-accent-hover"
          >
            <Play size={16} />
            Iniciar Sessão
          </button>
        )}

        {(isRunning || totalSeconds > 0) && (
          <div className="flex w-full items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResumeAndPause}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent py-3 text-xs font-semibold text-card transition-colors hover:bg-accent-hover"
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? "Pausar" : "Retomar"}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-xs font-semibold text-foreground transition-colors hover:bg-elevated"
            >
              <RotateCwFadingClock size={16} />
              Reiniciar
            </button>
          </div>
        )}

        {totalSeconds > 0 && (
          <button
            type="button"
            onClick={handleFinishSession}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-danger py-3 text-xs font-semibold text-card transition-colors hover:opacity-90"
          >
            <Square size={16} />
            Salvar Sessão
          </button>
        )}
      </div>

      {/* Logs Panel */}
      <LogsPanel
        logs={activeRun?.logs ?? []}
        logNoteInput={logNoteInput}
        setLogNoteInput={setLogNoteInput}
        handleCreateNewLog={handleCreateNewLog}
      />
    </section>
  )
}
