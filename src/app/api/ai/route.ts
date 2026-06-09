import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical education tutor helping medical students prepare for exams. Provide clear, structured explanations. Use markdown formatting. Focus on high-yield concepts and clinical correlations.",
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
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
