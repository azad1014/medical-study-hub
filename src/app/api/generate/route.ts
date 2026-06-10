import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { text, fileName, supplement } = await req.json()

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
      baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com/v1",
    })

    if (!text || text.trim().length < 10) {
      return NextResponse.json({
        error: "提取到的文字内容太少，或处理超时。请尝试上传较短的章节而非整本书。",
      })
    }

    // Truncate very long texts
    const truncated = text.slice(0, 8000)

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是一位医学导师，帮学生从学习资料中提炼重点并生成笔记。

${supplement ? "你拥有丰富的医学知识储备，除了从资料中提取内容外，还要主动补充你了解的相关的医学知识、临床要点和最新进展。" : ""}

请按以下格式输出：

学习笔记：
[完整的学习笔记，包含核心概念、机制、临床要点。不要使用 # * - 等符号，使用纯文本格式。]

==复习闪卡==
格式：每行一张卡片，用 | 分隔正面和背面
例如：急性炎症的主要细胞是什么？| 中性粒细胞
每张闪卡必须是独立的问答对，至少生成5-10张

==自测题==
格式：每题之间用 || 分隔
题目：题目内容
A. 选项1 B. 选项2 C. 选项3 D. 选项4
答案：正确答案字母
解析：简要解析

要求：
- 笔记不要包含 # * - 等符号
- 闪卡覆盖核心知识点，至少5张
- 题目要有临床思维，至少3道
- 全中文输出`,
        },
        {
          role: "user",
          content: `请根据以下资料生成学习笔记、复习闪卡和自测题。\n\n文件名：${fileName}\n\n资料内容：\n${truncated}`,
        },
      ],
      temperature: 0.6,
    })

    const response = completion.choices[0]?.message?.content || ""

    // Parse structured output
    const notesMatch = response.match(/## 学习笔记\n([\s\S]*?)(?=---|## 复习闪卡|$)/)
    const cardsMatch = response.match(/## 复习闪卡\n([\s\S]*?)(?=---|## 自测题|$)/)
    const quizMatch = response.match(/## 自测题\n([\s\S]*?)$/)

    return NextResponse.json({
      full: response,
      notes: notesMatch?.[1]?.trim() || "",
      cards: cardsMatch?.[1]?.trim() || "",
      quiz: quizMatch?.[1]?.trim() || "",
    })
  } catch (error) {
    console.error("Generate API Error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({
      error: "生成失败：" + message,
    })
  }
}

