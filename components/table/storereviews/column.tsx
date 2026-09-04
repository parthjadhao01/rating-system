"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { StarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataTableFeatures } from "./data-table-features"
import { Review } from "./types"

const columnHelper = createColumnHelper<DataTableFeatures, Review>()

export const columns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Name",
    }),
    columnHelper.accessor("email", {
        header: "Email",
    }),
    columnHelper.accessor("rating", {
        header: "Rating",
        cell: (props) => (
            <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5">
                <StarIcon className="size-3 fill-current" />
                {props.getValue()}
            </Badge>
        ),
    }),
    columnHelper.accessor("ratedAt", {
        header: "Rated On",
        cell: (props) => new Date(props.getValue()).toLocaleDateString(),
    }),
])
