"use client"

import { useAppStore } from "@/core/store/useAppStore"
import { Play, Pause, Square, RotateCwFadingClock } from "lucide-react"
import { useState } from "react"
import { useStopwatch } from "react-timer-hook"
import LogsPanel from "./LogsPanel"
import { LogType, SessionLog } from "@/core/types"
import { nanoid } from "nanoid"

export default function Timer() {
  const { currentActivity, addSession } = useAppStore()
  const [startTime, setStartTime] = useState<number | null>(null)

  const [logs, setLogs] = useState<SessionLog[]>([])
  const [logNoteInput, setLogNoteInput] = useState("")

  const { totalSeconds, totalMilliseconds, isRunning, start, pause, reset } = useStopwatch({ autoStart: false })

  function handleStart() {
    if (!startTime) {
      setStartTime(Date.now())
    }
    start()

    handleCreateNewLog("SESSION_START")
  }

  function handleRestart() {
    reset(undefined, false)
    setLogs([])
  }

  function handleResumeAndPause() {
    if (isRunning) {
      pause()
      handleCreateNewLog("PAUSE")
    } else {
      start()
      handleCreateNewLog("RESUME")
    }
  }

  function handleFinishSession() {
    if (!currentActivity || totalSeconds === 0) return
    handleCreateNewLog("SESSION_END")

    addSession(totalSeconds, logs)

    pause()
    reset(undefined, false)
    setStartTime(null)
  }

  function formatDuration(total: number) {
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  function handleCreateNewLog(type: LogType,) {
    if (type === "NOTE" && !logNoteInput.trim()) return

    const newLog: SessionLog = {
      id: nanoid(),
      timestamp: Date.now(),
      type,
      relativeTime: totalSeconds,
      ...(type === "NOTE" && logNoteInput ? { note: logNoteInput } : {})
    }

    setLogs((prev) => [...prev, newLog])

    if (type === "NOTE") {
      setLogNoteInput('')
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
          {currentActivity?.name || "Nenhuma atividade selecionada"}
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

        {(isRunning || totalMilliseconds > 0) && (
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
        logs={logs}
        setLogs={setLogs}
        logNoteInput={logNoteInput}
        setLogNoteInput={setLogNoteInput}
        handleCreateNewLog={handleCreateNewLog}
      />
    </section>
  )
}