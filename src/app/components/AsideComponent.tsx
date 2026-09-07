'use client'

import { CalendarClock, ChartColumn, House } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AsideComponent() {
  const pathname = usePathname()

  const asideLinks = [
    { option: 'Home', url: '/', icon: <House className="w-5 h-5" /> },
    { option: 'Activites', url: '/activities', icon: <CalendarClock className="w-5 h-5" /> },
    { option: 'Analytics', url: '/analytics', icon: <ChartColumn className="w-5 h-5" /> },
  ]


  return (
    <nav className="flex flex-col gap-8 bg-[#F4F2F3] w-[15%] text-[#232323] p-4 border-r-2 border-zinc-200">
      <div className="flex gap-1 items-center">
        <Image src={'/neso-icon.png'} alt="" width={44} height={44} />
        <span className="font-extrabold text-2xl">Neso</span>
      </div>

      <section>
        {asideLinks.map((i) => {
          const active = i.url === pathname
          return (
            <Link key={i.option} href={i.url} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all group ${active ? 'bg-[#14121F] text-[#fafafa]' : 'text-zinc-900 hover:text-zinc-400'}`}>
              <div className={`${active ? 'text-primary' : 'text-[#14121F] group-hover:text-zinc-400'}`}>
                {i.icon}
              </div>
              <span className="text-sm font-medium">{i.option}</span>
            </Link>
          )
        })}
      </section>
    </nav>
  )
}