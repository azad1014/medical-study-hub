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
  Bot,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/flashcards", label: "Flashcards", icon: GraduationCap },
  { href: "/questions", label: "Question Bank", icon: FileQuestion },
  { href: "/mistakes", label: "Mistake Notebook", icon: AlertTriangle },
  { href: "/ai-tutor", label: "AI Tutor", icon: Bot },
]

export function Sidebar() {
  const pathname = usePathname()
  const [收起d, set收起d] = useState(false)

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300",
        收起d ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-500 text-white font-bold text-sm">
          MS
        </div>
        {!收起d && (
          <span className="font-semibold text-sm">医学学习中心</span>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!收起d && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Bottom actions */}
      <div className="p-2 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => set收起d(!收起d)}
        >
          {收起d ? (
            <ChevronRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 shrink-0" />
              <span>收起</span>
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!收起d && <span>退出登录</span>}
        </Button>
      </div>
    </aside>
  )
}
