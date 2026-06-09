import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateSRS, ratingToQuality } from "@/lib/srs"

export async function GET() {
  try {
    const cards = await prisma.flashcard.findMany({
      where: { nextReviewDate: { lte: new Date() } },
      orderBy: { nextReviewDate: "asc" },
      take: 20,
    })
    return NextResponse.json(cards)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cardId, rating, userId } = body

    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
    })

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    const quality = ratingToQuality(rating)
    const result = calculateSRS({
      quality,
      repetitions: card.repetitions,
      easeFactor: card.easeFactor,
      interval: card.interval,
    })

    // Update card with new SRS values
    const updatedCard = await prisma.flashcard.update({
      where: { id: cardId },
      data: {
        easeFactor: result.easeFactor,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReviewDate: result.nextReviewDate,
        lastReviewDate: new Date(),
      },
    })

    // Record review history
    await prisma.reviewHistory.create({
      data: {
        cardId,
        userId,
        rating,
        interval: result.interval,
        easeFactor: result.easeFactor,
      },
    })

    return NextResponse.json(updatedCard)
  } catch {
    return NextResponse.json({ error: "Failed to process review" }, { status: 500 })
  }
}
