import { Authorizer } from "../../app/Authorization/Authorizer";
import { SessionTokenDBAccess } from "../../app/Authorization/SessionTokenDBAccess";
import { UserCredentialsDbAccess } from "../../app/Authorization/UserCredentialsDbAccess";
import { Account, SessionToken, TokenState } from "../../app/Models/ServerModels";
jest.mock('../../app/Authorization/SessionTokenDBAccess');
jest.mock('../../app/Authorization/UserCredentialsDbAccess');


const someAccount: Account = {
    username: 'someUser',
    password: 'somePassword'
}

describe('Authorizer test suite', () => {
    let authorizer: Authorizer;

    let sessionTokenDBAccessMock = {
        storeSessionToken: jest.fn(),
        getToken: jest.fn()
    }

    let userCredentialsDBAccessMock = {
        getUserCredential: jest.fn()
    }

    beforeEach(() => {
        authorizer = new Authorizer(
            sessionTokenDBAccessMock as any,
            userCredentialsDBAccessMock as any
        );
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('constructor arguments', () => {
        new Authorizer();
        expect(SessionTokenDBAccess).toBeCalledTimes(1)
        expect(UserCredentialsDbAccess).toBeCalledTimes(1)
    })
    describe('login user tests suite', () => {
        test('should return null if invalid credentials', async () => {
            userCredentialsDBAccessMock.getUserCredential.mockReturnValue(null);
            const loginResult = await authorizer.generateToken(someAccount);
            expect(loginResult).toBeNull;
            expect(userCredentialsDBAccessMock.getUserCredential).
                toBeCalledWith(someAccount.username, someAccount.password);
        });

        test('should return session token for valid credentials', async () => {
            jest.spyOn(global.Math, 'random').mockReturnValueOnce(0);
            jest.spyOn(global.Date, 'now').mockReturnValueOnce(0);
            userCredentialsDBAccessMock.getUserCredential.mockReturnValue({
                accessRights: [1, 2, 3],
                username: 'someUser',
                password: 'somePassword'
            });
            const expectedSessionToken: SessionToken = {
                accessRights: [1, 2, 3],
                userName: 'someUser',
                valid: true,
                expirationTime: new Date(1000 * 60 * 60),
                tokenId: ''
            }
            const sessionToken = await authorizer.generateToken(someAccount);
            expect(expectedSessionToken).toStrictEqual(sessionToken);
            expect(sessionTokenDBAccessMock.storeSessionToken).toHaveBeenCalledWith(sessionToken);
        });
    });
    describe('validateToken tests', () => {
        test('validateToken returns invalid for null token', async () => {
            sessionTokenDBAccessMock.getToken.mockReturnValueOnce(null);
            const sessionToken = await authorizer.validateToken('123');
            expect(sessionToken).toStrictEqual({
                accessRights: [],
                state: TokenState.INVALID
            });
        });

        test('validateToken returns expired for expired tokens', async () => {
            const dateInPast = new Date(Date.now() - 1);
            sessionTokenDBAccessMock.getToken.mockReturnValueOnce({ valid: true, expirationTime: dateInPast });
            const sessionToken = await authorizer.validateToken('123');
            expect(sessionToken).toStrictEqual({
                accessRights: [],
                state: TokenState.EXPIRED
            });
        });

        test('validateToken returns valid for not expired and valid tokens', async () => {
            const dateInFuture = new Date(Date.now() + 100000);
            sessionTokenDBAccessMock.getToken.mockReturnValue(
                {
                    valid: true,
                    expirationTime: dateInFuture,
                    accessRights: [1]
                });
            const sessionToken = await authorizer.validateToken('123');
            expect(sessionToken).toStrictEqual({
                accessRights: [1],
                state: TokenState.VALID
            });
        });

    });




});