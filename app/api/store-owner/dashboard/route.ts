import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const owner = await prisma.user.findUnique({
    where: { id: userId },
    select: { storeId: true },
  })

  if (!owner?.storeId) {
    return NextResponse.json(
      { error: "No store is assigned to this user" },
      { status: 404 }
    )
  }

  const store = await prisma.store.findUnique({
    where: { id: owner.storeId },
    select: {
      id: true,
      name: true,
      address: true,
      ratings: {
        orderBy: { createdAt: "desc" },
        select: {
          rating: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  })

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 })
  }

  const { ratings, ...storeInfo } = store
  const totalRatings = ratings.length
  const averageRating = totalRatings
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
    : 0

  return NextResponse.json({
    store: { ...storeInfo, averageRating, totalRatings },
    raters: ratings.map((r) => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      rating: r.rating,
      ratedAt: r.createdAt,
    })),
  })
}
