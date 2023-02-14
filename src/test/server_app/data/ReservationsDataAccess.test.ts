import { ReservationsDataAccess } from "../../../app/server_app/data/ReservationsDataAccess"
import { DataBase } from '../../../app/server_app/data/DataBase';
import * as IdGenerator from '../../../app/server_app/data/IdGenerator';
import { Reservation } from "../../../app/server_app/model/ReservationModel";

const mockInsert = jest.fn();
const mockGetBy = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockGetAllElements = jest.fn();

jest.mock('../../../app/server_app/data/DataBase', () => {
    return {
        DataBase: jest.fn().mockImplementation(() => {
            return {
                insert: mockInsert,
                getBy: mockGetBy,
                update: mockUpdate,
                delete: mockDelete,
                getAllElements: mockGetAllElements
            }
        })
    }
});

describe('ReservationsDataAccess test suite', () => {

    let sut: ReservationsDataAccess;

    const someId = '1234';

    const someReservation: Reservation = {
        endDate: 'someEndDate',
        startDate: 'someStartDate',
        id: '',
        room: 'someRoom',
        user: 'someUser'
    }

    beforeEach(() => {
        sut = new ReservationsDataAccess();
        expect(DataBase).toHaveBeenCalledTimes(1);
        jest.spyOn(IdGenerator, 'generateRandomId').mockReturnValueOnce(someId);
    });

    afterEach(() => {
        jest.clearAllMocks();
        someReservation.id = '';
    })

    it('should return the id of newly created reservation', async () => {
        mockInsert.mockResolvedValueOnce(someId);

        const actual = await sut.createReservation(someReservation);

        expect(actual).toBe(someId);
        expect(mockInsert).toBeCalledWith(someReservation);
    });

    it('should make the update reservation call', async () => {
        await sut.updateReservation(
            someId,
            'endDate',
            'someOtherEndDate'
        )

        expect(mockUpdate).toBeCalledWith(
            someId,
            'endDate',
            'someOtherEndDate'
        )
    });

    it('should make the delete reservation call', async () => {
        await sut.deleteReservation(someId);

        expect(mockDelete).toBeCalledWith(someId);
    });

    it('should return reservation by id', async () => {
        mockGetBy.mockResolvedValueOnce(someReservation);

        const actual = await sut.getReservation(someId);

        expect(actual).toEqual(someReservation);
        expect(mockGetBy).toBeCalledWith('id', someId);
    });

    it('should return all reservations', async () => {
        mockGetAllElements.mockResolvedValueOnce([someReservation, someReservation]);

        const actual = await sut.getAllReservations();

        expect(actual).toEqual([someReservation, someReservation]);
        expect(mockGetAllElements).toBeCalledTimes(1);
    });


})