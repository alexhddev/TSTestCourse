import { HTTP_METHODS } from "../../app/server_app/model/ServerModel";
import { makeAwesomeRequest } from "./utils/http_client";



describe('Server app integration tests', () => {

    it('should call server', async () =>{

        const requestBody = {
            userName: 'userName',
            password: 'password'
        }

        const result = await makeAwesomeRequest({
            host: 'localhost',
            port: 8080,
            method: HTTP_METHODS.POST,
            path: '/register',
            
        }, requestBody)
        console.log(result);
    });

})