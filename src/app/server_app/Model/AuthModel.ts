export type Account = {
    id: string,
    userName: string,
    password: string,
}

export type SessionToken = {
    id: string,
    userName: string,
    valid: boolean,
    expirationDate: Date
}