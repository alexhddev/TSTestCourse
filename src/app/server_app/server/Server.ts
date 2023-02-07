import { createServer, Server as NodeServer } from 'http'

export class Server {

    private server: NodeServer;

    public startServer() {
        this.server = createServer(async (req, res) => {
            console.log(`Got request from ${req.headers['user-agent']}`);
            res.end();
        }).listen(8080);
        console.log('server started')
    }

    public stopServer() {
        if(this.server) {
            this.server.close();
            console.log('server closed')
        }
    }
}