import { SiteHeader } from './site-header'
import { prisma } from '@/lib/prisma'
import StoreDirectory from '@/components/table/storedirectory/store-directory'

async function User() {
    const currentUser = {
        id : "clg0x1j3e0000v6l7f5q2k4z9",
        name : "parth jadhao"
    }

    return (
        <div>
            <SiteHeader userId={currentUser?.id} />
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                <h1 className="text-2xl font-bold">
                    Welcome{currentUser ? `, ${currentUser.name}` : ""}.
                </h1>
                {currentUser ? (
                    <StoreDirectory userId={currentUser.id} />
                ) : (
                    <p className="text-muted-foreground">
                        No normal user found. Sign up first.
                    </p>
                )}
            </div>
        </div>
    )
}

export default User
