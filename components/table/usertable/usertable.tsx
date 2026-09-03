

const data : User[] = [
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
        role : Role.STORE_OWNER
    }
]

import { columns } from "./column"
import { User, Role } from "./types"
import { DataTable } from "./data-table"


export default async function DemoPage() {

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}