"use client"

import { CalendarClock, ChartColumn, House } from "lucide-react"

import Image from "next/image"

import Link from "next/link"

import { usePathname } from "next/navigation"

export default function AsideComponent() {
  const pathname = usePathname()

  const asideLinks = [
    {
      option: "Home",
      url: "/",
      icon: <House className="w-5 h-5" />,
    },
    {
      option: "Activites",
      url: "/activities",
      icon: <CalendarClock className="w-5 h-5" />,
    },
    {
      option: "Analytics",
      url: "/analytics",
      icon: <ChartColumn className="w-5 h-5" />,
    },
  ]

  return (
    <nav className="flex h-screen w-[15%] flex-col gap-10 border-r border-[#232323]/6 bg-[#FFFFFF] p-5 text-[#232323]">
      <div className="flex items-center gap-2 px-2">
        <Image src="/neso-icon.png" alt="" width={40} height={40} className="rounded-xl" />

        <span className="text-2xl font-extrabold tracking-tight text-[#14121F]">
          Neso
        </span>
      </div>

      {/* Navigation */}
      <section className="flex flex-col gap-1">
        {asideLinks.map((i) => {
          const active = i.url === pathname

          return (
            <Link
              key={i.option}
              href={i.url}
              className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 transition-all ${active ? "bg-[#14121F] text-[#FFFFFF] shadow-[0_5px_15px_rgba(20,18,31,0.12)]" : "text-[#232323]/65 hover:bg-[#F4F2F3] hover:text-[#14121F]"}`} >
              <div className={`flex items-center justify-center transition-colors ${active ? "text-[#E9EAFF]" : "text-[#14121F] group-hover:text-[#14121F]"}`} >
                {i.icon}
              </div>

              <span className="text-sm font-semibold">{i.option}</span>
            </Link>
          )
        })}
      </section>
    </nav>
  )
}