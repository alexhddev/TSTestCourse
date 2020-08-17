import { createServer, ServerResponse, IncomingMessage } from 'http';
import { Utils } from '../Utils/Utils';
import { LoginHandler } from '../Handlers/LoginHandler';
import { DataHandler } from '../Handlers/DataHandler';
import { Authorizer } from '../Authorization/Authorizer';
import { UsersDBAccess } from '../Data/UsersDBAccess';

export class Server {

    private authorizer: Authorizer = new Authorizer();
    private usersDBAccess: UsersDBAccess = new UsersDBAccess();

    public startServer() {
        createServer(async (req, res) => {
            const basePath = Utils.getRequestBasePath(req);
            switch (basePath) {
                case 'login':
                    await new LoginHandler(req, res, this.authorizer).handleRequest();
                    break;
                case 'users':
                    await new DataHandler(req, res, this.authorizer, this.usersDBAccess).handleRequest();
                    break;
                default:
                    break;
            }
            res.end();
        }).listen(8080);
        console.log('server started')
    }
}