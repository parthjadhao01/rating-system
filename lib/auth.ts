import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { Role } from "@prisma/client"

export const SESSION_COOKIE_NAME = "session"
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7 

export const ROLE_HOME_PATH: Record<Role, string> = {
  ADMIN: "/admin",
  NORMAL_USER: "/user",
  STORE_OWNER: "/store-owner",
}

export interface SessionPayload {
  userId: string
  role: Role
}

function getSecretKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set")
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ userId: payload.userId, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey())
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null
    }
    return { userId: payload.userId, role: payload.role as Role }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export class UnauthenticatedError extends Error {}
export class ForbiddenError extends Error {}

export async function requireSession(allowedRoles?: Role[]): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw new UnauthenticatedError("Not authenticated")
  }
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new ForbiddenError("Not authorized")
  }
  return session
}
