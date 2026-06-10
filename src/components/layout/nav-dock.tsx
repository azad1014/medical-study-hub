"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileQuestion,
  AlertTriangle,
  Sparkles,
  Bot,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { href: "/", label: "工作台", icon: LayoutDashboard },
  { href: "/memory-hub", label: "记忆中心", icon: Brain },
  { href: "/knowledge-base", label: "知识库", icon: BookOpen },
  { href: "/flashcards", label: "闪卡", icon: GraduationCap },
  { href: "/questions", label: "题库", icon: FileQuestion },
  { href: "/mistakes", label: "错题本", icon: AlertTriangle },
  { href: "/generate", label: "资料生成", icon: Sparkles },
  { href: "/ai-tutor", label: "AI 导师", icon: Bot },
]

export function NavDock() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col items-center w-12 border-r bg-card py-3 gap-1 shrink-0">
      {/* Mini logo */}
      <div className="h-8 w-8 rounded-lg bg-medical-500 flex items-center justify-center mb-2">
        <span className="text-white font-bold text-xs">MS</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Tooltip key={item.href} delayDuration={200}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-center h-9 w-9 rounded-lg transition-colors",
                    isActive
                      ? "bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-medical-500 rounded-full" />
                  )}
                  <Icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      {/* Avatar at bottom */}
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Avatar className="h-7 w-7 cursor-pointer">
            <AvatarFallback className="text-[10px] bg-muted">医</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          设置
        </TooltipContent>
      </Tooltip>
    </aside>
  )
}


