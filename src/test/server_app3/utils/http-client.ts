import { IncomingHttpHeaders, request, RequestOptions } from 'http';

type awesomeRequestResponse = {
    statusCode: number,
    headers: IncomingHttpHeaders,
    body: any
}

export async function makeAwesomeRequest(options: RequestOptions, body?: object): Promise<awesomeRequestResponse> {
    return new Promise((resolve, reject) => {
        const clientRequest = request(options, (incomingMessage) => {
            let response = {
                statusCode: incomingMessage.statusCode,
                headers: incomingMessage.headers,
                body: []
            };
            incomingMessage.on('data', (chunk) => {
                response.body.push(chunk);
            });
            incomingMessage.on('end', () => {
                if (response.body.length) {

                    response.body = response.body.join('') as any;

                    try {
                        response.body = JSON.parse(response.body as any);
                    } catch (error) {
                        console.log(error)
                    }
                }
                resolve(response);
            })
            incomingMessage.on('error', (err) => {
                reject(err);
            });
        });
        clientRequest.on('error', (error) => {
            reject(error);
        });
        clientRequest.setHeader('user-agent', 'AwesomeRequest')
        if (body) {
            clientRequest.write(JSON.stringify(body));
        }
        clientRequest.end();
    });
}