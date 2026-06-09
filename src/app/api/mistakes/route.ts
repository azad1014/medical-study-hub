import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const userId = "demo-user"

    const mistakes = await prisma.mistake.findMany({
      where: { userId },
      include: {
        question: {
          select: {
            id: true,
            stem: true,
            subjectId: true,
            explanation: true,
            tags: true,
          },
        },
      },
      orderBy: { totalWrong: "desc" },
    })

    return NextResponse.json(mistakes)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE() {
  try {
    const userId = "demo-user"
    await prisma.mistake.deleteMany({
      where: { userId },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to clear mistakes" }, { status: 500 })
  }
}


