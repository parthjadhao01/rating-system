import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireSession, UnauthenticatedError, ForbiddenError } from "@/lib/auth"
import { submitRatingSchema } from "@/lib/validations/rating"


export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireSession(["NORMAL_USER"])

    const body = await request.json()
    const { storeId, rating } = submitRatingSchema.parse(body)

    const savedRating = await prisma.rating.upsert({
      where: { userId_storeId: { userId, storeId } },
      update: { rating },
      create: { userId, storeId, rating },
    })

    const { _avg, _count } = await prisma.rating.aggregate({
      where: { storeId },
      _avg: { rating: true },
      _count: true,
    })

    return NextResponse.json({
      rating: savedRating.rating,
      storeRating: _count ? (_avg.rating ?? 0) : 0,
    })
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid rating" },
        { status: 400 }
      )
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return NextResponse.json(
        { error: "User or store not found" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
