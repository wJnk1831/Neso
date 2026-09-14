"use client"

import { useAppStore } from "@/core/store/useAppStore"
import { Activity } from "@/core/types"
import { Bolt, ChevronDown, ChevronUp, Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import Timer from "./components/Timer"
import { formatDuration } from "@/core/utils/utils"
import ActivityFormModal from "./components/ActivityFormModal"

export default function Home() {
  const { activities, setCurrentActivity, createActivity, updateActivity, currentActivity, sessions, deleteActivity, getTotalTime } = useAppStore()

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
    <main className="min-h-screen w-full bg-[#F4F2F3] px-4 py-6 text-[#14121F]">
      <nav className="flex w-full justify-center select-none text-[#232323]">
        <div
          ref={dropDownRef}
          className="relative flex w-full max-w-150 rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] shadow-[0_4px_20px_rgba(20,18,31,0.05)] transition-all"
        >
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setToggleDropDown(true)
            }}
            onFocus={() => setToggleDropDown(true)}
            className="w-full rounded-2xl bg-transparent px-5 py-3.5 text-sm font-medium text-[#14121F] outline-none placeholder:text-[#232323]/40"
            type="text"
            spellCheck={false}
            maxLength={40}
            placeholder="Select activity..."
          />

          <button
            type="button"
            onClick={() => setToggleDropDown((prev) => !prev)}
            className="mr-1 flex cursor-pointer items-center justify-center rounded-xl px-3 text-[#232323]/45 transition-colors hover:bg-[#F4F2F3] hover:text-[#14121F]"
          >
            {toggleDropDown ? (<ChevronUp size={19} strokeWidth={2} />) : (<ChevronDown size={19} strokeWidth={2} />)}
          </button>

          {/* Dropdown Menu */}
          {toggleDropDown && (
            <div className="absolute left-0 top-full z-10 mt-2 flex max-h-60 w-full flex-col overflow-y-auto rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-1.5 shadow-[0_12px_35px_rgba(20,18,31,0.12)]">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => {
                    setCurrentActivity(activity)
                    setSearch(activity.name)
                    setToggleDropDown(false)
                  }}
                  className="group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F4F2F3]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: activity.color || "#E9EAFF",
                      }}
                    />

                    <span className="truncate text-sm font-medium text-[#14121F]">
                      {activity.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleOpenEdit(e, activity)}
                    className="ml-2 cursor-pointer rounded-lg p-1.5 text-[#232323]/35 opacity-0 transition-all hover:bg-[#E9EAFF] hover:text-[#14121F] group-hover:opacity-100"
                  >
                    <Bolt width={17} height={17} />
                  </button>
                </div>
              ))}

              {search.trim().length > 0 && filteredActivities.length === 0 && (
                <button
                  type="button"
                  onClick={() => handleOpenCreate(search)}
                  className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-xl border-t border-[#232323]/6 px-3 py-3 text-left text-sm font-medium text-[#14121F] transition-colors hover:bg-[#E9EAFF]"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#14121F] text-[#FFFFFF]">
                    <Plus size={15} />
                  </span>

                  <span>
                    Create{" "}
                    <span className="font-semibold text-[#232323]">
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
        {!currentActivity?.name && <span className="mt-20 text-3xl font-extrabold opacity-30 select-none">Select one activity</span>}
        {currentActivity?.id && <Timer />}
      </div>

    </main>
  )
}