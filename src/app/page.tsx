"use client"

import { useAppStore } from "@/core/store/useAppStore"
import { Activity } from "@/core/types"
import { Bolt, ChevronDown, ChevronUp, Plus, X } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

export default function Home() {
  const { activities, setCurrentActivity, createActivity, updateActivity, } = useAppStore()

  const [search, setSearch] = useState("")
  const [toggleDropDown, setToggleDropDown] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<{ id?: string, name: string, color?: string } | null>(null)

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

  function handleOpenCreate(initialName?: string) {
    setEditingActivity({
      name: initialName || search,
      color: "#3b82f6",
    })

    setToggleDropDown(false)
    setIsModalOpen(true)
  }

  function handleOpenEdit(e: React.MouseEvent, activity: Activity) {
    e.stopPropagation()

    setEditingActivity({
      id: activity.id,
      name: activity.name,
      color: activity.color,
    })

    setToggleDropDown(false)
    setIsModalOpen(true)
  }

  function handleSaveActivity(e: React.FormEvent) {
    e.preventDefault()

    if (!editingActivity || !editingActivity.name.trim()) return

    if (editingActivity.id) {
      updateActivity(editingActivity.id, {
        name: editingActivity.name,
        color: editingActivity.color,
      })
    } else {
      createActivity(editingActivity.name, editingActivity.color)
    }

    setIsModalOpen(false)
    setEditingActivity(null)
    setSearch("")
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F2F3] px-4 py-6 text-[#14121F]">
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

              {search.trim().length > 0 && (
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

      {/* Create/Edit Modal*/}
      {isModalOpen && editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14121F]/45 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-[#232323]/10 bg-[#FFFFFF] p-6 shadow-[0_20px_60px_rgba(20,18,31,0.18)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-[#14121F]">
                {editingActivity.id ? "Edit Activity" : "New Activity"}
              </h2>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-[#232323]/35 transition-colors hover:bg-[#F4F2F3] hover:text-[#14121F]"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handleSaveActivity}
              className="flex flex-col gap-5" >
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#232323]/55">
                  Activity Name
                </label>

                <input
                  type="text"
                  required
                  value={editingActivity.name}
                  onChange={(e) =>
                    setEditingActivity({
                      ...editingActivity,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#232323]/10 bg-[#F4F2F3] px-4 py-3 text-sm font-medium text-[#14121F] outline-none transition-all placeholder:text-[#232323]/35 focus:border-[#14121F]/20 focus:bg-[#FFFFFF] focus:ring-4 focus:ring-[#E9EAFF]"
                  placeholder="e.g. Study Next.js"
                />
              </div>

              <div className="mt-1 flex justify-end gap-2 border-t border-[#232323]/6 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-[#232323]/10 bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#232323] transition-colors hover:bg-[#F4F2F3]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-[#14121F] px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] transition-colors hover:bg-[#232323]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}