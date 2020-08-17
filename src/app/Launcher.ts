import { Server } from './Server/Server';

export class Launcher {
    
    private server: Server;

    public constructor() {
        this.server = new Server();
    }
    public launchApp() {
        this.server.startServer();
    }

}

new Launcher().launchApp();