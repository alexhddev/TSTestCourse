export type stringInfo = {
    lowerCase: string,
    upperCase: string,
    characters: string[],
    length: number,
    extraInfo: Object | undefined
}

export function calculateComplexity(stringInfo: stringInfo){
    return Object.keys(stringInfo.extraInfo).length * stringInfo.length
}

