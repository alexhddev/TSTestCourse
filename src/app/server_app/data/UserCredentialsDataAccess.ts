import { Account } from "../model/AuthModel";
import { DataBase } from "./DataBase";

export class UserCredentialsDataAccess {

    private userCredentialsDataBase = new DataBase<Account>();

    public async addUser(user: Account) {
      const accountId = await this.userCredentialsDataBase.insert(user);
       return accountId;
    }

    public async getUserById(id: string){
      const user = await this.userCredentialsDataBase.getBy('id', id);
      return user;
    }

    public async getUserByUserName(userName: string){
      const user = await this.userCredentialsDataBase.getBy('userName', userName);
      return user;
    }
}
