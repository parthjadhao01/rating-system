"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PaginationState } from "@tanstack/react-table"

import { columns } from "./column"
import { Store } from "./types"
import { DataTable } from "./data-table"
import { AddStoreDrawer } from "./add-store-drawer"

interface StoresResponse {
  stores: Store[]
  total: number
}

export default function StoreTable() {
  const router = useRouter()
  const [data, setData] = useState<Store[]>([])
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

    fetch(`/api/store?${params.toString()}`)
      .then((res) => res.json())
      .then((json: StoresResponse) => {
        if (cancelled) return
        setData(json.stores)
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
          <AddStoreDrawer
            onAdd={(store) => {
              setData((prev) => [store, ...prev])
              setRowCount((prev) => prev + 1)
              // Refreshes the server-rendered "Total Stores" count on the dashboard.
              router.refresh()
            }}
          />
        }
      />
    </div>
  )
}
