import { redirect } from "next/navigation"

import { getSession, ROLE_HOME_PATH } from "@/lib/auth"

export default async function Home() {
  const session = await getSession()
  redirect(session ? ROLE_HOME_PATH[session.role] : "/login")
}
