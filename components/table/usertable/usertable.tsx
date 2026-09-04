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
  total: number
}

export default function UserTable() {
  const router = useRouter()
  const [data, setData] = useState<User[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)

    const params = new URLSearchParams({
      pageIndex: `${pagination.pageIndex}`,
      pageSize: `${pagination.pageSize}`,
    })

    fetch(`/api/user?${params.toString()}`)
      .then((res) => res.json())
      .then((json: UsersResponse) => {
        if (cancelled) return
        setData(json.users)
        setRowCount(json.total)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [pagination.pageIndex, pagination.pageSize])

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        onPaginationChange={setPagination}
        rowCount={rowCount}
        isLoading={isLoading}
        onReorder={setData}
        toolbarActions={
          <AddUserDrawer
            onAdd={(user) => {
              setData((prev) => [user, ...prev])
              setRowCount((prev) => prev + 1)
              // Refreshes the server-rendered "Total Users" count on the dashboard.
              router.refresh()
            }}
          />
        }
      />
    </div>
  )
}
