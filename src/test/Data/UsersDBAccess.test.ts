import { UsersDBAccess } from "../../app/Data/UsersDBAccess";
import { User, WorkingPosition } from "../../app/Models/UserModels";
import * as Nedb from 'nedb';
jest.mock('nedb');

describe('UsersDBAccess test suite', () => {

    let usersDBAccess: UsersDBAccess;

    const nedbMock = {
        loadDatabase: jest.fn(),
        insert: jest.fn(),
        find: jest.fn(),
    };

    beforeEach(() => {
        usersDBAccess = new UsersDBAccess(nedbMock as any);
        expect(nedbMock.loadDatabase).toBeCalledTimes(1);
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    const someUser: User = {
        age: 25,
        email: 'some@email.com',
        id: 'someId',
        name: 'someName',
        workingPosition: WorkingPosition.ENGINEER
    }

    const someOtherUser: User = {
        age: 26,
        email: 'someOther@email.com',
        id: 'someId',
        name: 'someName',
        workingPosition: WorkingPosition.ENGINEER
    }

    test('putUser with no error', async () => {
        const bar = (someUser: any, cb: any) => {
            cb()
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await usersDBAccess.putUser(someUser);
        expect(nedbMock.insert).toBeCalledWith(someUser, expect.any(Function));
    });

    test('putUser with error', async () => {
        const bar = (someUser: any, cb: any) => {
            cb(new Error('something went wrong'))
        }
        nedbMock.insert.mockImplementationOnce(bar);
        await expect(usersDBAccess.putUser(someUser)).rejects.toThrow('something went wrong');
        expect(nedbMock.insert).toBeCalledWith(someUser, expect.any(Function));
    });

    test('getUsersByName with no error', async () => {
        const bar = (someObject: Object, cb: any) => {
            cb(null, [someUser, someOtherUser])
        }
        nedbMock.find.mockImplementationOnce(bar);
        const resultUsers = await usersDBAccess.getUsersByName('some');
        expect(resultUsers).toEqual([someUser, someOtherUser]);
        expect(nedbMock.find).toBeCalledWith({ name: new RegExp('some') }, expect.any(Function));
    });

    test('getUsersByName with error', async () => {
        const bar = (someObject: Object, cb: any) => {
            cb(new Error('something went wrong'))
        }
        nedbMock.find.mockImplementationOnce(bar);
        await expect(usersDBAccess.getUsersByName('some')).rejects.toThrow('something went wrong');
    });

    test('constructor argument', () => {
        new UsersDBAccess();
        expect(Nedb).toBeCalledTimes(1);
        expect(Nedb).toBeCalledWith('databases/Users.db')
    });
});