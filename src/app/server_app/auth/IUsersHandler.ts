

export interface IUsersHandler {
    
    registerUser(userName: string, password: string): Promise<string>;
    login(userName: string, password: string): Promise<string | undefined>;
}