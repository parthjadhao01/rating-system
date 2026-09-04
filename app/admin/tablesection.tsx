import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, User } from "lucide-react"
import React from 'react'
import UserTable from "../../components/table/usertable/usertable"
import StoreTable from "../../components/table/storetable/storetable"
import { cn } from "@/lib/utils"

function Tablesection() {
    return (
        <Tabs defaultValue="account" className="w-full border">
            <TabsList className={cn("m-2")}>
                <TabsTrigger value="user-table">
                    <User/>
                    User
                </TabsTrigger>
                <TabsTrigger value="store-table">
                    <Store/>
                    Store
                </TabsTrigger>
            </TabsList>
            <TabsContent className={cn("m-2")} value="user-table"><UserTable/></TabsContent>
            <TabsContent className={cn("m-2")} value="store-table"><StoreTable/></TabsContent>
        </Tabs>
    )
}

export default Tablesection