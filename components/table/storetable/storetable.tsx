"use client"

import { useState } from "react"

import { columns } from "./column"
import { Store } from "./types"
import { DataTable } from "./data-table"
import { AddStoreDrawer } from "./add-store-drawer"

const initialData: Store[] = [
    {
        id : "88432",
        name : "Moti Nagar Grocers",
        email : "motinagargrocers@gmail.com",
        address : "moti nagar",
        rating : 4
    },
    {
        id : "88412",
        name : "Bharti Electronics",
        email : "bhartielectronics@gmail.com",
        address : "moti nagar",
        rating : 5
    },{
        id : "88430",
        name : "Siya Bakery",
        email : "siyabakery@gmail.com",
        address : "moti nagar",
        rating : 3
    }
]

export default function StoreTable() {
  const [data, setData] = useState<Store[]>(initialData)

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={data}
        onReorder={setData}
        toolbarActions={
          <AddStoreDrawer
            onAdd={(store) => setData((prev) => [store, ...prev])}
          />
        }
      />
    </div>
  )
}
