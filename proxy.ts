import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionToken, SESSION_COOKIE_NAME, ROLE_HOME_PATH } from "@/lib/auth"
import type { Role } from "@prisma/client"

const PROTECTED_PREFIXES: Record<string, Role> = {
  "/admin": "ADMIN",
  "/user": "NORMAL_USER",
  "/store-owner": "STORE_OWNER",
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null

  const matchedPrefix = Object.keys(PROTECTED_PREFIXES).find((prefix) =>
    pathname.startsWith(prefix)
  )

  if (matchedPrefix) {
    if (!session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (session.role !== PROTECTED_PREFIXES[matchedPrefix]) {
      return NextResponse.redirect(new URL(ROLE_HOME_PATH[session.role], request.url))
    }

    return NextResponse.next()
  }

  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(new URL(ROLE_HOME_PATH[session.role], request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/store-owner/:path*", "/login", "/signup"],
}
