import { Account } from "../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./TestUtils/RequestTestWrapper";
import { ResponseTestWrapper } from "./TestUtils/ResponseTestWrapper";


// const mockInsert = jest.fn();
// const mockGetBy = jest.fn();
// const mockUpdate = jest.fn();
// const mockDelete = jest.fn();
// const mockGetAllElements = jest.fn();

// jest.mock('../../../app/server_app/data/DataBase', () => {
//     return {
//         DataBase: jest.fn().mockImplementation(() => {
//             return {
//                 insert: mockInsert,
//                 getBy: mockGetBy,
//                 update: mockUpdate,
//                 delete: mockDelete,
//                 getAllElements: mockGetAllElements
//             }
//         })
//     }
// });

const requestWrapper = new RequestTestWrapper();
const responseWrapper = new ResponseTestWrapper();

const fakeServer = {
    listen: () => { },
    close: () => { }
};

jest.mock('http', () => ({
    createServer: (cb: any) => {
        cb(requestWrapper, responseWrapper)
        return fakeServer;
    }
}))

const someAccount: Account = {
    id: '',
    password: 'somePassword',
    userName: 'someUserName'
}

describe('Register requests', () => {
    
    beforeEach(()=>{
        requestWrapper.headers['user-agent'] = 'jest tests'
    })

    afterEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
    })

    test('should work now', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = someAccount;
        requestWrapper.url = 'localhost:8080/register';

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues, 
        // https://stackoverflow.com/questions/44741102/how-to-make-jest-wait-for-all-asynchronous-code-to-finish-execution-before-expec

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
    });

});