import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subjectId = searchParams.get("subjectId")
  const difficulty = searchParams.get("difficulty")

  try {
    const where: Record<string, unknown> = {}
    if (subjectId) where.subjectId = subjectId
    if (difficulty) where.difficulty = parseInt(difficulty)

    const questions = await prisma.question.findMany({
      where,
      take: 20,
    })
    return NextResponse.json(questions)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { questionId, answer, userId, timeSpent } = body

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    const sortedAnswer = [...answer].sort()
    const sortedCorrect = [...question.correctAnswer].sort()
    const isCorrect =
      sortedAnswer.length === sortedCorrect.length &&
      sortedAnswer.every((v: string, i: number) => v === sortedCorrect[i])

    // Record attempt
    await prisma.questionAttempt.create({
      data: {
        questionId,
        userId,
        answer,
        isCorrect,
        timeSpent,
      },
    })

    // If wrong, record mistake
    if (!isCorrect) {
      await prisma.mistake.upsert({
        where: {
          questionId_userId: { questionId, userId },
        },
        update: {
          count: { increment: 1 },
          lastMistakeAt: new Date(),
        },
        create: {
          questionId,
          userId,
          count: 1,
          lastMistakeAt: new Date(),
        },
      })
    }

    return NextResponse.json({ correct: isCorrect, explanation: question.explanation })
  } catch {
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 })
  }
}
