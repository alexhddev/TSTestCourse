import { createServer, IncomingMessage, Server as NodeServer, ServerResponse } from 'http'
import { Authorizer } from '../auth/Authorizer';
import { RegisterHandler } from '../handlers/RegisterHandler';

export class Server {

    private server: NodeServer;
    private authorizer = new Authorizer();

    public startServer() {
        this.server = createServer(async (req, res) => {
            console.log(`Got request from ${req.headers['user-agent']}`);
            console.log(`Got request for ${req.url}`);
            await this.handleRequest(req, res);
            res.end();
        }).listen(8080);
        console.log('server started')
    }

    private async handleRequest(request: IncomingMessage, response: ServerResponse){
        try {
            const route = this.getRouteFromUrl(request);
            switch (route) {
                case 'register':
                    await new RegisterHandler(request, response, this.authorizer).handleRequest();
                    break;
            
                default:
                    break;
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    private getRouteFromUrl(request: IncomingMessage) {
        const fullRoute = request.url;
        if (fullRoute) {
            return fullRoute.split('/')[1];
        }
    }

    public stopServer() {
        if(this.server) {
            this.server.close();
            console.log('server closed')
        }
    }
}