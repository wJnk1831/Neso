import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeState {
  darkMode: boolean
  sidebarCollapsed: boolean
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (value: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarCollapsed: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (value) => set({ darkMode: value }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
    }),
    {
      name: "neso-theme",
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)

export function useTheme() {
  return useThemeStore()
}

export function useDarkMode() {
  return useThemeStore((state) => state.darkMode)
}

export function useSidebarCollapsed() {
  return useThemeStore((state) => state.sidebarCollapsed)
}