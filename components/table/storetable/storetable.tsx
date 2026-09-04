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
}

export default function StoreTable() {
  const router = useRouter()
  const [data, setData] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    let cancelled = false

    fetch("/api/store")
      .then((res) => res.json())
      .then((json: StoresResponse) => {
        if (cancelled) return
        setData(json.stores)
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
          <AddStoreDrawer
            onAdd={(store) => {
              setData((prev) => [store, ...prev])
              router.refresh()
            }}
          />
        }
      />
    </div>
  )
}
