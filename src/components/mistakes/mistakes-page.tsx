"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Search,
  ArrowUpDown,
  RotateCcw,
  BookOpen,
  Filter,
  TrendingDown,
  XCircle,
  Eye,
} from "lucide-react"

interface MistakeData {
  id: string
  question: string
  subject: string
  topic: string
  wrongCount: number
  totalAttempts: number
  lastMistake: string
  correctRate: number
}

const mockMistakes: MistakeData[] = [
  {
    id: "m1",
    question: "Which of the following is the most common cause of acute pancreatitis?",
    subject: "病理学",
    topic: "消化系统",
    wrongCount: 3,
    totalAttempts: 5,
    lastMistake: "2 hours ago",
    correctRate: 40,
  },
  {
    id: "m2",
    question: "What is the mechanism of action of ACE inhibitors?",
    subject: "药理学",
    topic: "心血管系统",
    wrongCount: 2,
    totalAttempts: 4,
    lastMistake: "Yesterday",
    correctRate: 50,
  },
  {
    id: "m3",
    question: "Describe the pathophysiology of diabetic ketoacidosis",
    subject: "内分泌学",
    topic: "糖尿病",
    wrongCount: 4,
    totalAttempts: 6,
    lastMistake: "3 days ago",
    correctRate: 33,
  },
  {
    id: "m4",
    question: "ST-elevation in leads V1-V4 indicates which type of MI?",
    subject: "心脏病学",
    topic: "缺血性心脏病",
    wrongCount: 1,
    totalAttempts: 3,
    lastMistake: "1 week ago",
    correctRate: 67,
  },
  {
    id: "m5",
    question: "Which antibiotic is contraindicated in children under 8 years?",
    subject: "药理学",
    topic: "抗生素",
    wrongCount: 2,
    totalAttempts: 2,
    lastMistake: "1 week ago",
    correctRate: 0,
  },
]

export function MistakesPage() {
  const [filterSubject, setFilterSubject] = useState("全部")
  const [sortBy, setSortBy] = useState<"count" | "rate">("count")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMistakes = mockMistakes
    .filter((m) => filterSubject === "全部" || m.subject === filterSubject)
    .filter((m) => m.question.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sortBy === "count"
        ? b.wrongCount - a.wrongCount
        : a.correctRate - b.correctRate
    )

  const subjects = [...new Set(mockMistakes.map((m) => m.subject))]
  const totalMistakes = mockMistakes.reduce((sum, m) => sum + m.wrongCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">错题本</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track and review your in正确率 answers
          </p>
        </div>
        <Badge variant="destructive" className="text-sm px-3 py-1">
          {totalMistakes} 总错题数
        </Badge>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mockMistakes.length}</p>
              <p className="text-xs text-muted-foreground">有错题的题目数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">35%</p>
              <p className="text-xs text-muted-foreground">Average 正确率 rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950">
              <RotateCcw className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">待复习</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索错题..."
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="科目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部 subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setSortBy(sortBy === "count" ? "rate" : "count")}
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort by {sortBy === "count" ? "error rate" : "count"}
        </Button>
      </div>

      {/* Mistake list */}
      <div className="space-y-3">
        {filteredMistakes.map((mistake) => (
          <Card key={mistake.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {mistake.subject}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {mistake.topic}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">
                      最近： {mistake.lastMistake}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {mistake.question}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <XCircle className="h-3 w-3 text-red-500" />
                      <span>{mistake.wrongCount}x 次错误</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{mistake.totalAttempts} 次尝试</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-bold">{mistake.correctRate}%</p>
                    <p className="text-xs text-muted-foreground">正确率</p>
                  </div>
                  <Progress
                    value={mistake.correctRate}
                    className="h-1.5 w-20"
                  />
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                    <RotateCcw className="h-3 w-3" />
                    重做
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredMistakes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mb-4 opacity-30" />
            <p className="font-medium">没有找到错题</p>
            <p className="text-sm">继续学习，错题会自动记录在这里</p>
          </div>
        )}
      </div>
    </div>
  )
}


