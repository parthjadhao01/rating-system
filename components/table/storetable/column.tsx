"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { GripVerticalIcon, StarIcon } from "lucide-react"
import { DataTableFeatures } from "./data-table-features"
import { Store } from "./types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

function DragHandle({ id }: { id: string }) {
    const { attributes, listeners } = useSortable({ id })
    return (
        <Button
            {...attributes}
            {...listeners}
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:bg-transparent"
        >
            <GripVerticalIcon className="size-4 text-muted-foreground" />
            <span className="sr-only">Drag to reorder</span>
        </Button>
    )
}

const columnHelper = createColumnHelper<DataTableFeatures,Store>()

export const columns = columnHelper.columns([
    columnHelper.display({
        id: "drag",
        header: () => null,
        cell: (props) => <DragHandle id={props.row.original.id} />,
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.display({
        id: "select",
        header: (props) => (
            <Checkbox
                checked={props.table.getIsAllPageRowsSelected()}
                indeterminate={
                    !props.table.getIsAllPageRowsSelected() &&
                    props.table.getIsSomePageRowsSelected()
                }
                onCheckedChange={(checked) =>
                    props.table.toggleAllPageRowsSelected(!!checked)
                }
                aria-label="Select all"
            />
        ),
        cell: (props) => (
            <Checkbox
                checked={props.row.getIsSelected()}
                onCheckedChange={(checked) => props.row.toggleSelected(!!checked)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("name",{
        header : "Name",
    }),
    columnHelper.accessor("email",{
        header : "email"
    }),
    columnHelper.accessor("address",{
        header : "address"
    }),
    columnHelper.accessor("rating",{
        header : "rating",
        cell : (props) => (
            <Badge variant="outline" className="text-muted-foreground gap-1 px-1.5">
                <StarIcon className="size-3 fill-current" />
                {props.getValue().toFixed(1)}
            </Badge>
        )
    })
])
