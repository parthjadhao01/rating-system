import { StoreIcon, UsersIcon } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserTable from "@/components/table/usertable/usertable"
import StoreTable from "@/components/table/storetable/storetable"

const DEFAULT_TAB = "user-table"

function Tablesection() {
    return (
        <Tabs defaultValue={DEFAULT_TAB} className="w-full">
            <TabsList>
                <TabsTrigger value="user-table">
                    <UsersIcon />
                    Users
                </TabsTrigger>
                <TabsTrigger value="store-table">
                    <StoreIcon />
                    Stores
                </TabsTrigger>
            </TabsList>
            <TabsContent value="user-table">
                <UserTable />
            </TabsContent>
            <TabsContent value="store-table">
                <StoreTable />
            </TabsContent>
        </Tabs>
    )
}

export default Tablesection
