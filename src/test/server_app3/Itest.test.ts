import { Account } from "../../app/server_app/model/AuthModel";
import { Reservation } from "../../app/server_app/model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { Server } from "../../app/server_app/server/Server";
import { makeAwesomeRequest } from "./utils/http_client";

describe('Server app integration tests', () => {

    let server: Server;

    const someUser: Account = {
        id: '',
        userName: 'someUserName',
        password: 'somePassword'
    }

    const someReservation: Reservation = {
        id: '',
        endDate: 'someEndDate',
        startDate: 'someStartDate',
        room: 'someRoom',
        user: 'someUser'
    }

    beforeAll(() => {
        server = new Server();
        server.startServer();
    })

    it('should register new user with awesomeHttpRequest', async () => {
        const result = await makeAwesomeRequest({
            host: 'localhost',
            port: 8080,
            method: HTTP_METHODS.POST,
            path: '/register'
        }, someUser)
        expect(result.statusCode).toBe(HTTP_CODES.CREATED);
        expect(result.body.userId).toBeDefined();
        console.log(process.env.DB_HOST);
    });

    it('should register new user', async () => {
        const result = await fetch('http://localhost:8080/register', {
            body: JSON.stringify(someUser),
            method: HTTP_METHODS.POST
        });
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.userId).toBeDefined();
    });

    let token: string;
    it('should login registered users', async () => {
        const result = await fetch('http://localhost:8080/login', {
            body: JSON.stringify(someUser),
            method: HTTP_METHODS.POST
        });
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.token).toBeDefined();
        token = resultBody.token
    });

    let createdReservationId: string;
    it('should create reservation if authorized', async () => {
        const result = await fetch('http://localhost:8080/reservation', {
            body: JSON.stringify(someReservation),
            method: HTTP_METHODS.POST,
            headers: {
                authorization: token
            }
        });
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.CREATED);
        expect(resultBody.reservationId).toBeDefined();
        createdReservationId = resultBody.reservationId
    });

    it('should retrieve created reservation if authorized', async () => {
        const result = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });
        const resultBody = await result.json();
        const expectedResult = structuredClone(someReservation);
        expectedResult.id = createdReservationId;
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toEqual(expectedResult);
    });

    it('should create and retrieve multiple reservations if authorized', async () => {
        await fetch('http://localhost:8080/reservation', {
            body: JSON.stringify(someReservation),
            method: HTTP_METHODS.POST,
            headers: {
                authorization: token
            }
        });
        await fetch('http://localhost:8080/reservation', {
            body: JSON.stringify(someReservation),
            method: HTTP_METHODS.POST,
            headers: {
                authorization: token
            }
        });
        await fetch('http://localhost:8080/reservation', {
            body: JSON.stringify(someReservation),
            method: HTTP_METHODS.POST,
            headers: {
                authorization: token
            }
        });

        const result = await fetch(`http://localhost:8080/reservation/all`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });
        const resultBody = await result.json();
        expect(result.status).toBe(HTTP_CODES.OK);
        expect(resultBody).toHaveLength(4);
    });

    it('should update reservation if authorized', async () => {
        const updateResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            body: JSON.stringify({
                startDate: 'someOtherStartDate'
            }),
            method: HTTP_METHODS.PUT,
            headers: {
                authorization: token
            }
        });

        expect(updateResult.status).toBe(HTTP_CODES.OK);

        const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });
        const getResultBody: Reservation = await getResult.json();
        expect(getResultBody.startDate).toEqual('someOtherStartDate');

    });

    it('should delete reservation if authorized', async () => {
        const deleteResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            body: JSON.stringify(someReservation),
            method: HTTP_METHODS.DELETE,
            headers: {
                authorization: token
            }
        });
        expect(deleteResult.status).toBe(HTTP_CODES.OK);

        const getResult = await fetch(`http://localhost:8080/reservation/${createdReservationId}`, {
            method: HTTP_METHODS.GET,
            headers: {
                authorization: token
            }
        });
        expect(getResult.status).toBe(HTTP_CODES.NOT_fOUND);
    });

    afterAll(() => {
        server.stopServer();
    })

})