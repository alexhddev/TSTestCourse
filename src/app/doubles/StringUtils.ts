import { v4 } from 'uuid';

export type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}


// example for stubs:
export function calculateComplexity(stringInfo: stringInfo){
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length;
}

type LoggerServiceCallBack = (arg: string) => void;



export function toUpperCaseWithCb(arg: string, callback: LoggerServiceCallBack): string {
    if(!arg) {
        callback('Invalid argument');
        return;
    }
    callback(`called function with ${arg}`)
    return arg.toLocaleUpperCase();
}

export function toUpperCase(arg:string){
    return arg.toUpperCase();
}

export function toLowerCase(arg:string){
    return arg.toLowerCase();
}

export function toLowerCaseWithId(arg:string){
    return arg.toLowerCase() + v4();
}



export class StringUtils {

    private callExternalService(){
        console.log('Calling external service!')
    }

    public toUpperCase(arg:string){
        console.log('Called toUpperCase()')
        return arg.toUpperCase();
    }

    public logString(arg: string){
        console.log(arg);
    }
}

// realistic scenario:

// function loggingService(arg: string){
//     console.log(arg);
// };

// toUpperCaseWithCb('', loggingService);
// toUpperCaseWithCb('abcd', loggingService);