import { UserCredentialsDbAccess } from "../app/Authorization/UserCredentialsDbAccess";
import { UserCredentials } from "../app/Models/ServerModels";



describe('UserCredentialsDbAccess itest suite', () => {
    let userCredentialsDBAccess: UserCredentialsDbAccess;
    let someUserCredentials: UserCredentials;
    const randomString = Math.random().toString(36).substring(7);

    beforeAll(() => {
        userCredentialsDBAccess = new UserCredentialsDbAccess();
        someUserCredentials = {
            accessRights: [1, 2, 3],
            username: 'someUser',
            password: randomString
        }
    });

    it('should store and retrieve UserCredentials', async () => {
        await userCredentialsDBAccess.putUserCredential(someUserCredentials);
        const resultCredentials = await userCredentialsDBAccess.getUserCredential(
            someUserCredentials.username,
            someUserCredentials.password
        );
        expect(resultCredentials).toMatchObject(someUserCredentials);
    });
    it('should delete UserCredentials', async () => {
        await userCredentialsDBAccess.deleteUserCredential(someUserCredentials
        )
        const resultCredentials = await userCredentialsDBAccess.getUserCredential(
            someUserCredentials.username,
            someUserCredentials.password
        );
        expect(resultCredentials).toBeNull();
    });
    test('delete missing UserCredentials throws error', async () => {
        try {
            const resultCredentials = await userCredentialsDBAccess.getUserCredential(
                someUserCredentials.username,
                someUserCredentials.password
            );
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect(error).toHaveProperty('message', 'UserCredentials not deleted!');
        }
    });
});
