import { DataHandler } from "../../app/Handlers/DataHandler";
import { HTTP_METHODS, HTTP_CODES, TokenState } from "../../app/Models/ServerModels";
import { Utils } from "../../app/Utils/Utils";
import { User, WorkingPosition } from "../../app/Models/UserModels";

const someUsers: User[] = [{
    age: 123,
    email: 'some@email.com',
    id: '1234',
    name: 'Some Name',
    workingPosition: WorkingPosition.PROGRAMMER
}]

describe('DataHandler test suite', () => {
    let dataHandler: DataHandler;

    const requestMock = {
        method: '',
        headers: {
            authorization: ''
        }
    };
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: 0
    };
    const tokenValidatorMock = {
        validateToken: jest.fn()
    };
    const usersDBAccessMock = {
        getUsersByName: jest.fn()
    };
    const parseUrlMock = jest.fn();

    beforeEach(() => {
        dataHandler = new DataHandler(
            requestMock as any,
            responseMock as any,
            tokenValidatorMock as any,
            usersDBAccessMock as any
        );
        Utils.parseUrl = parseUrlMock;
    });
    afterEach(() => {
        jest.clearAllMocks();
    })

    test('handle options requests', async () => {
        requestMock.method = HTTP_METHODS.OPTIONS;
        await dataHandler.handleRequest();
        expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
    });

    test('handle get request with operation authorized', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [1, 2, 3],
            state: TokenState.VALID
        });
        parseUrlMock.mockReturnValueOnce({
            query: {
                name: 'abcd'
            }
        });
        usersDBAccessMock.getUsersByName.mockReturnValueOnce(someUsers);
        await dataHandler.handleRequest();
        expect(usersDBAccessMock.getUsersByName).toBeCalledWith('abcd');
        expect(responseMock.writeHead).toBeCalledWith(
            HTTP_CODES.OK, { 'Content-Type': 'application/json' }
        );
        expect(responseMock.write).toBeCalledWith(JSON.stringify(someUsers));
    });

    test('handle get request with operation unauthorized', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [2, 3],
            state: TokenState.VALID
        });
        await dataHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write).toBeCalledWith('Unauthorized operation!');
    });

    test('handle get request with no authorization header', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = '';
        await dataHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED);
        expect(responseMock.write).toBeCalledWith('Unauthorized operation!');
    });

    test('handle get request with no name query', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockReturnValueOnce({
            accessRights: [1, 2, 3],
            state: TokenState.VALID
        });
        parseUrlMock.mockReturnValueOnce({
            query: {
            }
        });
        await dataHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
        expect(responseMock.write).toBeCalledWith('Missing name parameter in the request!');
    });

    test('handle get request with unexpected error', async () => {
        requestMock.method = HTTP_METHODS.GET;
        requestMock.headers.authorization = 'someTokenId';
        tokenValidatorMock.validateToken.mockRejectedValue(new Error('something went wrong!'));
        parseUrlMock.mockReturnValueOnce({
            query: {
            }
        });
        await dataHandler.handleRequest();
        expect(responseMock.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
        expect(responseMock.write).toBeCalledWith('Internal error: something went wrong!');
    });

    test('handle not recognized http method', async () => {
        requestMock.method = 'someMethod';
        await dataHandler.handleRequest();
        expect(responseMock.write).not.toHaveBeenCalled();
        expect(responseMock.writeHead).not.toHaveBeenCalled();
    })
});