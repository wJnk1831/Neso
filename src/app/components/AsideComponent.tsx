"use client"

import {
  CalendarClock,
  ChartColumn,
  House,
  PanelLeft,
  PanelRight,
} from "lucide-react"
import { useThemeStore } from "@/core/store/useThemeStore"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

export default function AsideComponent() {
  const pathname = usePathname()

  const collapsed = useThemeStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useThemeStore((state) => state.toggleSidebar)
  const darkMode = useThemeStore((state) => state.darkMode)

  const asideLinks = [
    {
      option: "Home",
      url: "/",
      icon: <House className="h-5 w-5" />,
    },
    {
      option: "Atividades",
      url: "/activities",
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      option: "Estatísticas",
      url: "/analytics",
      icon: <ChartColumn className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className={`
          hidden md:flex
          h-screen shrink-0 flex-col
          border-r border-border
          bg-card p-4 text-text-secondary
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-2 px-2"
              }`}
          >
            <Image
              src={
                darkMode
                  ? "/neso-icon-darkMode.png"
                  : "/neso-icon.png"
              }
              alt="Neso"
              width={36}
              height={36}
              className="rounded-xl"
            />

            {!collapsed && (
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
                Neso
              </span>
            )}
          </div>
        </div>

        <section className="mt-6 flex flex-col gap-1">
          {asideLinks.map((item) => {
            const active = item.url === pathname

            return (
              <Link
                key={item.option}
                href={item.url}
                title={collapsed ? item.option : undefined}
                className={`
                  group flex items-center gap-3 rounded-xl
                  px-3 py-3 transition-all
                  ${active
                    ? "bg-accent text-card shadow-[0_5px_15px_rgba(20,18,31,0.12)]"
                    : "text-text-secondary hover:bg-elevated hover:text-foreground"
                  }
                  ${collapsed ? "justify-center px-0" : ""}
                `}
              >
                <div
                  className={`
                    flex items-center justify-center
                    transition-colors
                    ${active
                      ? "text-card/70"
                      : "text-text-secondary group-hover:text-foreground"
                    }
                  `}
                >
                  {item.icon}
                </div>

                {!collapsed && (
                  <span className="text-sm font-semibold">
                    {item.option}
                  </span>
                )}
              </Link>
            )
          })}
        </section>

        <div className="mt-auto flex flex-col gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={toggleSidebar}
            className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-border bg-input text-text-secondary transition-all hover:bg-elevated hover:text-foreground"
          >
            {collapsed ? (
              <PanelRight size={18} />
            ) : (
              <PanelLeft size={18} />
            )}
          </button>
        </div>
      </nav>

      <nav
        className="
          fixed bottom-0 left-0 right-0 z-50
          flex h-16 items-center justify-around
          border-t border-border
          bg-card/95 px-2
          backdrop-blur-xl
          md:hidden
        ">
        {asideLinks.map((item) => {
          const active = item.url === pathname

          return (
            <Link
              key={item.option}
              href={item.url}
              className={`
                flex h-12 min-w-16 flex-col
                items-center justify-center
                gap-1 rounded-xl
                transition-colors
                ${active
                  ? "bg-accent text-card"
                  : "text-text-secondary hover:text-foreground"
                }
              `}
            >
              {item.icon}

              <span className="text-[10px] font-semibold">
                {item.option}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
