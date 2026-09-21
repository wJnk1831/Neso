"use client"

import { useAppStore } from "@/core/store/useAppStore"
import { Activity } from "@/core/types"
import { Bolt, ChevronDown, ChevronUp, Clock, Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import Timer from "./components/Timer"
import ActivityFormModal from "./components/ActivityFormModal"

export default function Home() {
  const { activities, setCurrentActivity, createActivity, updateActivity, currentActivity, deleteActivity, getTotalTime } = useAppStore()

  const [search, setSearch] = useState("")
  const [toggleDropDown, setToggleDropDown] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [initialName, setInitialName] = useState("")

  const dropDownRef = useRef<HTMLDivElement | null>(null)

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return activities

    return activities.filter((activity) =>
      activity.name.toLowerCase().includes(query)
    )
  }, [activities, search])

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (!(e.target instanceof Node)) return

      if (!dropDownRef.current?.contains(e.target)) {
        setToggleDropDown(false)
      }
    }

    window.addEventListener("mousedown", handleMouseDown)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  function handleOpenCreate(name?: string) {
    setEditingActivity(null)
    setInitialName(name || search)
    setToggleDropDown(false)
    setIsModalOpen(true)
  }

  function handleOpenEdit(e: React.MouseEvent, activity: Activity) {
    e.stopPropagation()

    setEditingActivity(activity)
    setInitialName("")
    setToggleDropDown(false)
    setIsModalOpen(true)
  }

  function handleSave(data: { name: string; color?: string }) {
    if (editingActivity) {
      updateActivity(editingActivity.id, {
        name: data.name,
        color: data.color,
      })
      setSearch("")
    } else {
      createActivity(data.name, data.color)
      setSearch(data.name)
    }

    setIsModalOpen(false)
    setEditingActivity(null)
    setInitialName("")
  }

  function handleDelete(id: string) {
    deleteActivity(id)
    setSearch('')
    setIsModalOpen(false)
    setEditingActivity(null)
    setInitialName("")
  }

  return (
    <main className=" w-full bg-background px-4 py-6 text-(--text-primary)">
      <nav className="flex w-full justify-center select-none text-text-secondary">
        <div
          ref={dropDownRef}
          className="relative flex w-full max-w-150 rounded-2xl border border-border bg-card shadow transition-all"
        >
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setToggleDropDown(true)
            }}
            onFocus={() => setToggleDropDown(true)}
            className="w-full rounded-2xl bg-transparent px-5 py-3.5 text-sm font-medium text-foreground outline-none placeholder:text-text-disabled"
            type="text"
            spellCheck={false}
            maxLength={40}
            placeholder="Select activity..."
          />

          <button
            type="button"
            onClick={() => setToggleDropDown((prev) => !prev)}
            className="mr-1 flex cursor-pointer items-center justify-center rounded-xl px-3 text-text-disabled transition-colors hover:bg-elevated hover:text-foreground"
          >
            {toggleDropDown ? (<ChevronUp size={19} strokeWidth={2} />) : (<ChevronDown size={19} strokeWidth={2} />)}
          </button>

          {/* Dropdown Menu */}
          {toggleDropDown && (
            <div className="absolute left-0 top-full z-10 mt-2 flex max-h-60 w-full flex-col overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-hover">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => {
                    setCurrentActivity(activity)
                    setSearch(activity.name)
                    setToggleDropDown(false)
                  }}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-elevated"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: activity.color || "var(--accent-soft)",
                      }}
                    />

                    <span className="truncate text-sm font-medium text-foreground">
                      {activity.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleOpenEdit(e, activity)}
                    className="ml-2 cursor-pointer rounded-lg p-1.5 text-text-disabled opacity-0 transition-all hover:bg-accent-soft hover:text-foreground group-hover:opacity-100"
                  >
                    <Bolt width={17} height={17} />
                  </button>
                </div>
              ))}

              {search.trim().length > 0 && filteredActivities.length === 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenCreate(search)}
                  className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl border-t border-border px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent-soft"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-card">
                    <Plus size={15} />
                  </span>

                  <span>
                    Create{" "}
                    <span className="font-semibold text-text-secondary">
                      {search}
                    </span>
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <ActivityFormModal
        open={isModalOpen}
        activity={editingActivity}
        initialName={initialName}
        onClose={() => {
          setIsModalOpen(false)
          setEditingActivity(null)
          setInitialName("")
        }}
        onSave={handleSave}
        onDelete={handleDelete}
        totalTime={editingActivity ? getTotalTime(editingActivity.id) : 0}
      />

      <div className="flex flex-col items-center justify-center">
        {!currentActivity?.id ? (
          <div className="mt-12 w-full max-w-2xl">
            <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-10 text-center shadow">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-elevated">
                <Clock size={40} className="text-text-muted" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold tracking-tight text-text-secondary">
                  Pronto para rastrear?
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-text-muted">
                  Selecione uma atividade existente no campo acima ou crie uma nova para
                  iniciar a contagem do tempo.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {activities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const first = activities[0]
                      setCurrentActivity(first)
                      setSearch(first.name)
                      setToggleDropDown(true)
                    }}
                    className="cursor-pointer rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-card transition-colors hover:bg-accent-hover"
                  >
                    Selecionar primeira atividade
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleOpenCreate()}
                  className="cursor-pointer rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-elevated"
                >
                  Nova atividade
                </button>
              </div>

              {activities.length > 0 && (
                <p className="text-xs text-text-disabled">
                  {activities.length} {activities.length === 1 ? "atividade registrada" : "atividades registradas"}
                </p>
              )}
            </div>
          </div>
        ) : (
          <Timer />
        )}
      </div>

    </main>
  )
}