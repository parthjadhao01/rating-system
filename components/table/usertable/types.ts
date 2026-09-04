// Values match the Prisma `Role` enum exactly (prisma/schema.prisma) — the
// API returns enum values as these string names, not numeric indexes.
export enum Role {
    ADMIN = "ADMIN",
    NORMAL_USER = "NORMAL_USER",
    STORE_OWNER = "STORE_OWNER",
}

export type User = {
    id : string,
    name : string,
    email : string,
    address : string
    role : Role
    // Average rating of the store this user owns. Only meaningful when role is STORE_OWNER.
    rating? : number
}
