import { get } from 'http';

export async function sampleFunction(url: string) {

    return new Promise(function (resolve, reject) {
        get(url, (response) => {
            let data = '';
            response.on('data', _data => (data += _data));
            response.on('end', () => resolve(data));
        });
    });
}