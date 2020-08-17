import { ServerResponse, IncomingMessage } from 'http';
import { TokenValidator, HTTP_METHODS, HTTP_CODES, AccessRight } from '../Models/ServerModels';
import { Utils } from '../Utils/Utils';
import { UsersDBAccess } from '../Data/UsersDBAccess';

export class DataHandler {

    private request: IncomingMessage;
    private response: ServerResponse;
    private tokenValidator: TokenValidator;
    private usersDBAccess: UsersDBAccess;

    public constructor(request: IncomingMessage, response: ServerResponse, tokenValidator: TokenValidator, usersDBAccess: UsersDBAccess) {
        this.request = request;
        this.response = response;
        this.tokenValidator = tokenValidator;
        this.usersDBAccess = usersDBAccess;
    }

    public async handleRequest() {
        switch (this.request.method) {
            case HTTP_METHODS.OPTIONS:
                await this.handleOptions();
                break;
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            default:
                break;
        }
    }

    private async handleOptions() {
        this.response.writeHead(HTTP_CODES.OK);
    }

    private async handleGet() {
        try {
            const operationAuthorized = await this.operationAuthorized(AccessRight.READ);
            if (operationAuthorized) {
                const parsedUrl = Utils.parseUrl(this.request.url!);
                if (parsedUrl.query.name) {
                    const users = await this.usersDBAccess.getUsersByName(parsedUrl.query.name as string);
                    this.response.writeHead(HTTP_CODES.OK, { 'Content-Type': 'application/json' });
                    this.response.write(JSON.stringify(users));
                } else {
                    this.response.statusCode = HTTP_CODES.BAD_REQUEST;
                    this.response.write('Missing name parameter in the request!');
                }
            } else {
                this.response.statusCode = HTTP_CODES.UNAUTHORIZED;
                this.response.write('Unauthorized operation!');
            }
        } catch (error) {
            this.response.statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
            this.response.write('Internal error: ' + error.message);
        }
    }

    private async operationAuthorized(operation: AccessRight): Promise<boolean> {
        const tokenId = this.request.headers.authorization;
        if (tokenId) {
            const tokenRights = await this.tokenValidator.validateToken(tokenId);
            if (tokenRights.accessRights.includes(operation)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    }
}