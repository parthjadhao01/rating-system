import { StarIcon, UsersIcon } from 'lucide-react'
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

function Section({
    averageRating,
    totalRatings,
}: {
    averageRating: number
    totalRatings: number
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Average Rating</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalRatings ? averageRating.toFixed(1) : "—"}
                    </CardTitle>
                    <CardAction>
                        <StarIcon className="size-4 text-muted-foreground" />
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Your store&apos;s average rating
                    </div>
                    <div className="text-muted-foreground">
                        Out of 5 stars
                    </div>
                </CardFooter>
            </Card>
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Ratings</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {totalRatings}
                    </CardTitle>
                    <CardAction>
                        <UsersIcon className="size-4 text-muted-foreground" />
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Users who rated your store
                    </div>
                    <div className="text-muted-foreground">
                        Listed below
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Section
