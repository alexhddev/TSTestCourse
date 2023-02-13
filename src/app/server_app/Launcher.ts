/* istanbul ignore file */
import { Server } from "./server/Server";
class Launcher {

    private server = new Server();

    public startServer(){
        this.server.startServer();
    }

    public stopServer(){
        this.server.stopServer();
    }
}

const launcher = new Launcher();
launcher.startServer();

