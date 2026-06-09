import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // In production, get user from session
    const userId = "demo-user"

    const [
      dueCards,
      questionsCount,
      mistakes,
      recentSessions,
    ] = await Promise.all([
      // Count due flashcards
      prisma.flashcard.count({
        where: {
          userId,
          nextReviewDate: { lte: new Date() },
        },
      }),
      // Count available questions
      prisma.question.count(),
      // Count mistakes
      prisma.mistake.count({
        where: { userId },
      }),
      // Get recent study sessions
      prisma.studySession.findMany({
        where: { userId },
        orderBy: { startedAt: "desc" },
        take: 5,
      }),
    ])

    return NextResponse.json({
      dueCards,
      dueQuestions: questionsCount,
      mistakeCount: mistakes,
      streakDays: 7,
      recentSessions,
      heatmapData: [],
    })
  } catch {
    // Return mock data if database is not connected
    return NextResponse.json({
      dueCards: 24,
      dueQuestions: 12,
      mistakeCount: 8,
      streakDays: 7,
      recentSessions: [],
      heatmapData: [],
    })
  }
}
