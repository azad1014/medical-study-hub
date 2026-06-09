"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  GraduationCap,
  AlertTriangle,
  Flame,
  Clock,
  TrendingUp,
  Target,
  Brain,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for demonstration
const stats = [
  {
    label: "待复习卡片",
    value: "24",
    icon: GraduationCap,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-950",
    href: "/flash张卡片",
  },
  {
    label: "待做题目",
    value: "12",
    icon: BookOpen,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-950",
    href: "/questions",
  },
  {
    label: "错题",
    value: "8",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-950",
    href: "/错题",
  },
  {
    label: "连续天数",
    value: "7",
    icon: Flame,
    color: "text-rose-600",
    bg: "bg-rose-100 dark:bg-rose-950",
    href: "/",
  },
]

const recentSessions = [
  { type: "闪卡复习", subject: "Pathology", 张卡片: 15, time: "25分钟", ago: "2小时前" },
  { type: "Quiz", subject: "Pharmacology", 张卡片: 10, time: "15分钟", ago: "昨天" },
  { type: "心血管系统", subject: "Cardiology", 张卡片: 20, time: "30分钟", ago: "昨天" },
  { type: "错题复习", subject: "肾脏系统", 张卡片: 8, time: "12分钟", ago: "2天前" },
]

const weeklyProgress = [
  { day: "Mon", count: 45 },
  { day: "Tue", count: 30 },
  { day: "Wed", count: 60 },
  { day: "Thu", count: 25 },
  { day: "Fri", count: 50 },
  { day: "Sat", count: 35 },
  { day: "Sun", count: 40 },
]

// Generate heatmap data (最近12周)
function generateHeatmapData() {
  const data = []
  const 今日 = new Date()
  for (let i = 83; i >= 0; i--) {
    const date = new Date(今日)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10),
    })
  }
  return data
}

const heatmapData = generateHeatmapData()

function getHeatmapColor(count: number): string {
  if (count === 0) return "bg-muted"
  if (count <= 2) return "bg-medical-200 dark:bg-medical-950"
  if (count <= 5) return "bg-medical-400 dark:bg-medical-800"
  if (count <= 7) return "bg-medical-600 dark:bg-medical-600"
  return "bg-medical-800 dark:bg-medical-400"
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">工作台</h1>
        <p className="text-muted-foreground text-sm mt-1">
          欢迎回来！这是你的学习概览。
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      今日
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Heatmap */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-medical-500" />
                学习动态
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Weekly chart */}
              <div className="mb-6">
                <div className="flex items-end gap-2 h-32">
                  {weeklyProgress.map((day) => {
                    const height = (day.count / 60) * 100
                    return (
                      <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-muted-foreground">{day.count}</span>
                        <div
                          className="w-full rounded-md bg-medical-500/80 dark:bg-medical-600 transition-all"
                          style={{ height: `${height}%`, minHeight: "4px" }}
                        />
                        <span className="text-xs text-muted-foreground">{day.day}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Heatmap */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">最近12周</p>
                <div className="flex flex-wrap gap-[3px]">
                  {heatmapData.map((day) => (
                    <div
                      key={day.date}
                      className={`heatmap-cell ${getHeatmapColor(day.count)}`}
                      title={`${day.date}: ${day.count} reviews`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>少</span>
                  <div className="heatmap-cell bg-muted" />
                  <div className="heatmap-cell bg-medical-200 dark:bg-medical-950" />
                  <div className="heatmap-cell bg-medical-400 dark:bg-medical-800" />
                  <div className="heatmap-cell bg-medical-600 dark:bg-medical-600" />
                  <div className="heatmap-cell bg-medical-800 dark:bg-medical-400" />
                  <span>多</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* 学习统计 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-medical-500" />
                学习统计
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">今日进度</span>
                  <span className="font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">张卡片 Mastered</span>
                  <span className="font-medium">142</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
              <div className="flex items-center gap-3 text-sm pt-2">
                <Brain className="h-4 w-4 text-medical-500" />
                <span className="text-muted-foreground">总学习时长：</span>
                <span className="font-medium">24.5h</span>
              </div>
            </CardContent>
          </Card>

          {/* 快捷操作 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/flash张卡片">
                  Review Due 张卡片
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/questions">
                  开始答题
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/错题">
                  Review 错题
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-medical-500" />
            最近学习记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentSessions.map((session, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-medical-100 dark:bg-medical-950 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-medical-600 dark:text-medical-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{session.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.subject} &middot; {session.张卡片} 张卡片
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{session.time}</p>
                  <p className="text-xs text-muted-foreground">{session.ago}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


