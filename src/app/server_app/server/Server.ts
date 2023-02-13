import { createServer, IncomingMessage, Server as NodeServer, ServerResponse } from 'http'
import { Authorizer } from '../auth/Authorizer';
import { ReservationsDataAccess } from '../data/ReservationsDataAccess';
import { LoginHandler } from '../handlers/LoginHandler';
import { RegisterHandler } from '../handlers/RegisterHandler';
import { ReservationsHandler } from '../handlers/ReservationsHandler';
import { HTTP_CODES } from '../model/ServerModel';

export class Server {

    private server: NodeServer;
    private authorizer = new Authorizer();
    private reservationsDataAccess = new ReservationsDataAccess();

    public startServer() {
        this.server = createServer(async (req, res) => {
            console.log(`Got request from ${req.headers['user-agent']}`);
            console.log(`Got request for ${req.url}`);
            await this.handleRequest(req, res);
            console.log(1);
            console.log((res.end as any as jest.Mock).mock.calls)
            res.end();
            console.log((res.end as any as jest.Mock).mock.calls)
            console.log(2);
        }).listen(8080);
        console.log('server started')
    }

    private async handleRequest(request: IncomingMessage, response: ServerResponse) {
        try {
            const route = this.getRouteFromUrl(request);
            switch (route) {
                case 'register':
                    await new RegisterHandler(request, response, this.authorizer).handleRequest();
                    break;
                case 'login':
                    await new LoginHandler(request, response, this.authorizer).handleRequest();
                    break;
                case 'reservation':
                    await new ReservationsHandler(request, response, this.authorizer, this.reservationsDataAccess).handleRequest();
                    break;
                default:
                    break;
            }
        } catch (error) {
            response.writeHead(HTTP_CODES.INTERNAL_SERVER_ERROR, JSON.stringify(`Internal server error: ${error.message}`))
        }
    }

    private getRouteFromUrl(request: IncomingMessage) {
        const fullRoute = request.url;
        if (fullRoute) {
            return fullRoute.split('/')[1];
        }
    }

    public stopServer() {
        if (this.server) {
            this.server.close();
            console.log('server closed')
        }
    }
}