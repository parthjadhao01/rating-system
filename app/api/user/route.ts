import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import {createUserSchema} from "@/lib/validations/user"


export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      // Only store owners have a store; ratings are averaged below so the
      // client can show a store owner's rating without a second request.
      store: { select: { ratings: { select: { rating: true } } } },
    },
  })

  const usersWithRating = users.map(({ store, ...user }) => ({
    ...user,
    rating: store?.ratings.length
      ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
      : undefined,
  }))

  return NextResponse.json({ users: usersWithRating })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    const hashedPassword = await hashPassword(validatedData.password)

    const newUser = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Surface the specific rule that failed (e.g. password length/uppercase
      // requirements) instead of a generic message, so the Add User drawer
      // can show the user what to fix.
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid user data" },
        { status: 400 }
      )
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}