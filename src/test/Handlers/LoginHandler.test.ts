import { LoginHandler } from "../../app/Handlers/LoginHandler";
import { HTTP_METHODS, HTTP_CODES } from "../../app/Models/ServerModels";


describe('LoginHandler test suite', () => {
    let loginHandler: LoginHandler;

    const requestMock = {
        method: ''
    };
    const responseMock = {
        writeHead: jest.fn()
    };
    const authorizerMock = {};

    beforeEach(() => {
        loginHandler = new LoginHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any
        )
    });

    test('options request', async () => {
        requestMock.method = HTTP_METHODS.OPTIONS;
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
    })

});