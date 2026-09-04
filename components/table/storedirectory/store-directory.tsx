"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { createColumns } from "./column"
import { DirectoryStore } from "./types"
import { DataTable } from "./data-table"

interface StoreDirectoryProps {
  userId: string
}

interface StoresResponse {
  stores: DirectoryStore[]
}

export default function StoreDirectory({ userId }: StoreDirectoryProps) {
  const [data, setData] = useState<DirectoryStore[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)

    fetch(`/api/store?userId=${userId}`)
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
  }, [userId])

  const handleRate = useCallback(
    async (storeId: string, rating: number) => {
      setData((prev) =>
        prev.map((store) =>
          store.id === storeId ? { ...store, userRating: rating } : store
        )
      )

      try {
        const response = await fetch("/api/rating", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, storeId, rating }),
        })

        const json = await response.json()
        if (!response.ok) throw new Error(json.error ?? "Failed to submit rating")

        setData((prev) =>
          prev.map((store) =>
            store.id === storeId
              ? { ...store, rating: json.storeRating, userRating: json.rating }
              : store
          )
        )
      } catch {
        fetch(`/api/store?userId=${userId}`)
          .then((res) => res.json())
          .then((json: StoresResponse) => setData(json.stores))
      }
    },
    [userId]
  )

  const columns = useMemo(() => createColumns(handleRate), [handleRate])

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={pagination}
      onPaginationChange={setPagination}
      isLoading={isLoading}
    />
  )
}
