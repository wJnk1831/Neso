"use client"

import { Moon, Sun } from "lucide-react"
import { useThemeStore } from "@/core/store/useThemeStore"

export default function ThemeToggle() {
  const darkMode = useThemeStore((state) => state.darkMode)
  const toggle = useThemeStore((state) => state.toggleDarkMode)

  return (
    <button
      type="button"
      onClick={toggle}
      title={darkMode ? "Desativar modo escuro" : "Ativar modo escuro"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card text-text-secondary transition-all hover:bg-elevated hover:text-foreground"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}