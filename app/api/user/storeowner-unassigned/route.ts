import {prisma} from "@/lib/prisma"

export async function GET(){
    try {
        const unassignedStoreOwner = await prisma.user.findMany({
            where : {
                role : "STORE_OWNER",
                store : null
            },
            select : {
                id : true,
                name : true,
            }
        })

        return Response.json({ unassignedStoreOwner }, { status: 200 })
    } catch (error) {
        return Response.json({ error: "Something went wrong" }, { status: 500 })
    }
}