import { redirect } from 'next/navigation'

import { SiteHeader } from './site-header'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { StoreOwnerDashboard } from './dashboard'

async function StoreOwner() {
    
    const session = await getSession()
    if (!session || session.role !== "STORE_OWNER") {
        redirect("/login")
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { name: true },
    })

    // Cookie is validly signed but the account it points at is gone.
    if (!currentUser) {
        redirect("/login")
    }

    return (
        <div>
            <SiteHeader />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <h1 className="text-2xl font-bold">
                    Welcome, {currentUser.name}.
                </h1>
                <StoreOwnerDashboard />
            </div>
        </div>
    )
}

export default StoreOwner
