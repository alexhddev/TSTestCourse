import { DataBase } from "../../app/server_app/data/DataBase";
import { Account } from "../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { RequestTestWrapper } from "./TestUtils/RequestTestWrapper";
import { ResponseTestWrapper } from "./TestUtils/ResponseTestWrapper";

jest.mock('../../app/server_app/data/DataBase');

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

const jsonHeader = { 'Content-Type': 'application/json' }

describe('Register requests', () => {

    const insertSpy = jest.spyOn(DataBase.prototype, 'insert');
    
    beforeEach(()=>{
        requestWrapper.headers['user-agent'] = 'jest tests'
    })

    afterEach(() => {
        requestWrapper.clearFields();
        responseWrapper.clearFields();
    })

    it('should register new users', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = someAccount;
        requestWrapper.url = 'localhost:8080/register';
        insertSpy.mockResolvedValueOnce('1234');

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues, 
        // https://stackoverflow.com/questions/44741102/how-to-make-jest-wait-for-all-asynchronous-code-to-finish-execution-before-expec

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseWrapper.body).toEqual(expect.objectContaining({
            userId: expect.any(String)
        }))
        expect(responseWrapper.headers).toContainEqual(jsonHeader);
        expect(insertSpy).toHaveBeenCalledTimes(1);
    });

    it('should reject requests with no username and password', async () => {
        requestWrapper.method = HTTP_METHODS.POST;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/register';

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues, 

        expect(responseWrapper.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseWrapper.headers).toContainEqual(jsonHeader);
        expect(responseWrapper.body).toEqual('userName and password required');
    });

    it('should do nothing for not supported methods', async () => {
        requestWrapper.method = HTTP_METHODS.DELETE;
        requestWrapper.body = {};
        requestWrapper.url = 'localhost:8080/register';

        await new Server().startServer();

        await new Promise(process.nextTick); // this solves timing issues, 

        expect(responseWrapper.statusCode).toBeUndefined();
        expect(responseWrapper.headers).toHaveLength(0);
        expect(responseWrapper.body).toBeUndefined();
    });

});