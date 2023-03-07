




export default class LoginService {

    public async login(userName: string, password: string): Promise<string | undefined> {
        return new Promise((resolve) =>{
            if (userName === 'user' && password === 'pass') {
                resolve('1234')
            } else {
                resolve(undefined);
            }
        })

    }
}