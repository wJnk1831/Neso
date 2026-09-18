'use client'
import { LogType, SessionLog } from "@/core/types"
import { CheckCircle2, MessageSquarePlus, Pause, Play, Square } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useRef } from "react"

interface Props {
  logs: SessionLog[]
  setLogs?: Dispatch<SetStateAction<SessionLog[]>>
  logNoteInput: string
  setLogNoteInput: Dispatch<SetStateAction<string>>
  handleCreateNewLog(type: LogType, noteInput?: string): void
}

export default function LogsPanel({ logs, logNoteInput, setLogNoteInput, handleCreateNewLog, }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [logs])

  function formatDuration(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }

  function renderBadge(type: LogType) {
    switch (type) {
      case "SESSION_START":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
            <Play size={12} /> Start
          </span>
        )
      case "SESSION_END":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 border border-rose-500/20">
            <Square size={12} /> End
          </span>
        )
      case "PAUSE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
            <Pause size={12} /> Pause
          </span>
        )
      case "RESUME":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-600 border border-sky-500/20">
            <Play size={12} /> Resume
          </span>
        )
      case "NOTE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 border border-purple-500/20">
            <CheckCircle2 size={12} /> Note
          </span>
        )
    }
  }

  return (
    <section className="mt-8 flex w-full max-w-4xl flex-col rounded-2xl border border-border bg-card p-5 shadow select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Session Logs & Milestones
          </h3>
          <p className="text-xs text-text-muted">
            Registro cronológico das ações e anotações
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="mt-4 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Adicionar nota ou milestone na sessão..."
            value={logNoteInput}
            onChange={(e) => setLogNoteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && logNoteInput.trim()) {
                handleCreateNewLog("NOTE")
              }
            }}
            maxLength={60}
            className="w-full rounded-xl border border-border bg-input py-2.5 pr-3 pl-9 text-xs font-medium text-foreground outline-none transition-all placeholder:text-text-disabled focus:border-accent focus:bg-elevated focus:ring-4 focus:ring-accent-soft"
          />
          <MessageSquarePlus
            size={15}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-text-disabled"
          />
        </div>

        <button
          type="button"
          className="cursor-pointer rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-card transition-colors hover:bg-accent-hover active:scale-[0.98]"
          onClick={() => handleCreateNewLog("NOTE")}
        >
          Salvar
        </button>
      </div>

      {/* Container Tabela / Scroll */}
      <div
        ref={scrollContainerRef}
        className="mt-5 max-h-72 overflow-y-auto rounded-xl border border-border bg-card scroll-smooth"
      >
        <table className="w-full border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-elevated text-text-muted shadow-sm">
            <tr className="border-b border-border">
              <th className="py-2.5 pr-2 pl-3 font-semibold">Tipo</th>
              <th className="px-2 py-2.5 font-semibold">Momento</th>
              <th className="py-2.5 pr-3 pl-2 font-semibold">Detalhes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-foreground">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-xs text-text-disabled italic"
                >
                  Nenhum registro até o momento.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="transition-colors hover:bg-elevated"
                >
                  <td className="whitespace-nowrap py-2.5 pr-2 pl-3">
                    {renderBadge(log.type)}
                  </td>

                  <td className="whitespace-nowrap px-2 py-2.5 font-mono font-medium text-text-secondary">
                    <div className="flex items-center gap-2">
                      <span>{formatDuration(log.relativeTime)}</span>
                      <span className="text-[10px] text-text-disabled">
                        (
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                        )
                      </span>
                    </div>
                  </td>

                  <td className="py-2.5 pr-3 pl-2 font-medium text-text-secondary">
                    {log.note ? (
                      <span className="text-foreground">{log.note}</span>
                    ) : (
                      <span className="text-text-disabled italic">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}