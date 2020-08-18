import { LoginHandler } from "../../app/Handlers/LoginHandler";
import { HTTP_METHODS, HTTP_CODES, SessionToken } from "../../app/Models/ServerModels";
import { Utils } from '../../app/Utils/Utils';


describe('LoginHandler test suite', () => {
    let loginHandler: LoginHandler;

    const requestMock = {
        method: ''
    };
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: 0
    };
    const authorizerMock = {
        generateToken: jest.fn()
    };
    const getRequestBodyMock = jest.fn();

    beforeEach(() => {
        loginHandler = new LoginHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any
        )
        Utils.getRequestBody = getRequestBodyMock;
    });
    afterEach(() => {
        jest.clearAllMocks();
    })

    const someSessionToken: SessionToken = {
        tokenId: 'someTokenId',
        userName: 'someUserName',
        valid: true,
        expirationTime: new Date(),
        accessRights: [1, 2, 3]
    }

    test('options request', async () => {
        requestMock.method = HTTP_METHODS.OPTIONS;
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
    })

    test('not handled http method', async () => {
        requestMock.method = 'someRandomMethod';
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
    });

    test.only('post request with valid login', async () => {
        requestMock.method = HTTP_METHODS.POST;
        getRequestBodyMock.mockReturnValueOnce({
            username: 'someUser',
            password: 'password'
        });
        authorizerMock.generateToken.mockReturnValueOnce(someSessionToken);
        await loginHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.CREATED, { 'Content-Type': 'application/json' }
        );
        expect(responseMock.write).toBeCalledWith(JSON.stringify(someSessionToken));

    });

});