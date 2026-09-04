import Link from "next/link"
import { LogOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
      <h1 className="text-base font-medium">Admin Dashboard</h1>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        <LogOutIcon />
        Logout
      </Button>
    </header>
  )
}
