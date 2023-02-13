import { IncomingMessage } from 'http';
import { getRequestBody } from '../../../app/server_app/utils/Utils';

const requestMock = {
    on: jest.fn()
}

const someObject = {
    name: 'John',
    age: 30,
    city: 'Paris'
}

const someObjectAsString = JSON.stringify(someObject);

describe('getRequestBody test suite', () => {

    it('should return object for valid JSON', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if (event == 'data') {
                cb(someObjectAsString)
            } else {
                cb()
            }
        });

        const actual = await getRequestBody(requestMock as any as IncomingMessage);
        expect(actual).toEqual(someObject);
    });

    it('should throw error for invalid JSON', async () => {
        requestMock.on.mockImplementation((event, cb) => {
            if (event == 'data') {
                cb('a' + someObjectAsString)
            } else {
                cb()
            }
        });

        await expect(getRequestBody(requestMock as any as IncomingMessage)).
            rejects.toThrow('Unexpected token a in JSON at position 0')
    });

    it('should throw error for unexpected error', async () => {
        const someError = new Error('something went wrong!')
        requestMock.on.mockImplementation((event, cb) => {
            if (event == 'error') {
                cb(someError)
            }
        });

        await expect(getRequestBody(requestMock as any as IncomingMessage)).
            rejects.toThrow(someError.message)
    });


});