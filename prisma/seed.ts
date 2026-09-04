import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

// The first admin cannot be created through the app: signup always makes a
// NORMAL_USER, and POST /api/user requires an admin session.
const PASSWORD = "Password@123"

const ADMIN = {
    name: "System Administrator Account",
    email: "admin@ratings.test",
    address: "1 Platform Way, Pune 411045",
}

const STORES = [
    {
        name: "Vijay Electronics & Sales",
        email: "contact@vijaysales.test",
        address: "12 MG Road, Baner, Pune 411045",
        owner: {
            name: "Vijay Ramesh Deshmukh",
            email: "vijay.owner@ratings.test",
            address: "12 MG Road, Baner, Pune 411045",
        },
    },
    {
        name: "DC Medical & General Store",
        email: "contact@dcmedical.test",
        address: "44 Linking Road, Bandra, Mumbai 400050",
        owner: {
            name: "Deepa Chandran Menon",
            email: "deepa.owner@ratings.test",
            address: "44 Linking Road, Bandra, Mumbai 400050",
        },
    },
    {
        name: "Balewadi Fresh Groceries",
        email: "contact@balewadifresh.test",
        address: "7 Stadium Road, Balewadi, Pune 411045",
        owner: {
            name: "Balwant Sopan Balewadkar",
            email: "balwant.owner@ratings.test",
            address: "7 Stadium Road, Balewadi, Pune 411045",
        },
    },
]

// Has no store yet, so the owner picker in the Add Store drawer is never empty.
const UNASSIGNED_OWNER = {
    name: "Kavita Prashant Nimbalkar",
    email: "kavita.owner@ratings.test",
    address: "3 Kothrud Depot Road, Pune 411038",
}

const NORMAL_USERS = [
    {
        name: "Parth Ravindra Jadhao",
        email: "parth@ratings.test",
        address: "22 FC Road, Shivajinagar, Pune 411005",
    },
    {
        name: "Ananya Krishnan Iyer",
        email: "ananya@ratings.test",
        address: "9 Koregaon Park Lane 5, Pune 411001",
    },
    {
        name: "Rohan Siddharth Kulkarni",
        email: "rohan@ratings.test",
        address: "310 Aundh Road, Pune 411007",
    },
    {
        name: "Fatima Abdul Qureshi",
        email: "fatima@ratings.test",
        address: "88 Camp Area, Pune 411001",
    },
    {
        name: "Nikhil Prakash Chaudhari",
        email: "nikhil@ratings.test",
        address: "5 Hinjewadi Phase 2, Pune 411057",
    },
]

// Rows are the normal users above, columns are the stores. null means the user
// has not rated that store, which keeps the "not rated yet" states visible.
const RATINGS: (number | null)[][] = [
    [5, 4, 4],
    [4, 5, 3],
    [3, 5, null],
    [5, 3, 4],
    [null, 4, 2],
]

async function main() {
    const password = await bcrypt.hash(PASSWORD, 10)

    // Deleted in FK order so the seed can be re-run safely.
    await prisma.rating.deleteMany()
    await prisma.user.deleteMany()
    await prisma.store.deleteMany()

    await prisma.user.create({
        data: { ...ADMIN, password, role: "ADMIN" },
    })

    const storeIds: string[] = []
    for (const { owner, ...store } of STORES) {
        const created = await prisma.store.create({ data: store })
        await prisma.user.create({
            data: { ...owner, password, role: "STORE_OWNER", storeId: created.id },
        })
        storeIds.push(created.id)
    }

    await prisma.user.create({
        data: { ...UNASSIGNED_OWNER, password, role: "STORE_OWNER" },
    })

    const userIds: string[] = []
    for (const user of NORMAL_USERS) {
        const created = await prisma.user.create({
            data: { ...user, password, role: "NORMAL_USER" },
        })
        userIds.push(created.id)
    }

    const ratings = []
    for (let i = 0; i < RATINGS.length; i++) {
        for (let j = 0; j < RATINGS[i].length; j++) {
            const rating = RATINGS[i][j]
            if (rating !== null) {
                ratings.push({ rating, userId: userIds[i], storeId: storeIds[j] })
            }
        }
    }
    await prisma.rating.createMany({ data: ratings })

    console.log(`Seeded ${userIds.length + storeIds.length + 2} users, ${storeIds.length} stores, ${ratings.length} ratings.`)
    console.log(`\nAll accounts use the password: ${PASSWORD}\n`)
    console.log(`  Admin        ${ADMIN.email}`)
    console.log(`  Store owner  ${STORES[0].owner.email}`)
    console.log(`  Normal user  ${NORMAL_USERS[0].email}`)
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })
