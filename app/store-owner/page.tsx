import { SiteHeader } from './site-header'
import { prisma } from '@/lib/prisma'
import { StoreOwnerDashboard } from './dashboard'

// TODO: replace with the logged-in user's id from the session once
// login/auth is implemented. Until then this looks up any existing store
// owner (preferring one who already has a store assigned) so the dashboard
// can be built and tested end to end.
async function StoreOwner() {
    const currentUser = await prisma.user.findFirst({
        where: { role: "STORE_OWNER", storeId: { not: null } },
        select: { id: true, name: true },
    })

    return (
        <div>
            <SiteHeader userId={currentUser?.id} />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <h1 className="text-2xl font-bold">
                    Welcome{currentUser ? `, ${currentUser.name}` : ""}.
                </h1>
                {currentUser ? (
                    <StoreOwnerDashboard userId={currentUser.id} />
                ) : (
                    <p className="text-muted-foreground">
                        No store owner with an assigned store found.
                    </p>
                )}
            </div>
        </div>
    )
}

export default StoreOwner
