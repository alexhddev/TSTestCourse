import { UserCredentialsDataAccess } from '../../../app/server_app/data/UserCredentialsDataAccess';
import { Account } from '../../../app/server_app/model/AuthModel';
import { DataBase } from '../../../app/server_app/data/DataBase';

const mockInsert = jest.fn();
const mockGetBy = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', ()=>{
    return {
        DataBase: jest.fn().mockImplementation(()=>{
            return {
                insert: mockInsert,
                getBy: mockGetBy
            }
        })
    }
});

describe('UserCredentialsDataAccess test suite', () => {

    let sut: UserCredentialsDataAccess

    const someId = '1234';

    const someAccount: Account = {
        id: '',
        password: 'somePassword',
        userName: 'someUserName'
    }

    beforeEach(() => {
        sut = new UserCredentialsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should add user and return the id', async () => {
        mockInsert.mockResolvedValueOnce(someId);

        const actualId = await sut.addUser(someAccount);

        expect(actualId).toBe(someId);
        expect(mockInsert).toHaveBeenCalledWith(someAccount);
    });

    it('should get user by id', async () => {
        mockGetBy.mockResolvedValueOnce(someAccount);

        const actualUser = await sut.getUserById(someId);

        expect(actualUser).toEqual(someAccount);
        expect(mockGetBy).toHaveBeenCalledWith('id', someId);
    });

    it('should get user by user name', async () => {
        mockGetBy.mockResolvedValueOnce(someAccount);

        const actualUser = await sut.getUserByUserName(someAccount.userName);

        expect(actualUser).toEqual(someAccount);
        expect(mockGetBy).toHaveBeenCalledWith('userName', someAccount.userName);

    })



});