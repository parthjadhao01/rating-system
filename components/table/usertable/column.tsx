"use client"

import Link from "next/link"
import { createColumnHelper } from "@tanstack/react-table"
import { DataTableFeatures } from "./data-table-features"
import { Role, User } from "./types"
import { Checkbox } from "@/components/ui/checkbox"

const columnHelper = createColumnHelper<DataTableFeatures,User>()

export const columns = columnHelper.columns([
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
        cell : (props) => (
            <Link href={`/user/${props.row.original.id}`} className="hover:underline">
                {props.getValue()}
            </Link>
        )
    }),
    columnHelper.accessor("email",{
        header : "email"
    }),
    columnHelper.accessor("address",{
        header : "address"
    }),
    columnHelper.accessor("role",{
        header : "role",
        cell : (props) => Role[props.getValue()]
    })
])
