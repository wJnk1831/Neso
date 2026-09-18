"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/core/store/useThemeStore"

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const darkMode = useThemeStore((state) => state.darkMode)

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add("dark")
      html.style.colorScheme = "dark"
    } else {
      html.classList.remove("dark")
      html.style.colorScheme = "light"
    }
  }, [darkMode])

  return <>{children}</>
}