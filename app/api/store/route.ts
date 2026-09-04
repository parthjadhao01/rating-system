import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createStoreSchema } from "@/lib/validations/store"

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const pageIndex = Math.max(0, Number(searchParams.get("pageIndex")) || 0)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE)
  )

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        ratings: { select: { rating: true } },
      },
    }),
    prisma.store.count(),
  ])

  const storesWithRating = stores.map(({ ratings, ...store }) => ({
    ...store,
    rating: ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0,
  }))

  return NextResponse.json({
    stores: storesWithRating,
    pageIndex,
    pageSize,
    total,
    pageCount: Math.ceil(total / pageSize),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createStoreSchema.parse(body)

    const newStore = await prisma.store.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        address: validatedData.address,
        owners: { connect: { id: validatedData.owner } },
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
      },
    })

    return NextResponse.json({ ...newStore, rating: 0 }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid store data" }, { status: 400 })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        )
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Owner not found" },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
