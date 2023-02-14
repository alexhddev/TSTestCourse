

export interface ITokenValidator {

    validateToken(tokenId: string): Promise<boolean>

}