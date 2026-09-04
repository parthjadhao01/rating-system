"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataTableFeatures } from "./data-table-features"
import { DirectoryStore } from "./types"
import { RatingInput } from "./rating-input"

const columnHelper = createColumnHelper<DataTableFeatures, DirectoryStore>()

export function createColumns(onRate: (storeId: string, rating: number) => void) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: "Store Name",
    }),
    columnHelper.accessor("address", {
      header: "Address",
    }),
    columnHelper.accessor("rating", {
      header: "Overall Rating",
      cell: (props) => (
        <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5">
          <StarIcon className="size-3 fill-current" />
          {props.getValue().toFixed(1)}
        </Badge>
      ),
    }),
    columnHelper.accessor("userRating", {
      header: "Your Rating",
      cell: (props) => (
        <RatingInput
          value={props.getValue()}
          onChange={(rating) => onRate(props.row.original.id, rating)}
        />
      ),
    }),
  ])
}
