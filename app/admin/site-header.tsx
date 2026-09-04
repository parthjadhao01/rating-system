import { LogoutButton } from "@/components/logout-button"

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:px-6">
      <h1 className="text-base font-medium">Admin Dashboard</h1>
      <LogoutButton />
    </header>
  )
}
