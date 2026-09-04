
import React from 'react'
import Tablesection from './tablesection'
import Section from './section'
import { SiteHeader } from './site-header'

export default function Admin() {
    return (
        <div>
            <SiteHeader />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <Section
                    totalUser={100}
                    totalStore={50}
                    totalReview={200}
                    averageRating={4.2}
                />
                <Tablesection />
            </div>
        </div>
    )
}
