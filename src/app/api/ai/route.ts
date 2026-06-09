import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

// Use OPENAI_BASE_URL env var, default to DeepSeek API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.deepseek.com/v1",
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        response: "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file.",
      })
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "你是一位资深的医学导师，帮助医学生理解医学知识。\n\n请遵循以下原则：\n- 用中文回答，表达自然、清晰、有深度\n- 可以使用 Markdown 格式（标题、列表、表格等）来组织内容\n- 可以展开讨论机制、病因、临床表现、诊断和治疗\n- 根据问题灵活调整回答风格，可详细可简洁\n- 遇到需要对比的概念，使用表格对比\n- 涉及机制时，分步骤解释\n- 可以举临床实例帮助理解\n- 像真正的老师在给学生答疑一样自然",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    return NextResponse.json({
      response: completion.choices[0]?.message?.content || "抱歉，无法生成回复。",
    })
  } catch (error) {
    console.error("AI API Error:", error)
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({
      response: "AI 暂时不可用，错误信息：" + message,
    })
  }
}
