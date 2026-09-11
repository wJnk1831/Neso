"use client"

import {
  Flag,
  Pause,
  Play,
  Plus,
  Square,
  Tag,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"

export type LogEventType =
  | "SESSION_START"
  | "SESSION_END"
  | "PAUSE"
  | "RESUME"
  | "SET_FLAG"
  | "MILESTONE"

export interface SessionLog {
  id: string
  timestamp: number // Horário de relógio (Date.now())
  relativeTime: number // Segundos decorridos na sessão
  type: LogEventType
  label: string
  flagName?: string
}

// Mock de logs iniciais baseados no seu cenário de 3h
const INITIAL_LOGS: SessionLog[] = [
  {
    id: "1",
    timestamp: Date.now() - 10800000,
    relativeTime: 0, // 00:00
    type: "SESSION_START",
    label: "Session Started",
  },
  {
    id: "2",
    timestamp: Date.now() - 9000000,
    relativeTime: 1800, // 00:30
    type: "SET_FLAG",
    label: "Switched flag",
    flagName: "python",
  },
  {
    id: "3",
    timestamp: Date.now() - 7800000,
    relativeTime: 3000, // 00:50
    type: "PAUSE",
    label: "Session paused",
  },
  {
    id: "4",
    timestamp: Date.now() - 6000000,
    relativeTime: 4800, // 01:20
    type: "RESUME",
    label: "Session resumed",
  },
  {
    id: "5",
    timestamp: Date.now() - 4200000,
    relativeTime: 6600, // 01:50
    type: "SET_FLAG",
    label: "Switched flag",
    flagName: "typescript",
  },
  {
    id: "6",
    timestamp: Date.now() - 1800000,
    relativeTime: 9000, // 02:30
    type: "PAUSE",
    label: "Session paused",
  },
  {
    id: "7",
    timestamp: Date.now() - 1200000,
    relativeTime: 9600, // 02:40
    type: "RESUME",
    label: "Session resumed",
  },
]

export default function xxx({
  currentSessionSeconds = 10800, // Exemplo: 3 horas (10800 seg)
  isRunning = true,
}: {
  currentSessionSeconds?: number
  isRunning?: boolean
}) {
  const [logs, setLogs] = useState<SessionLog[]>(INITIAL_LOGS)
  const [activeFlag, setActiveFlag] = useState<string>("typescript")
  const [customFlagInput, setCustomFlagInput] = useState("")
  const [milestoneInput, setMilestoneInput] = useState("")
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)

  // Formata o tempo decorrido do relógio (HH:MM:SS)
  function formatRelativeTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  // Ação: Trocar ou Ativar uma Flag
  function handleSetFlag(flag: string) {
    if (!flag.trim()) return

    const newLog: SessionLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      relativeTime: currentSessionSeconds,
      type: "SET_FLAG",
      label: `Flag set to ${flag}`,
      flagName: flag.toLowerCase(),
    }

    setLogs((prev) => [newLog, ...prev]) // Insere no topo
    setActiveFlag(flag.toLowerCase())
    setCustomFlagInput("")
  }

  // Ação: Adicionar um Milestone
  function handleAddMilestone(e: React.FormEvent) {
    e.preventDefault()
    if (!milestoneInput.trim()) return

    const newLog: SessionLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      relativeTime: currentSessionSeconds,
      type: "MILESTONE",
      label: milestoneInput.trim(),
    }

    setLogs((prev) => [newLog, ...prev])
    setMilestoneInput("")
    setIsAddingMilestone(false)
  }

  // Estilização condicional de ícone e tag conforme o tipo de evento
  function renderEventBadge(log: SessionLog) {
    switch (log.type) {
      case "SESSION_START":
        return (
          <span className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <Play size={12} /> Start
          </span>
        )
      case "SESSION_END":
        return (
          <span className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-700">
            <Square size={12} /> End
          </span>
        )
      case "PAUSE":
        return (
          <span className="flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700">
            <Pause size={12} /> Pause
          </span>
        )
      case "RESUME":
        return (
          <span className="flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-700">
            <Play size={12} /> Resume
          </span>
        )
      case "SET_FLAG":
        return (
          <span className="flex items-center gap-1.5 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-700">
            <Tag size={12} /> #{log.flagName}
          </span>
        )
      case "MILESTONE":
        return (
          <span className="flex items-center gap-1.5 rounded-md bg-zinc-900 px-2 py-0.5 text-xs font-semibold text-white">
            <CheckCircle2 size={12} /> Milestone
          </span>
        )
    }
  }

  return (
    <section className="mt-8 flex w-full max-w-xl flex-col rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-5 shadow-[0_4px_20px_rgba(20,18,31,0.05)] select-none">
      {/* 1. Header do Painel */}
      <div className="flex items-center justify-between border-b border-[#232323]/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-[#14121F]">
            Activity Timeline & Logs
          </h3>
          <p className="text-xs text-[#232323]/55">
            Real-time session events and markers
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingMilestone((prev) => !prev)}
          className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#232323]/10 bg-[#F4F2F3] px-3 py-1.5 text-xs font-semibold text-[#14121F] transition-colors hover:bg-[#E9EAFF]"
        >
          <Plus size={14} /> Milestone
        </button>
      </div>

      {/* 2. Barra de Interação Rápida (Tags / Flags) */}
      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-[#232323]/6 bg-[#F4F2F3] p-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-[#232323]/55">
          Active Flag
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {["python", "typescript", "react", "logic"].map((flag) => {
            const isActive = activeFlag === flag
            return (
              <button
                key={flag}
                type="button"
                onClick={() => handleSetFlag(flag)}
                className={`flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${isActive
                  ? "bg-[#14121F] text-white shadow-sm"
                  : "border border-[#232323]/10 bg-white text-[#232323] hover:bg-[#E9EAFF]"
                  }`}
              >
                <Tag size={12} />#{flag}
              </button>
            )
          })}

          {/* Input para flag customizada */}
          <div className="flex items-center gap-1">
            <input
              type="text"
              placeholder="+ New Flag"
              value={customFlagInput}
              onChange={(e) => setCustomFlagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSetFlag(customFlagInput)
                }
              }}
              className="w-24 rounded-lg border border-[#232323]/10 bg-white px-2 py-1 text-xs outline-none focus:border-[#14121F]"
            />
          </div>
        </div>
      </div>

      {/* 3. Form Rápido de Milestone (Se ativado) */}
      {isAddingMilestone && (
        <form
          onSubmit={handleAddMilestone}
          className="mt-3 flex items-center gap-2"
        >
          <input
            type="text"
            autoFocus
            placeholder="E.g., Finished exercises chapter 3"
            value={milestoneInput}
            onChange={(e) => setMilestoneInput(e.target.value)}
            className="w-full rounded-xl border border-[#232323]/10 bg-white px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-[#E9EAFF]"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-[#14121F] px-4 py-2 text-xs font-semibold text-white"
          >
            Add
          </button>
        </form>
      )}

      {/* 4. Lista do Timeline (Feed de Logs) */}
      <div className="mt-5 flex max-h-64 flex-col gap-0 overflow-y-auto pr-1">
        {logs.map((log, index) => {
          const isFirst = index === 0

          return (
            <div key={log.id} className="relative flex items-start gap-3 pb-4">
              {/* Linha vertical do Timeline */}
              {index < logs.length - 1 && (
                <div className="absolute top-2 left-2.5 h-full w-[1.5px] bg-[#232323]/10" />
              )}

              {/* Ponto/Nó da Timeline */}
              <div
                className={`relative z-10 mt-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${isFirst ? "bg-[#14121F]" : "bg-[#232323]/30"
                  }`}
              />

              {/* Conteúdo do Log */}
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#14121F]">
                      {formatRelativeTime(log.relativeTime)}
                    </span>
                    {renderEventBadge(log)}
                  </div>

                  <span className="text-[10px] text-[#232323]/40">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="text-xs text-[#232323]/80">{log.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}