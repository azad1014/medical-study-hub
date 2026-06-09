import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        topics: {
          include: {
            subtopics: true,
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(subjects)
  } catch {
    return NextResponse.json([])
  }
}
