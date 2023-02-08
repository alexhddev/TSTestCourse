import { Account, SessionToken } from "../Model/AuthModel";
import { DataBase } from "./DataBase";
import { generateRandomId } from "./IdGenerator";


export class SessionTokenDataAccess {

    private sessionTokensDataBase = new DataBase<SessionToken>();

    public generateToken(user: Account) {
        const tokenId = generateRandomId();
        this.sessionTokensDataBase.insert({
            id: tokenId,
            userName: user.userName,
            valid: true,
            expirationDate: this.generateExpirationTime()
        });
    }

    public async isValidToken(tokenId: string) {
        const sessionToken = await this.sessionTokensDataBase.getBy(
            'id',
            tokenId
        )
        if (sessionToken) {
            return sessionToken.valid
        }
        return false;
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 60 * 60 * 1000);
    }
}