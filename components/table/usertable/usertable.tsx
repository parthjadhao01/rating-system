"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PaginationState } from "@tanstack/react-table"

import { columns } from "./column"
import { User } from "./types"
import { DataTable } from "./data-table"
import { AddUserDrawer } from "./add-user-drawer"

interface UsersResponse {
  users: User[]
}

export default function UserTable() {
  const router = useRouter()
  const [data, setData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)

    fetch("/api/user")
      .then((res) => res.json())
      .then((json: UsersResponse) => {
        if (cancelled) return
        setData(json.users)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading}
        onReorder={setData}
        toolbarActions={
          <AddUserDrawer
            onAdd={(user) => {
              setData((prev) => [user, ...prev])

              router.refresh()
            }}
          />
        }
      />
    </div>
  )
}
