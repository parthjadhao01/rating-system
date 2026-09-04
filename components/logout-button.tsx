"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      router.push("/login")
      router.refresh()
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
      <LogOutIcon />
      Logout
    </Button>
  )
}
