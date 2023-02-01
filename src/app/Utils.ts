

export type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}

export function toUpperCase(arg: string){
    return arg.toUpperCase();
}

export function getStringInfo(arg:string):stringInfo {
    return {
        lowerCase: arg.toLowerCase(),
        upperCase: arg.toUpperCase(),
        characters: Array.from(arg),
        length: arg.length,
        extraInfo: {}
    }
}

export class StringUtils {
    public getStringInfo(arg:string):stringInfo {
        if(!arg) {
            throw new Error('Invalid argument!');            
        }
        return getStringInfo(arg);
    }
}