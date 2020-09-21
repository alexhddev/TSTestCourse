import * as axios from 'axios';
import { HTTP_CODES, SessionToken, UserCredentials } from '../app/Models/ServerModels';
import { UserCredentialsDbAccess } from "../app/Authorization/UserCredentialsDbAccess";


axios.default.defaults.validateStatus = function () {
    return true;
}
const serverUrl = 'http://localhost:8080';
const itestUserCredentials: UserCredentials = {
    accessRights: [1, 2, 3],
    password: 'iTestPassword',
    username: 'iTestUser'
}

describe('Server itest suite', () => {
    let userCredentialsDBAccess: UserCredentialsDbAccess;
    let sessionToken: SessionToken;

    beforeAll(() => {
        userCredentialsDBAccess = new UserCredentialsDbAccess();
    })

    test('server reachable', async () => {
        const response = await axios.default.options(serverUrl);
        expect(response.status).toBe(HTTP_CODES.OK);
    });
    test.skip('put credentials inside database', async () => {
        await userCredentialsDBAccess.putUserCredential(itestUserCredentials);
    });
    test('reject invalid credentials', async () => {
        const response = await axios.default.post(
            (serverUrl + '/login'),
            {
                "username": "someWrongCred",
                "password": "someWrongCred"
            }
        );
        expect(response.status).toBe(HTTP_CODES.NOT_fOUND);
    });

    test('login successful with correct credentials', async () => {
        const response = await axios.default.post(
            (serverUrl + '/login'),
            {
                "username": itestUserCredentials.username,
                "password": itestUserCredentials.password
            }
        );
        expect(response.status).toBe(HTTP_CODES.CREATED);
        sessionToken = response.data;
    });
    test('Query data', async () => {
        const response = await axios.default.get(
            (serverUrl + '/users?name=some'), {
            headers: {
                Authorization: sessionToken.tokenId
            }
        }
        );
        expect(response.status).toBe(HTTP_CODES.OK);
    });
    test('Query data with invalid token', async () => {
        const response = await axios.default.get(
            (serverUrl + '/users?name=some'), {
            headers: {
                Authorization: sessionToken.tokenId + 'someStuff'
            }
        }
        );
        expect(response.status).toBe(HTTP_CODES.UNAUTHORIZED);
    });
});


/**
 * Not usable in Jest
 * @see https://github.com/facebook/jest/issues/8604
 */
async function serverReachable(): Promise<boolean> {
    try {
        await axios.default.get(serverUrl);
    } catch (error) {
        console.log('Server NOT reachable')
        return false;
    }
    console.log('Server reachable')
    return true;
}