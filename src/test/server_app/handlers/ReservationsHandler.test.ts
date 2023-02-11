import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../../../app/server_app/auth/Authorizer";
import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess";
import { ReservationsHandler } from "../../../app/server_app/handlers/ReservationsHandler";
import { Reservation } from "../../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../../app/server_app/model/ServerModel";


const getRequestBodyMock = jest.fn();
jest.mock('../../../app/server_app/utils/Utils', () => ({
    getRequestBody: () => getRequestBodyMock()
}));


describe('ReservationsHandler test suite', () => {

    let sut: ReservationsHandler;

    const request = {
        method: undefined,
        headers: {
            authorization: undefined
        },
        url: undefined
    };
    const responseMock = {
        writeHead: jest.fn(),
        write: jest.fn(),
        statusCode: 0
    };
    const authorizerMock = {
        registerUser: jest.fn(),
        isTokenValid: jest.fn()
    }

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn()
    }

    const someReservation: Reservation = {
        id: undefined,
        endDate: new Date().toDateString(),
        startDate: new Date().toDateString(),
        room: 'someRoom',
        user: 'someUser'
    }
    const someReservationId = '1234';

    function setUpAndTeardownTests() {
        beforeEach(() => {
            sut = new ReservationsHandler(
                request as IncomingMessage,
                responseMock as any as ServerResponse,
                authorizerMock as any as Authorizer,
                reservationsDataAccessMock as any as ReservationsDataAccess
            );
            request.headers.authorization = 'abcd';
            authorizerMock.isTokenValid.mockResolvedValueOnce(true);
        })

        afterEach(() => {
            jest.clearAllMocks();
            request.method = undefined;
            request.url = undefined;
            responseMock.statusCode = 0;
        })
    }

    describe('POST requests', () => {
        setUpAndTeardownTests();

        it('should create reservation from valid request', async () => {
            request.method = HTTP_METHODS.POST;
            getRequestBodyMock.mockResolvedValueOnce(someReservation);
            reservationsDataAccessMock.createReservation.mockResolvedValueOnce(someReservationId);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify({ reservationId: someReservationId }))
        })

        it('should not create reservation from invalid request', async () => {
            request.method = HTTP_METHODS.POST;
            getRequestBodyMock.mockResolvedValueOnce({});

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Incomplete reservation!'))
        })
    });

    describe('GET requests', () => {
        setUpAndTeardownTests();

        it('should return all reservations for /all request', async () => {
            request.method = HTTP_METHODS.GET;
            request.url = '/reservations/all';
            reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([someReservation]);

            await sut.handleRequest();

            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify([someReservation]));
        });

        it('should return reservation for existing id', async () => {
            request.method = HTTP_METHODS.GET;
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);

            await sut.handleRequest();

            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify(someReservation));
        });

        it('should return not found for non existing id', async () => {
            request.method = HTTP_METHODS.GET;
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                `Reservation with id ${someReservationId} not found`
            ));
        });

        it('should return bad request if no id provided', async () => {
            request.method = HTTP_METHODS.GET;
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                'Please provide an ID!'
            ));
        });
    });





});