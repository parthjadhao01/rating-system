export enum Role {
    "ADMIN","NORMAL_USER" ,"STORE_OWNER"
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
