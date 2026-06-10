"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  FileText,
  File,
  Loader2,
  Sparkles,
  BookOpen,
  GraduationCap,
  HelpCircle,
  Copy,
  Check,
  Trash2,
  AlertCircle,
} from "lucide-react"
import { extractFileText, formatFileSize, isSupportedFile } from "@/lib/file-parser"
const STORAGE_KEY = "medical-study-generate-history"
interface HistoryItem {
  id: string
  fileName: string
  timestamp: string
  summary: string
  result: { full: string; notes: string; cards: string; quiz: string }
}
function loadHistory(): HistoryItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") }
  catch { return [] }
}
function saveToHistory(item: HistoryItem) {
  const history = loadHistory()
  history.unshift(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)))
}

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface FileItem {
  file: File
  text: string
  status: "pending" | "extracting" | "generating" | "done" | "error"
  error?: string
  result?: {
    full: string
    notes: string
    cards: string
    quiz: string
  }
}

export function GeneratePage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [activeTab, setActiveTab] = useState("notes")
  const [supplement, setSupplement] = useState(true)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { setHistory(loadHistory()) }, [])

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const items: FileItem[] = Array.from(newFiles)
      .filter(isSupportedFile)
      .map((f) => ({ file: f, text: "", status: "pending" }))
    
    if (items.length === 0) {
      alert("暂只支持 PDF、Word (.docx) 和 TXT 文件")
      return
    }
    
    setFiles((prev) => [...prev, ...items])
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const processFile = async (index: number) => {
    const item = files[index]
    if (!item || item.status !== "pending") return

    setFiles((prev) => {
      const next = [...prev]
      next[index].status = "extracting"
      return next
    })

    try {
      // Step 1: Extract text
      const { text } = await extractFileText(item.file)
      
      setFiles((prev) => {
        const next = [...prev]
        next[index].text = text
        next[index].status = "generating"
        return next
      })

      // Step 2: Send to AI for generation
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.slice(0, 15000),
          fileName: item.file.name,
          supplement,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setFiles((prev) => {
          const next = [...prev]
          next[index].status = "error"
          next[index].error = data.error
          return next
        })
        return
      }

      setFiles((prev) => {
        const next = [...prev]
        next[index].status = "done"
        next[index].result = data
        return next
      })
      const summary = data.notes ? data.notes.slice(0, 80) + "..." : "无笔记内容"
      saveToHistory({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        fileName: item.file.name,
        timestamp: new Date().toLocaleString("zh-CN"),
        summary,
        result: data,
      })
      setHistory(loadHistory())
    } catch (err) {
      setFiles((prev) => {
        const next = [...prev]
        next[index].status = "error"
        next[index].error = err instanceof Error ? err.message : "处理失败"
        return next
      })
    }
  }

  const processAll = () => {
    files.forEach((item, i) => {
      if (item.status === "pending") processFile(i)
    })
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setFiles([])
  }

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const doneFiles = files.filter((f) => f.status === "done")
  const currentResult = doneFiles.length > 0 ? doneFiles[doneFiles.length - 1].result : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">资料生成</h1>
        <p className="text-muted-foreground text-sm mt-1">
          上传 PDF、Word 或笔记文件，AI 自动生成学习笔记、闪卡和练习题
        </p>
      </div>

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-medical-500 bg-medical-50 dark:bg-medical-950"
            : "border-muted-foreground/25 hover:border-medical-400 hover:bg-muted/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium mb-1">
          拖拽文件到这里，或点击选择
        </p>
        <p className="text-sm text-muted-foreground">
          支持 PDF、Word (.docx)、TXT、Markdown
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Switch id="supplement" checked={supplement} onCheckedChange={setSupplement} />
          <Label htmlFor="supplement" className="text-sm cursor-pointer">
            AI 补充额外医学知识
          </Label>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-medical-500" />
              已添加 {files.length} 个文件
            </CardTitle>
            <div className="flex gap-2">
              {files.some((f) => f.status === "pending") && (
                <Button size="sm" onClick={processAll} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  全部生成
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card"
              >
                <div className="p-2 rounded-lg bg-medical-100 dark:bg-medical-950">
                  {item.file.name.endsWith(".pdf") ? (
                    <FileText className="h-5 w-5 text-red-500" />
                  ) : (
                    <File className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(item.file.size)}
                    {item.text && ` · ${item.text.length} 字`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "pending" && (
                    <>
                      <Badge variant="outline">待处理</Badge>
                      <Button size="sm" variant="outline" onClick={() => processFile(i)}>
                        生成
                      </Button>
                    </>
                  )}
                  {item.status === "extracting" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      读取文件中...
                    </div>
                  )}
                  {item.status === "generating" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI 生成中...
                    </div>
                  )}
                  {item.status === "done" && (
                    <Badge variant="success">完成</Badge>
                  )}
                  {item.status === "error" && (
                    <div className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {item.error?.slice(0, 30)}...
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {currentResult && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                生成结果
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => copyContent(currentResult.full)}
              >
                <Copy className="h-4 w-4" />
                复制全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="notes" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  学习笔记
                </TabsTrigger>
                <TabsTrigger value="cards" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  闪卡
                </TabsTrigger>
                <TabsTrigger value="quiz" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  自测题
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[400px]">
                <TabsContent value="notes">
                  {currentResult.notes ? (
                    <div className="prose-medical whitespace-pre-line">
                      {currentResult.notes}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      未生成笔记内容
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="cards">
                  {currentResult.cards ? (
                    <div className="space-y-2">
                      {currentResult.cards.split("\n").filter(Boolean).map((line, i) => {
                        const parts = line.split("|")
                        if (parts.length >= 2) {
                          return (
                            <div key={i} className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{parts[0].trim()}</p>
                              </div>
                              <Separator orientation="vertical" className="h-auto" />
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{parts.slice(1).join("|").trim()}</p>
                              </div>
                            </div>
                          )
                        }
                        return <p key={i} className="text-sm text-muted-foreground">{line}</p>
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      未生成闪卡内容
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="quiz">
                  {currentResult.quiz ? (
                    <div className="space-y-4">
                      {currentResult.quiz.split("\n").filter(Boolean).map((line, i) => {
                        const parts = line.split("||")
                        if (parts.length >= 2) {
                          return (
                            <div key={i} className="p-4 rounded-lg border space-y-2">
                              <p className="text-sm font-medium">{parts[0].trim()}</p>
                              <p className="text-sm text-muted-foreground">{parts[1].trim()}</p>
                              {parts[2] && (
                                <p className="text-xs text-green-600 font-medium">
                                  答案：{parts[2].trim()}
                                </p>
                              )}
                              {parts[3] && (
                                <p className="text-xs text-muted-foreground">
                                  {parts[3].trim()}
                                </p>
                              )}
                            </div>
                          )
                        }
                        return <p key={i} className="text-sm">{line}</p>
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      未生成自测题
                    </div>
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Usage tip */}
      {files.length === 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>上传你的课件或教材，AI 会自动生成：</p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li><strong>学习笔记</strong> — 按知识点整理的核心内容</li>
                  <li><strong>复习闪卡</strong> — 一问一答，适合间隔重复</li>
                  <li><strong>自测题</strong> — 检验掌握程度的练习题</li>
                </ul>
                <p className="mt-2 text-xs">支持 PDF 教材、Word 讲义、纯文本笔记。单次最多处理 15000 字。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History section */}
      {history.length > 0 && (
        <section className="space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              历史记录 ({history.length})
            </h2>
            <button
              onClick={() => { localStorage.removeItem(STORAGE_KEY); setHistory([]) }}
              className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
            >
              清空全部
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  const fakeFile = ({ name: item.fileName } as File)
                  const fakeItem: FileItem = { file: fakeFile, text: "", status: "done", result: item.result }
                  setFiles([fakeItem])
                }}
                className="w-full text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{item.fileName}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">{item.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{item.summary}</p>
              </button>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}