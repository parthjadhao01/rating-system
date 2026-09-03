export enum Role {
    "ADMIN","NORMAL_USER" ,"STORE_OWNER"
}

export type User = {
    id : string,
    name : string,
    email : string,
    address : string
    role : Role
}
