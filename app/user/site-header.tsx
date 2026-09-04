import { LogoutButton } from "@/components/logout-button"
import { ChangePasswordDrawer } from "@/components/change-password-drawer"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
      <h1 className="text-base font-medium">User Dashboard</h1>
      <div>
        <LogoutButton />
        <ChangePasswordDrawer />
      </div>
    </header>
  )
}
