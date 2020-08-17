

export interface OperationState {
    authorized: boolean,
    tokenState: TokenState
}

export interface SessionToken {
    tokenId: string,
    userName: string,
    valid: boolean,
    expirationTime: Date,
    accessRights: AccessRight[]
}

export interface TokenRights {
    accessRights: AccessRight[],
    state: TokenState
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}

export enum AccessRight {
    CREATE,
    READ,
    UPDATE,
    DELETE
}

export interface UserCredentials extends Account {
    accessRights: AccessRight[]
}

export interface Account {
    username: string,
    password: string
}

export interface TokenGenerator {
    generateToken(account: Account): Promise<SessionToken | null>
}

export interface TokenValidator {
    validateToken(tokenId: string): Promise<TokenRights>
}

export enum HTTP_CODES {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_fOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export enum HTTP_METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTIONS = 'OPTIONS'
}
