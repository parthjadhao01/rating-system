import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { createSessionToken, setSessionCookie, ROLE_HOME_PATH } from "@/lib/auth"
import { createUserSchema } from "@/lib/validations/user"

const signupSchema = createUserSchema.omit({ role: true })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = signupSchema.parse(body)

    const hashedPassword = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword, role: "NORMAL_USER" },
      select: { id: true, name: true, role: true },
    })

    const token = await createSessionToken({ userId: user.id, role: user.role })
    await setSessionCookie(token)

    return NextResponse.json(
      { user, redirectTo: ROLE_HOME_PATH[user.role] },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid signup data" },
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
