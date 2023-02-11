import { IncomingMessage, ServerResponse, STATUS_CODES } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { RegisterHandler } from "../../../app/server_app/handlers/RegisterHandler"
import { Account } from "../../../app/server_app/model/AuthModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";

const getRequestBodyMock = jest.fn();
// jest.doMock('../../../app/server_app/utils/Utils',()=>({
//     getRequestBody: getRequestBodyMock
// }));

jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}));


describe('RegisterHandler test suite', () => {

    let sut: RegisterHandler;

    const request = {
        method: undefined
    };
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: 0
    };
    const authorizerMock = {
        registerUser: jest.fn()
    }

    const someId = '1234';

    const someAccount: Account = {
        id: '',
        password: 'somePassword',
        userName: 'someUserName'
    }

    beforeEach(() => {
        sut = new RegisterHandler(
            request as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer
        );
    });

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should register valid accounts in requests', async () => {
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce(someAccount);
        authorizerMock.registerUser.mockResolvedValueOnce(someId);

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.CREATED, { 'Content-Type': 'application/json' }
        )
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify({
                userId: someId
            })
        )
    });

    it('should not register invalid accounts in requests', async () => {
        request.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockResolvedValueOnce({});

        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.BAD_REQUEST, { 'Content-Type': 'application/json' }
        )
        expect(responseMock.write).toBeCalledWith(
            JSON.stringify(
                'userName and password required'
            )
        )
    });

    it('should do nothing for not supported http methods', async () => {
        request.method = HTTP_METHODS.GET;
        await sut.handleRequest();

        expect(responseMock.writeHead).not.toBeCalled();
        expect(responseMock.write).not.toBeCalled();
        expect(getRequestBodyMock).not.toBeCalled();
    });

})