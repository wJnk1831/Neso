"use client"

import { useAppStore } from "@/core/store/useAppStore"
import { Play, Pause, Square, RotateCwFadingClock } from "lucide-react"
import { useState } from "react"
import { useStopwatch } from "react-timer-hook"

export default function Timer() {
  const { currentActivity, addSession } = useAppStore()
  const [startTime, setStartTime] = useState<number | null>(null)

  const { totalSeconds, totalMilliseconds, isRunning, start, pause, reset } = useStopwatch({ autoStart: false })

  function handleStart() {
    if (!startTime) {
      setStartTime(Date.now())
    }
    start()
  }

  function handleRestart() {
    reset(undefined, false)
  }

  function handleResumeAndPause() {
    if (isRunning) {
      pause()
    } else {
      start()
    }
  }

  function handleFinishSession() {
    if (!currentActivity || totalSeconds === 0) return

    addSession(totalSeconds)

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

  return (
    <section className="mt-10 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-extrabold tracking-widest">
        {currentActivity?.name}
      </h1>

      {/* Timer display */}
      <div className="flex justify-center">
        <span className="text-6xl font-extrabold tracking-wide">
          {formatDuration(totalSeconds)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex flex-col w-full justify-center items-center gap-3">
        {totalSeconds === 0 && !isRunning && (
          <button
            type="button"
            onClick={handleStart}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#14121F] px-6 py-3 font-bold text-white transition-colors hover:bg-[#232323]"
          >
            <Play size={18} />
            Start
          </button>
        )}

        { }

        {isRunning || totalMilliseconds > 0 ?
          <div className=" w-full flex justify-between">
            <button
              type="button"
              onClick={handleResumeAndPause}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#14121F] px-6 py-3 font-bold text-white transition-colors hover:bg-[#232323]"
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? 'Pause' : "Resume"}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#14121F] bg-white px-6 py-3 font-bold text-[#14121F] transition-colors hover:bg-[#F4F2F3]"
            >
              <RotateCwFadingClock size={18} />
              Restart
            </button>
          </div> : null
        }

        {totalSeconds > 0 && (
          <button type="button" onClick={handleFinishSession} className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition-colors hover:bg-red-700">
            <Square size={16} />
            Save Session
          </button>
        )}
      </div>
    </section>
  )
}