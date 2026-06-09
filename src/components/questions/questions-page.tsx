"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  FileQuestion,
  BookOpen,
  Lightbulb,
  Bookmark,
  Flag,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Filter,
  Shuffle,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface QuestionData {
  id: string
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "CASE_ANALYSIS"
  stem: string
  options: string[]
  correctAnswer: string[]
  explanation: string
  subject: string
  difficulty: number
  tags: string[]
}

const mockQuestions: QuestionData[] = [
  {
    id: "q1",
    type: "SINGLE_CHOICE",
    stem: "Which of the following is the most common cause of acute pancreatitis?",
    options: ["Alcohol", "Gallstones", "Hypertriglyceridemia", "Trauma", "Medications"],
    correctAnswer: ["1"],
    explanation: "Gallstones are the most common cause of acute pancreatitis, accounting for about 40% of cases. Alcohol is the second most common cause.",
    subject: "\u75c5\u7406\u5b66",
    difficulty: 2,
    tags: ["\u6d88\u5316\u7cfb\u7edf", "\u80f0\u810f"],
  },
  {
    id: "q2",
    type: "MULTIPLE_CHOICE",
    stem: "Which of the following are risk factors for developing DVT? (Select all that apply)",
    options: ["Prolonged immobility", "Factor V Leiden mutation", "Aspirin use", "Pregnancy", "Active malignancy"],
    correctAnswer: ["0", "1", "3", "4"],
    explanation: "Virchow\"s triad: stasis (immobility, pregnancy), hypercoagulability (Factor V Leiden, malignancy), endothelial injury. Aspirin is antiplatelet, not a risk factor.",
    subject: "\u75c5\u7406\u5b66",
    difficulty: 3,
    tags: ["\u8840\u7ba1", "\u8840\u6db2\u5b66"],
  },
  {
    id: "q3",
    type: "TRUE_FALSE",
    stem: "The antibiotic of choice for syphilis is doxycycline.",
    options: ["True", "False"],
    correctAnswer: ["1"],
    explanation: "False. The antibiotic of choice for syphilis is penicillin G. Doxycycline is an alternative for penicillin-allergic patients.",
    subject: "\u836f\u7406\u5b66",
    difficulty: 2,
    tags: ["\u6297\u751f\u7d20", "\u6027\u4f20\u64ad\u611f\u67d3"],
  },
  {
    id: "q4",
    type: "CASE_ANALYSIS",
    stem: "A 65-year-old male with history of hypertension and diabetes presents with sudden onset chest pain radiating to the left arm, diaphoresis, and nausea. ECG shows ST-elevation in leads V1-V4. What is the most likely diagnosis?",
    options: ["Unstable angina", "Acute pericarditis", "ST-elevation MI (anterior)", "Aortic dissection", "Pulmonary embolism"],
    correctAnswer: ["2"],
    explanation: "ST-elevation in V1-V4 (anterior leads) with classic symptoms of MI indicates an anterior wall STEMI. The left anterior descending artery is likely the culprit vessel.",
    subject: "\u5fc3\u810f\u75c5\u5b66",
    difficulty: 4,
    tags: ["\u5fc3\u810f\u75c5\u5b66", "\u5fc3\u808c\u6897\u6b7b", "\u6025\u8bca"],
  },
]

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-1.5 w-3 rounded-full ${
            i <= level ? "bg-medical-500" : "bg-muted"
          }`}
        />
      ))}
    </div>
  )
}

export function QuestionsPage() {
  const [questions] = useState<QuestionData[]>(mockQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [filterSubject, setFilterSubject] = useState("all")
  const [mode, setMode] = useState<"study" | "quiz">("study")

  const question = questions[currentIndex]

  const handleSelectSingle = (value: string) => {
    if (submitted) return
    setSelectedAnswers([value])
  }

  const handleSelectMultiple = (value: string) => {
    if (submitted) return
    setSelectedAnswers((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    )
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
    setSelectedAnswers([])
    setSubmitted(false)
  }

  const isCorrect = () => {
    if (!question) return false
    const sortedSelected = [...selectedAnswers].sort()
    const sortedCorrect = [...question.correctAnswer].sort()
    return (
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((v, i) => v === sortedCorrect[i])
    )
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <div className="text-center">
          <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold mb-2">\u6ca1\u6709\u627e\u5230\u9898\u76ee</h2>
          <p className="text-muted-foreground">\u8bf7\u6dfb\u52a0\u4e00\u4e9b\u9898\u76ee\u5230\u9898\u5e93\uff01</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">\u9898\u5e93</h1>
          <p className="text-muted-foreground text-sm mt-1">
            \u901a\u8fc7\u7ec3\u4e60\u9898\u68c0\u9a8c\u4f60\u7684\u77e5\u8bc6\u638c\u63e1\u7a0b\u5ea6
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="\u79d1\u76ee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">\u5168\u90e8\u79d1\u76ee</SelectItem>
              <SelectItem value="\u75c5\u7406\u5b66">\u75c5\u7406\u5b66</SelectItem>
              <SelectItem value="\u836f\u7406\u5b66">\u836f\u7406\u5b66</SelectItem>
              <SelectItem value="\u5fc3\u810f\u75c5\u5b66">\u5fc3\u810f\u75c5\u5b66</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Shuffle className="h-4 w-4" />
            \u968f\u673a
          </Button>
        </div>
      </div>

      {/* Question type tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as "study" | "quiz")}>
        <TabsList>
          <TabsTrigger value="study">\u5b66\u4e60\u6a21\u5f0f</TabsTrigger>
          <TabsTrigger value="quiz">\u8003\u8bd5\u6a21\u5f0f</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question list sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">\u9898\u76ee\u5217\u8868</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-0.5">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(i)
                      setSelectedAnswers([])
                      setSubmitted(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      i === currentIndex
                        ? "bg-medical-50 text-medical-700 dark:bg-medical-950 dark:text-medical-300"
                        : "hover:bg-accent text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">
                        Q{i + 1}. {q.stem.slice(0, 40)}...
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1 ml-2 shrink-0">
                        {q.type === "SINGLE_CHOICE" ? "\u5355\u9009" : q.type === "MULTIPLE_CHOICE" ? "\u591a\u9009" : q.type === "TRUE_FALSE" ? "\u5224\u65ad" : "\u75c5\u4f8b"}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main question area */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {question.subject}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">
                      {question.type.replace(/_/g, " ").toLowerCase()}
                    </Badge>
                    <DifficultyStars level={question.difficulty} />
                  </div>
                  <CardTitle className="text-base font-medium mt-2 leading-relaxed">
                    {question.stem}
                  </CardTitle>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.type === "TRUE_FALSE" ? (
                <RadioGroup
                  value={selectedAnswers[0] || ""}
                  onValueChange={handleSelectSingle}
                >
                  {question.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                        submitted
                          ? question.correctAnswer.includes(String(i))
                            ? "border-green-500 bg-green-50 dark:bg-green-950"
                            : selectedAnswers.includes(String(i))
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : ""
                          : "hover:bg-accent"
                      }`}
                    >
                      <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : question.type === "MULTIPLE_CHOICE" ? (
                <div className="space-y-3">
                  {question.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                        submitted
                          ? question.correctAnswer.includes(String(i))
                            ? "border-green-500 bg-green-50 dark:bg-green-950"
                            : selectedAnswers.includes(String(i))
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : ""
                          : "hover:bg-accent"
                      }`}
                    >
                      <Checkbox
                        id={`opt-${i}`}
                        checked={selectedAnswers.includes(String(i))}
                        onCheckedChange={() => handleSelectMultiple(String(i))}
                      />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={selectedAnswers[0] || ""}
                  onValueChange={handleSelectSingle}
                >
                  {question.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                        submitted
                          ? question.correctAnswer.includes(String(i))
                            ? "border-green-500 bg-green-50 dark:bg-green-950"
                            : selectedAnswers.includes(String(i))
                            ? "border-red-500 bg-red-50 dark:bg-red-950"
                            : ""
                          : "hover:bg-accent"
                      }`}
                    >
                      <RadioGroupItem value={String(i)} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer">
                        {opt}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>

            {/* Explanation */}
            {submitted && (
              <CardContent className="border-t pt-4">
                <div className={`flex items-start gap-3 p-4 rounded-lg ${
                  isCorrect()
                    ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900"
                    : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900"
                }`}>
                  {isCorrect() ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-sm mb-1">
                      {isCorrect() ? "\u6b63\u786e\uff01" : "\u9519\u8bef"}
                    </p>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        {question.explanation}
                      </p>
                    </div>
                    {question.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}

            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                \u9898\u76ee {currentIndex + 1} / {questions.length}
              </p>
              <div className="flex gap-2">
                {!submitted ? (
                  <Button onClick={handleSubmit} disabled={selectedAnswers.length === 0}>
                    \u63d0\u4ea4\u7b54\u6848
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    {currentIndex < questions.length - 1 ? (
                      <>
                        \u4e0b\u4e00\u9898
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      "\u5b8c\u6210"
                    )}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
