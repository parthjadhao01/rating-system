import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {createUserSchema} from "@/lib/validations/user"

const PASSWORD_SALT_ROUNDS = 10

const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const pageIndex = Math.max(0, Number(searchParams.get("pageIndex")) || 0)
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE)
  )

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: pageIndex * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    }),
    prisma.user.count(),
  ])

  return NextResponse.json({
    users,
    pageIndex,
    pageSize,
    total,
    pageCount: Math.ceil(total / pageSize),
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      PASSWORD_SALT_ROUNDS
    )

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
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
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