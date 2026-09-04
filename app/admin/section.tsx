import React from 'react'
import { StarIcon, StoreIcon, UsersIcon } from 'lucide-react'
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function Section({
    totalUser,
    totalStore,
    totalReview,
    averageRating,
}: {
    totalUser: number
    totalStore: number
    totalReview: number
    averageRating: number
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Users</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalUser}
                    </CardTitle>
                    <CardAction>
                        <UsersIcon className="size-4 text-muted-foreground" />
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Active users on the platform
                    </div>
                    <div className="text-muted-foreground">
                        Includes admins, owners &amp; normal users
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Stores</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalStore}
                    </CardTitle>
                    <CardAction>
                        <StoreIcon className="size-4 text-muted-foreground" />
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Registered stores on the platform
                    </div>
                    <div className="text-muted-foreground">
                        Open to ratings from users
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Reviews</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalReview}
                    </CardTitle>
                    <CardAction>
                        <StarIcon className="size-4 text-muted-foreground" />
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Ratings submitted so far
                    </div>
                    <div className="text-muted-foreground">
                        Across all stores
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Section
