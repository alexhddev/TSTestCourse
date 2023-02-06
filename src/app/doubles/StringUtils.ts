

export function toUpperCaseWithCb(arg: string, callback: Function): string {
    if(!arg) {
        callback('Invalid argument');
        return;
    }
    callback(`called function with ${arg}`)
    return arg.toLocaleUpperCase();
}

// realistic scenario:

// function loggingService(arg: string){
//     console.log(arg);
// };

// toUpperCaseWithCb('', loggingService);
// toUpperCaseWithCb('abcd', loggingService);