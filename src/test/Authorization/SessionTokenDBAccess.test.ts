import { SessionTokenDBAccess } from "../../app/Authorization/SessionTokenDBAccess";
import * as Nedb from 'nedb';
import { SessionToken } from "../../app/Models/ServerModels";
jest.mock('nedb');

describe('SessionTokenDBAccess test suite', () => {
    let sessionTokenDBAccess: SessionTokenDBAccess;

    const nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn()
    }
    const someToken: SessionToken = {
        accessRights: [],
        expirationTime: new Date(),
        tokenId: '123',
        userName: 'John',
        valid: true
    }
    const someTokenId = '123';

    beforeEach(() => {
        sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock as any);
        expect(nedbMock.loadDatabase).toBeCalled();
    });
    afterEach(() => {
        jest.clearAllMocks()
    });
    test('store sessionToken without error', async () => {
        nedbMock.insert.mockImplementationOnce(
            (someToken: any, cb: any) => {
                cb()
            }
        );
        await sessionTokenDBAccess.storeSessionToken(someToken);
        expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
    });
    test('store sessionToken with error', async () => {
        nedbMock.insert.mockImplementationOnce(
            (someToken: any, cb: any) => {
                cb(new Error('something went wrong'))
            }
        );
        await expect(sessionTokenDBAccess.storeSessionToken(someToken))
            .rejects.toThrow('something went wrong');
        expect(nedbMock.insert).toBeCalledWith(someToken, expect.any(Function));
    });
    test('get token with result and no error', async () => {
        const bar = (someTokenId: string, cb: any) => {
            cb(null, [someToken])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const getTokenResult = await sessionTokenDBAccess.getToken(someTokenId);
        expect(getTokenResult).toBe(someToken);
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });

    test('get token with no result and no error', async () => {
        const bar = (someTokenId: string, cb: any) => {
            cb(null, [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const getTokenResult = await sessionTokenDBAccess.getToken(someTokenId);
        expect(getTokenResult).toBeNull;
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });

    test('get token with error', async () => {
        const bar = (someTokenId: string, cb: any) => {
            cb(new Error("something went wrong"), [])
        }
        nedbMock.find.mockImplementationOnce(bar);
        await expect(sessionTokenDBAccess.getToken(someTokenId)).rejects.toThrow("something went wrong");
        expect(nedbMock.find).toBeCalledWith({ tokenId: someTokenId }, expect.any(Function));
    });

    test('constructor argument', async () => {
        new SessionTokenDBAccess();
        expect(Nedb).toBeCalledWith('databases/sessionToken.db')
    });


});