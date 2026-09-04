"use client"

import { useEffect, useState } from "react"

import Section from "./section"
import { StoreReviewsTable } from "@/components/table/storereviews/store-reviews-table"
import type { Review } from "@/components/table/storereviews/types"

interface DashboardResponse {
  store: {
    id: string
    name: string
    address: string
    averageRating: number
    totalRatings: number
  }
  raters: Review[]
}

interface StoreOwnerDashboardProps {
  userId: string
}

export function StoreOwnerDashboard({ userId }: StoreOwnerDashboardProps) {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetch(`/api/store-owner/dashboard?userId=${userId}`)
      .then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? "Failed to load dashboard")
        return json as DashboardResponse
      })
      .then((json) => {
        if (cancelled) return
        setData(json)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Something went wrong")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  if (error) {
    return <p className="text-muted-foreground">{error}</p>
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <Section
        averageRating={data?.store.averageRating ?? 0}
        totalRatings={data?.store.totalRatings ?? 0}
      />
      <StoreReviewsTable data={data?.raters ?? []} isLoading={isLoading} />
    </div>
  )
}
