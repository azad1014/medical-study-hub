"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { BookOpen, Eye, EyeOff, Brain, GraduationCap, FileQuestion, AlertTriangle, Sparkles } from "lucide-react"

interface HistoryItem {
  id: string
  fileName: string
  timestamp: string
  summary: string
  result: { full: string; notes: string; cards: string; quiz: string }
}

function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem("medical-study-generate-history") || "[]") }
  catch { return [] }
}

function cleanMd(text: string): string {
  return text
    .replace(/#/g, "").replace(/\*/g, "")
    .replace(/-{3,}/g, "").replace(/>/g, "")
    .replace(/
{3,}/g, "

").trim()
}

export function MemoryHubPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selected, setSelected] = useState<HistoryItem | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => { setHistory(loadHistory()) }, [])

  const item = selected
  const notes = item ? cleanMd(item.result.notes) : ""
  const cardLines = item ? item.result.cards.split("
").filter(Boolean) : []
  const quizLines = item ? item.result.quiz.split("
").filter(Boolean) : []

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Left: document list */}
      <Card className="w-56 shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-medical-500" />
            知识清单
          </CardTitle>
        </CardHeader>
        <CardContent className="p-1">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {history.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground text-center">
                还没有知识内容<br />
                去 <Link href="/generate" className="text-medical-500 hover:underline">资料生成</Link> 上传文件
              </div>
            )}
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelected(h)}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selected?.id === h.id
                    ? "bg-medical-50 text-medical-700 dark:bg-medical-950"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <span className="truncate block">{h.fileName}</span>
                <span className="text-[10px] text-muted-foreground">{h.timestamp}</span>
              </button>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Center: content */}
      <Card className="flex-1">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {item ? item.fileName.replace(/\.[^.]+$/, "") : "选择一份资料"}
            </CardTitle>
            {item && (
              <Button variant="ghost" size="sm" onClick={() => setHidden(!hidden)} className="gap-2">
                {hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                {hidden ? "显示" : "隐藏"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            {!item && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Brain className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-sm">从左侧选择一份资料开始学习</p>
              </div>
            )}
            {item && (
              <div className="space-y-6">
                {/* Notes */}
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-medical-500" />
                    学习笔记
                  </h3>
                  <div className={`text-sm leading-relaxed whitespace-pre-line ${hidden ? "blur-sm select-none" : ""}`}>
                    {notes || "无笔记内容"}
                  </div>
                </div>

                {cardLines.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-medical-500" />
                        闪卡
                      </h3>
                      <div className="space-y-2">
                        {cardLines.map((line, i) => {
                          const parts = line.split("|")
                          return (
                            <div key={i} className="flex gap-2 p-2 rounded bg-muted/50 text-sm">
                              <span className="font-medium shrink-0">{parts[0]?.trim()}</span>
                              <span className="text-muted-foreground">{parts.slice(1).join("|")}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Right: quick actions */}
      <Card className="w-48 shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">快捷操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-2">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/flashcards">
              <GraduationCap className="h-4 w-4" />
              闪卡复习
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/questions">
              <FileQuestion className="h-4 w-4" />
              题目训练
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/mistakes">
              <AlertTriangle className="h-4 w-4" />
              错题本
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/generate">
              <Sparkles className="h-4 w-4" />
              上传资料
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
