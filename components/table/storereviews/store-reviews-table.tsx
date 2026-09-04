"use client"

import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"

import { columns } from "./column"
import { Review } from "./types"
import { DataTable } from "./data-table"

interface StoreReviewsTableProps {
  data: Review[]
  isLoading?: boolean
}

export function StoreReviewsTable({ data, isLoading }: StoreReviewsTableProps) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

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
