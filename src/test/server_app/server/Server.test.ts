import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { Server } from "../../../app/server_app/server/Server";

jest.mock('../../../app/server_app/auth/Authorizer');
jest.mock('../../../app/server_app/data/ReservationsDataAccess');

const requestMock = {
    url: '',
    headers : {
        'user-agent': 'jest test'
    }
}
const responseMock = {
    end: jest.fn(),
    writeHead: jest.fn()
}
const listenMock = {
    listen: jest.fn()
};

jest.mock('http', () => ({
    createServer: (cb: any) => {
        cb(requestMock, responseMock)
        return listenMock;
    }
}))

describe('Server test suite', ()=>{

    let sut: Server;

    beforeEach(()=>{
        sut = new Server();
        expect(Authorizer).toBeCalledTimes(1);
        expect(ReservationsDataAccess).toBeCalledTimes(1);
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('should start server on port 8080', ()=>{

        try {
            sut.startServer();
        } catch (error) {
            console.error(error);
        }

        expect(listenMock.listen).toBeCalledWith(8080);
        expect(responseMock.end).toBeCalled();

    });


});


