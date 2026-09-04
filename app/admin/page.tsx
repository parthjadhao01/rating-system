
import Tablesection from './tablesection'
import Section from './section'
import { SiteHeader } from './site-header'
import { prisma } from '@/lib/prisma'

export default async function Admin() {
    const [totalUser, totalStore, totalReview] = await Promise.all([
        prisma.user.count(),
        prisma.store.count(),
        prisma.rating.count(),
    ])

    return (
        <div>
            <SiteHeader />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <Section
                    totalUser={totalUser}
                    totalStore={totalStore}
                    totalReview={totalReview}
                />
                <Tablesection />
            </div>
        </div>
    )
}
