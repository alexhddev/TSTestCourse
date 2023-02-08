import { Account } from "../Model/AuthModel";
import { DataBase } from "./DataBase";

export class UserCredentialsDataAccess {

    private userCredentialsDataBase = new DataBase<Account>();

    public async addUser(user: Account) {
       return this.userCredentialsDataBase.insert(user);
    }

    public async getUserById(id: string){
      const user = await this.userCredentialsDataBase.getBy('id', id);
      return user;
    }
}
