import { sampleFunction } from "../../app/Utils/UrlTest";
import * as http from 'http';


describe('Url test suite', () => {

    const responseMock = {
        on: jest.fn()
    }

    //@ts-ignore
    jest.spyOn(http, 'get').mockImplementation((url: string|URL, cb:any) => {
        cb(responseMock);
    })

    test('initial test', async () => {
        responseMock.on.mockImplementation((event, cb) => {
            if (event == 'data') {
                cb('some response')
            } else {
                cb()
            }
        });

        const response = await sampleFunction('www.abc.com')
        console.log(response)
    })

});