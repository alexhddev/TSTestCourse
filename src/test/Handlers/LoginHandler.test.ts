import { LoginHandler } from '../../app/Handlers/LoginHandler';
import { HTTP_CODES, HTTP_METHODS } from '../../app/Models/ServerModels';
import { Utils } from '../../app/Utils/Utils';

describe('LoginHandler test suite', ()=>{
    let loginHandler: LoginHandler;

    const requestMock = {
        method: ''
    };
    const responseMock = {
        writeHead: jest.fn()
    };
    const authorizerMock = {};
    const getRequestBodyMock = jest.fn()

    beforeEach(()=>{
        loginHandler = new LoginHandler(
            requestMock as any,
            responseMock as any,
            authorizerMock as any
        )
        Utils.getRequestBody = getRequestBodyMock;
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })
    
    test('options request', async ()=>{
        requestMock.method = HTTP_METHODS.OPTIONS;
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK)
    })

    test('not handled HTTP requests', async ()=>{
        requestMock.method = 'someRandomMethod';
        await loginHandler.handleRequest();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
    })

    test.only('post test with valid login', async ()=>{
        getRequestBodyMock.mockReturnValueOnce({
            username: 'someUser',
            password: 'password'

        });
        await loginHandler.handleRequest()

    })
})