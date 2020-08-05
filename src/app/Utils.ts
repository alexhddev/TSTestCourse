import { UrlWithParsedQuery, parse } from "url";


export class Utils {


    public static parseUrl(url: string): UrlWithParsedQuery {
        if (!url) {
            throw new Error('Empty url!');

        }
        return parse(url, true);
    }

    /* istanbul ignore next */
    public static toUpperCase(arg: string): string {
        return arg.toUpperCase();
    }
}