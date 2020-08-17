import { UrlWithParsedQuery, parse } from "url";
import { IncomingMessage } from "http";


export class Utils {


    public static parseUrl(url: string): UrlWithParsedQuery {
        if (!url) {
            throw new Error('Empty url!');

        }
        return parse(url, true);
    }

    // Dummy object test example
    public static getRequestBasePath(req: IncomingMessage): string {
        const url = req.url;
        if (url) {
            const parsedUrl = this.parseUrl(url);
            if (parsedUrl.pathname) {
                return parsedUrl.pathname.split('/')[1];
            } else {
                return ''
            }
        } else {
            return '';
        }
    }

    public static async getRequestBody(request: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';
            request.on('data', (data: string) => {
                body += data;
            });
            request.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (jsonError) {
                    reject(jsonError)
                }
            });
            request.on('error', (error: any) => {
                reject(error)
            });
        });
    }

}