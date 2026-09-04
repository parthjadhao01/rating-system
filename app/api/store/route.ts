import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { createStoreSchema } from "@/lib/validations/store"

export async function GET() {
  const stores = await prisma.store.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: { select: { rating: true } },
    },
  })

  const storesWithRating = stores.map(({ ratings, ...store }) => ({
    ...store,
    rating: ratings.length
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0,
  }))

  return NextResponse.json({ stores: storesWithRating })
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
