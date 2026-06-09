"use client"


import { Separator } from "@/components/ui/separator"
import { BookOpen, GraduationCap, Flame, Brain, TrendingUp } from "lucide-react"
import Link from "next/link"

const dueCards = 24
const dueQuestions = 12
const streakDays = 7
const masteredCards = 142

const weeklyProgress = [
  { day: "一", count: 45 },
  { day: "二", count: 30 },
  { day: "三", count: 60 },
  { day: "四", count: 25 },
  { day: "五", count: 50 },
  { day: "六", count: 35 },
  { day: "日", count: 0 },
]

const maxWeekCount = Math.max(...weeklyProgress.map((d) => d.count), 1)

export function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "早上好" : hour < 18 ? "下午好" : "晚上好"

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {greeting}，医学生
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {new Date().toLocaleDateString("zh-CN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Today's tasks */}
      <section className="space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          今天你要完成
        </h2>

        <Link href="/flashcards" className="block group">
          <div className="flex items-center gap-4 p-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium group-hover:text-blue-600 transition-colors">
                复习 {dueCards} 张卡片
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                病理学 12 张 · 药理学 8 张 · 微生物学 4 张
              </p>
            </div>
            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden shrink-0">
              <div className="h-full rounded-full bg-blue-500" style={{ width: "42%" }} />
            </div>
          </div>
        </Link>

        <Link href="/questions" className="block group">
          <div className="flex items-center gap-4 p-4 -mx-4 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium group-hover:text-emerald-600 transition-colors">
                完成 {dueQuestions} 道题目
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                心血管系统 · 上周错误率最高
              </p>
            </div>
            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden shrink-0">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: "30%" }} />
            </div>
          </div>
        </Link>
      </section>

      <Separator className="bg-border/50" />

      {/* Weekly Progress */}
      <section>
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-5">
          本周进度
        </h2>
        <div className="space-y-3">
          {weeklyProgress.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="w-4 text-xs text-muted-foreground text-center">{day.day}</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-medical-500/70 transition-all"
                  style={{ width: (day.count / maxWeekCount * 100) + "%" }}
                />
              </div>
              <span className="w-8 text-xs text-right text-muted-foreground tabular-nums">
                {day.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Separator className="bg-border/50" />

      {/* Bottom stats */}
      <div className="flex items-center gap-6 pb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">
            连续学习 <strong className="text-foreground">{streakDays}</strong> 天
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          <span className="text-sm text-muted-foreground">
            已掌握 <strong className="text-foreground">{masteredCards}</strong> 张卡片
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-medical-500" />
          <span className="text-sm text-muted-foreground">
            总学习 <strong className="text-foreground">24.5</strong> 小时
          </span>
        </div>
      </div>
    </div>
  )
}


