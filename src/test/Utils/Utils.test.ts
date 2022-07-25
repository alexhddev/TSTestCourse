import { IncomingMessage } from 'http';
import { Utils } from '../app/Utils/Utils';

describe('Utils tests suite', ()=>{
    // USING STUBS
    test('getRequestPath valid request path', ()=>{
        //stub the incomming message object request -- url
        const request = {
            url: 'http://localhost:8080/login'
        } as IncomingMessage;

        const resultPath = Utils.getRequestBasePath(request);
        expect(resultPath).toBe('login')
    })

    test('getRequestPath with no path name', ()=>{
        const request = {
            url:'http://localhost:8080/'
        } as IncomingMessage;

        const resultPath = Utils.getRequestBasePath(request);
        expect(resultPath).toBeFalsy()
    })

    test('getRequestPath with no path name', ()=>{
        const request = {
            url:''
        } as IncomingMessage;

        const resultPath = Utils.getRequestBasePath(request);
        expect(resultPath).toBeFalsy()
    })

})