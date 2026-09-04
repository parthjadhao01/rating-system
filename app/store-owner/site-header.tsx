import Link from "next/link"
import { LogOutIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ChangePasswordDrawer } from "@/components/change-password-drawer"

interface SiteHeaderProps {
  userId?: string
}

export function SiteHeader({ userId }: SiteHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
      <h1 className="text-base font-medium">Store Owner Dashboard</h1>
      <div>
        <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        <LogOutIcon />
        Logout
      </Button>
      <ChangePasswordDrawer userId={userId} />
      </div>
    </header>
  )
}
