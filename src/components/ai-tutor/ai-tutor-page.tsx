"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Bot,
  Send,
  Plus,
  Sparkles,
  BookOpen,
  StickyNote,
  Beaker,
  Brain,
  Lightbulb,
  Trash2,
  Loader2,
} from "lucide-react"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

const suggestionPrompts = [
  { icon: BookOpen, label: "解释", prompt: "解释肾病综合征的病理生理学" },
  { icon: Beaker, label: "对比", prompt: "对比 ACEI 和 ARB 的异同" },
  { icon: Brain, label: "总结", prompt: "总结急性炎症反应" },
  { icon: StickyNote, label: "记忆口诀", prompt: "帮我记忆脑神经" },
  { icon: Lightbulb, label: "生成练习", prompt: "生成5道关于糖尿病的练习题" },
]

export function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是你的 AI 医学导师。 I can help you with:\n\n- 解释ing medical concepts\n- Comparing drugs and diseases\n- Summarizing topics\n- Creating 记忆口诀s\n- Generating practice questions\n\n今天想学什么？",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: (() => {
          const ctx = [...messages, userMessage]
            .filter((m) => m.role !== "system")
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content }))
          return JSON.stringify({ messages: ctx })
        })(),
      })

      const data = await res.json()
      const aiContent = data.response || "没有收到回复，请重试"

      const aiResponse: Message = {
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch {
      // Fallback to mock response if API fails
      const aiResponse: Message = {
        role: "assistant",
        content: generateMockResponse(userMessage.content),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestion = (prompt: string) => {
    setInput(prompt)
  }

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "你好！我是你的 AI 医学导师。 今天想学什么？",
        timestamp: new Date(),
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Main chat area */}
      <Card className="flex-1 flex flex-col">
        {/* Chat header */}
        <CardHeader className="pb-3 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-medical-500 to-purple-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">AI 医学导师</CardTitle>
                <p className="text-xs text-muted-foreground">由 OpenAI 驱动</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3 text-amber-500" />
                AI
              </Badge>
              <Button variant="ghost" size="icon" onClick={handleNewChat} title="新对话">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-medical-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="prose-medical text-sm whitespace-pre-line">
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 opacity-60">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-medical-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">思考中...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="向你的医学导师提问..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Right: 建议 */}
      <Card className="w-64 shrink-0 hidden lg:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">建议</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 p-2">
          {suggestionPrompts.map((suggestion, i) => {
            const Icon = suggestion.icon
            return (
              <button
                key={i}
                onClick={() => handleSuggestion(suggestion.prompt)}
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4 text-medical-500" />
                  <span className="text-sm font-medium">{suggestion.label}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.prompt}
                </p>
              </button>
            )
          })}
          <Separator className="my-2" />
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <Trash2 className="h-4 w-4 mr-2" />
            清除历史
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

/** Mock AI response generator for demo */
function generateMockResponse(query: string): string {
  const lower = query.toLowerCase()

  if (lower.includes("nephrotic") || lower.includes("鑲剧梾")) {
    return `**Nephrotic Syndrome**\n\n**Definition:** A kidney disorder characterized by proteinuria (>3.5 g/day), hypoalbuminemia, edema, and hyperlipidemia.\n\n**Pathophysiology:**\n1. Damage to glomerular basement membrane\n2. Increased permeability to proteins\n3. Massive proteinuria\n4. Hypoalbuminemia leading to edema\n\n**Common Causes:**\n- Minimal Change Disease (children)\n- Focal Segmental Glomerulosclerosis\n- Membranous Nephropathy\n- Diabetic Nephropathy\n\n**Clinical Features:**\n- Periorbital edema\n- Foamy urine\n- Fatigue\n- Thromboembolism risk`
  }

  if (lower.includes("ace") || lower.includes("arb")) {
    return `**ACE Inhibitors vs ARBs**\n\n**Mechanism:**\n| Feature | ACE-I | ARB |\n|---|---|---|\n| Target | ACE enzyme | AT1 receptor |\n| Effect | \u2193 Ang II, \u2191 Bradykinin | Block Ang II directly |\n| Cough | Common (bradykinin) | Rare |\n| Angioedema | Yes | Less common |\n| Renal protection | Yes | Yes |\n\n**Side Effects:**\nACE-I: Cough, hyperkalemia, angioedema\nARB: Hyperkalemia (less cough)\n\n**Exam Tip:** Both are first-line for hypertension, especially in diabetics with proteinuria.`
  }

  if (lower.includes("inflammation") || lower.includes("鐐庣棁")) {
    return `**Acute Inflammatory Response**\n\n**Cardinal Signs:**\n1. Rubor (redness) - vasodilation\n2. Calor (heat) - increased blood flow\n3. Tumor (swelling) - increased permeability\n4. Dolor (pain) - chemical mediators\n5. Functio laesa (loss of function)\n\n**Timeline:**\n- Immediate: Vasoconstriction (seconds)\n- Early: Vasodilation, increased permeability (minutes)\n- Cellular: Neutrophil recruitment (hours)\n- Resolution: Macrophage clearance (days)\n\n**Key Mediators:**\n- Histamine (mast cells)\n- Prostaglandins (COX pathway)\n- Cytokines (IL-1, TNF-alpha)\n- Complement system`
  }

  if (lower.includes("nerve") || lower.includes("记忆口诀") || lower.includes("璁板繂")) {
    return `**Cranial Nerves 记忆口诀**\n\n**Names:**\nOn Old Olympus Towering Tops, A Finn And German Viewed Some Hops\n\nI. Olfactory (S)\nII. Optic (S)\nIII. Oculomotor (M)\nIV. Trochlear (M)\nV. Trigeminal (B)\nVI. Abducens (M)\nVII. Facial (B)\nVIII. Vestibulocochlear (S)\nIX. Glossopharyngeal (B)\nX. Vagus (B)\nXI. Spinal Accessory (M)\nXII. Hypoglossal (M)\n\n(S = Sensory, M = Motor, B = Both)`
  }

  if (lower.includes("quiz") || lower.includes("question") || lower.includes("练习题")) {
    return `**Practice Questions - Diabetes Mellitus**\n\n**Q1:** Which type of diabetes is characterized by autoimmune destruction of beta cells?\n- A) Type 1 DM\n- B) Type 2 DM\n- C) Gestational DM\n- D) MODY\n\n**Q2:** What is the first-line medication for Type 2 DM?\n- A) Insulin\n- B) Metformin\n- C) Sulfonylurea\n- D) SGLT2 inhibitor\n\n**Q3:** Which complication is associated with poorly controlled diabetes?\n- A) Diabetic ketoacidosis (Type 1)\n- B) Hyperosmolar state (Type 2)\n- C) Both\n- D) Neither\n\nTry answering these!`
  }

  return `That is a great question about "${query.slice(0, 50)}..." Let me break it down for you:\n\n**Key Points:**\n1. This topic is frequently tested in medical exams\n2. Understanding the underlying mechanism is crucial\n3. Clinical correlations help with long-term retention\n\n**Study Tip:** Create a comparison table to organize similar concepts. This helps with differential diagnosis questions.\n\nWould you like me to elaborate on any specific aspect?`
}



