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
        validateToken: jest.fn()
    }

    const reservationsDataAccessMock = {
        createReservation: jest.fn(),
        getAllReservations: jest.fn(),
        getReservation: jest.fn(),
        updateReservation: jest.fn(),
        deleteReservation: jest.fn()
    }

    const someReservation: Reservation = {
        id: undefined,
        endDate: new Date().toDateString(),
        startDate: new Date().toDateString(),
        room: 'someRoom',
        user: 'someUser'
    }
    const someReservationId = '1234';

    beforeEach(() => {
        sut = new ReservationsHandler(
            request as IncomingMessage,
            responseMock as any as ServerResponse,
            authorizerMock as any as Authorizer,
            reservationsDataAccessMock as any as ReservationsDataAccess
        );
        request.headers.authorization = 'abcd';
        authorizerMock.validateToken.mockResolvedValueOnce(true);
    })

    afterEach(() => {
        jest.clearAllMocks();
        request.url = undefined;
        responseMock.statusCode = 0;
    })

    describe('POST requests', () => {

        beforeEach(() => {
            request.method = HTTP_METHODS.POST;
        })

        it('should create reservation from valid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce(someReservation);
            reservationsDataAccessMock.createReservation.mockResolvedValueOnce(someReservationId);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify({ reservationId: someReservationId }))
        })

        it('should not create reservation from invalid request', async () => {
            getRequestBodyMock.mockResolvedValueOnce({});

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Incomplete reservation!'))
        })

        it('should not create reservation from invalid fields in request', async () => {
            const moreThanAReservation = { ...someReservation, someField: '123' }
            getRequestBodyMock.mockResolvedValueOnce(moreThanAReservation);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
            expect(responseMock.write).toBeCalledWith(JSON.stringify('Incomplete reservation!'))
        })
    });

    describe('GET requests', () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.GET;
        })

        it('should return all reservations for /all request', async () => {
            request.url = '/reservations/all';
            reservationsDataAccessMock.getAllReservations.mockResolvedValueOnce([someReservation]);

            await sut.handleRequest();

            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify([someReservation]));
        });

        it('should return reservation for existing id', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);

            await sut.handleRequest();

            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify(someReservation));
        });

        it('should return not found for non existing id', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                `Reservation with id ${someReservationId} not found`
            ));
        });

        it('should return bad request if no id provided', async () => {
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                'Please provide an ID!'
            ));
        });
    });

    describe('PUT requests', () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.PUT;
        });

        it('should return not found for non existing id', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(undefined);

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                `Reservation with id ${someReservationId} not found`
            ));
        });

        it('should return bad request if no id provided', async () => {
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                'Please provide an ID!'
            ));
        });

        it('should return bad request if invalid fields are provided', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);
            getRequestBodyMock.mockResolvedValueOnce({
                startDate1: 'someDate'
            });

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                'Please provide valid fields to update!'
            ));
        });

        it('should return bad request if no fields are provided', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);
            getRequestBodyMock.mockResolvedValueOnce({});

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                'Please provide valid fields to update!'
            ));
        });

        it('should update reservation with all valid fields provided', async () => {
            request.url = `/reservations/${someReservationId}`;
            reservationsDataAccessMock.getReservation.mockResolvedValueOnce(someReservation);
            const updateObject = {
                startDate: 'someDate1',
                endDate: 'someDate2'
            }
            getRequestBodyMock.mockResolvedValueOnce(updateObject);

            await sut.handleRequest();

            expect(reservationsDataAccessMock.updateReservation).toBeCalledTimes(2);
            expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
                someReservationId,
                'startDate',
                updateObject.startDate
            );
            expect(reservationsDataAccessMock.updateReservation).toBeCalledWith(
                someReservationId,
                'endDate',
                updateObject.endDate
            );
            expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                `Updated ${Object.keys(updateObject)} of reservation ${someReservationId}`
            ));
        });
    });

    describe('DELETE requests', () => {
        beforeEach(() => {
            request.method = HTTP_METHODS.DELETE;
        });

        it('should delete reservation with provided id', async () => {
            request.url = `/reservations/${someReservationId}`;

            await sut.handleRequest();

            expect(reservationsDataAccessMock.deleteReservation).toBeCalledWith(someReservationId);
            expect(responseMock.statusCode).toBe(HTTP_CODES.OK);
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                `Deleted reservation with id ${someReservationId}`
            ));
        })

        it('should return bad request if no id provided', async () => {
            request.url = `/reservations`;

            await sut.handleRequest();

            expect(responseMock.statusCode).toBe(HTTP_CODES.BAD_REQUEST)
            expect(responseMock.write).toBeCalledWith(JSON.stringify(
                'Please provide an ID!'
            ));
        });
    });

    it('should return nothing for not authorized requests', async () => {
        request.headers.authorization = '1234';
        authorizerMock.validateToken.mockReset();
        authorizerMock.validateToken.mockResolvedValueOnce(false);

        await sut.handleRequest();


        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toBeCalledWith(JSON.stringify(
            'Unauthorized operation!'
        ));
    })

    it('should return nothing if no authorization header is present', async () => {
        request.headers.authorization = undefined;
        
        await sut.handleRequest();

        expect(responseMock.statusCode).toBe(HTTP_CODES.UNAUTHORIZED)
        expect(responseMock.write).toBeCalledWith(JSON.stringify(
            'Unauthorized operation!'
        ));
    });

    it('should do nothing for not supported http methods', async () => {
        request.method = 'SOME-METHOD'
        
        await sut.handleRequest();

        expect(responseMock.write).not.toBeCalled();
        expect(responseMock.writeHead).not.toBeCalled();
    });
});
