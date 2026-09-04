"use client"

import { useState } from "react"

import { columns } from "./column"
import { User, Role } from "./types"
import { DataTable } from "./data-table"
import { AddUserDrawer } from "./add-user-drawer"

const initialData: User[] = [
    {
        id : "23432",
        name : "parth jadhao",
        email : "parthjadhao4@gmail.com",
        address : "moti nagar",
        role : Role.ADMIN
    },
    {
        id : "23412",
        name : "bharti jadhao",
        email : "bhartijadhao4@gmail.com",
        address : "moti nagar",
        role : Role.NORMAL_USER
    },{
        id : "23430",
        name : "siya jadhao",
        email : "siyajadhao4@gmail.com",
        address : "moti nagar",
        role : Role.STORE_OWNER,
        rating : 4
    }
]

export default function UserTable() {
  const [data, setData] = useState<User[]>(initialData)

  return (
    <div className="">
      <DataTable
        columns={columns}
        data={data}
        onReorder={setData}
        toolbarActions={
          <AddUserDrawer
            onAdd={(user) => setData((prev) => [user, ...prev])}
          />
        }
      />
    </div>
  )
}
