import { IncomingMessage, ServerResponse } from "http";
import { Authorizer } from "../auth/Authorizer";
import { ReservationsDataAccess } from "../data/ReservationsDataAccess";
import { Reservation } from "../model/ReservationModel";
import { HTTP_CODES, HTTP_METHODS } from "../model/ServerModel";
import { getRequestBody } from "../utils/Utils";



export class ReservationsHandler {

    private request: IncomingMessage;
    private response: ServerResponse;
    private authorizer: Authorizer;
    private reservationsDataAccess: ReservationsDataAccess;

    public constructor(request: IncomingMessage,
        response: ServerResponse,
        authorizer: Authorizer,
        reservationsDataAccess: ReservationsDataAccess) {
        this.request = request;
        this.response = response;
        this.authorizer = authorizer;
        this.reservationsDataAccess = reservationsDataAccess;
    }

    public async handleRequest() {
        const isAuthorized = await this.isOperationAuthorized();
        if (!isAuthorized) {
            this.response.statusCode = HTTP_CODES.UNAUTHORIZED;
            this.response.write(JSON.stringify('Unauthorized operation!'));
            return;
        }

        try {
            switch (this.request.method) {
                case HTTP_METHODS.POST:
                    await this.handlePost();
                    break;
                case HTTP_METHODS.GET:
                    await this.handleGet();
                    break;
                case HTTP_METHODS.PUT:
                    await this.handlePut();
                    break;
                case HTTP_METHODS.DELETE:
                    await this.handleDelete();
                    break;
                default:
                    break;
            }
        } catch (error) {

        }
    }

    private async isOperationAuthorized() {
        const tokenId = this.request.headers.authorization;
        if (tokenId) {
            const isValid = await this.authorizer.validateToken(tokenId);
            return isValid;
        }
        return false;
    }

    private async handlePost() {
        const requestBody: Reservation = await getRequestBody(this.request);
        if (!this.isValidReservation(requestBody)) {
            this.response.statusCode = HTTP_CODES.BAD_REQUEST;
            this.response.write(JSON.stringify('Incomplete reservation!'));
            return;
        }

        const reservationId = await this.reservationsDataAccess.createReservation(requestBody);
        this.response.statusCode = HTTP_CODES.CREATED;
        this.response.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
        this.response.write(JSON.stringify({ reservationId }));
    }

    private async handleGet() {
        const id = this.getIdFromUrl();
        if (id === 'all') {
            const allReservations = await this.reservationsDataAccess.getAllReservations();
            this.response.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
            this.response.write(JSON.stringify(allReservations));
            return;
        }
        if (id) {
            const reservation = await this.reservationsDataAccess.getReservation(id);
            if (reservation) {
                this.response.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                this.response.write(JSON.stringify(reservation));
            } else {
                this.response.statusCode = HTTP_CODES.NOT_fOUND;
                this.response.write(JSON.stringify(`Reservation with id ${id} not found`));
            }
        } else {
            this.response.statusCode = HTTP_CODES.BAD_REQUEST;
            this.response.write(JSON.stringify(
                'Please provide an ID!'
            ));
        }
    }
    private async handlePut() {
        const id = this.getIdFromUrl();
        if (id) {
            const reservation = await this.reservationsDataAccess.getReservation(id);
            if (reservation) {
                const requestBody: Reservation = await getRequestBody(this.request);
                if (this.isValidPartialReservation(requestBody)) {
                    const requestBodyProperties = Object.keys(requestBody) as Array<keyof Reservation>;
                    for (const property of requestBodyProperties) {
                        await this.reservationsDataAccess.updateReservation(
                            id,
                            property,
                            requestBody[property]
                        )
                    }
                    this.response.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                    this.response.write(JSON.stringify(`Updated ${Object.keys(requestBody)} of reservation ${id}`));
                } else {
                    this.response.statusCode = HTTP_CODES.BAD_REQUEST;
                    this.response.write(JSON.stringify(
                        'Please provide valid fields to update!'
                    ));
                }
            } else {
                this.response.statusCode = HTTP_CODES.NOT_fOUND;
                this.response.write(JSON.stringify(`Reservation with id ${id} not found`));
            }
        } else {
            this.response.statusCode = HTTP_CODES.BAD_REQUEST;
            this.response.write(JSON.stringify(
                'Please provide an ID!'
            ));
        }

    }
    private async handleDelete() {
        const id = this.getIdFromUrl();
        if (id) {
            await this.reservationsDataAccess.deleteReservation(id);
            this.response.statusCode = HTTP_CODES.OK;
            this.response.write(JSON.stringify(`Deleted reservation with id ${id}`));

        } else {
            this.response.statusCode = HTTP_CODES.BAD_REQUEST;
            this.response.write(JSON.stringify(
                'Please provide an ID!'
            ));
        }
    }

    private getIdFromUrl() {
        const fullRoute = this.request.url;
        if (fullRoute) {
            return fullRoute.split('/')[2];
        }
    }

    private isValidPartialReservation(reservation: Partial<Reservation>) {
        if (Object.keys(reservation).length === 0) {
            return false;
        }
        const genericReservation: Partial<Reservation> = {
            endDate: undefined,
            id: undefined,
            room: undefined,
            startDate: undefined,
            user: undefined
        }
        const reservationKeys = Object.keys(genericReservation);
        let hasValidKeys = false;
        let hasRightKeys = true;
        for (const key in reservation) {
            if (reservationKeys.includes(key)) {
                hasValidKeys = true;
            } else {
                hasRightKeys = false;
            }
        }
        return hasRightKeys && hasValidKeys;
    }

    private isValidReservation(reservation: Reservation) {
        if (Object.keys(reservation).length === 0) {
            return false;
        }
        const genericReservation: Partial<Reservation> = {
            endDate: undefined,
            room: undefined,
            startDate: undefined,
            user: undefined,
            id: undefined
        }
        const reservationKeys = Object.keys(genericReservation);
        let hasRightKeys = true;
        for (const key in reservation) {
            if (!reservationKeys.includes(key)) {
                hasRightKeys = false;
            }
        }
        return hasRightKeys;
    }

}