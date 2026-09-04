import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSession, UnauthenticatedError, ForbiddenError } from "@/lib/auth"

export async function GET(){
    try {
        await requireSession(["ADMIN"])

        const unassignedStoreOwner = await prisma.user.findMany({
            where : {
                role : "STORE_OWNER",
                store : null
            },
            select : {
                id : true,
                name : true,
            }
        })

        return NextResponse.json({ unassignedStoreOwner }, { status: 200 })
    } catch (error) {
        if (error instanceof UnauthenticatedError) {
          return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        if (error instanceof ForbiddenError) {
          return NextResponse.json({ error: "Not authorized" }, { status: 403 })
        }

        return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
    }
}
