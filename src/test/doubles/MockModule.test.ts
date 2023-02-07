jest.mock('../../app/doubles/StringUtils', ()=>({
    ...jest.requireActual('../../app/doubles/StringUtils'), 
    calculateComplexity: ()=>{return 10;}
}));

jest.mock('uuid', ()=>({
    v4: ()=>'123'
}));

import * as StringUtils from '../../app/doubles/StringUtils';

describe('modules tests', () => {

    test('some module', () => {
       const result =  StringUtils.calculateComplexity({}as any);
       console.log(result);
    })

    test('kept other functions', ()=>{
        const actual = StringUtils.toUpperCase('abc');
        expect(actual).toBe('ABC');
    })

    test('string with id functions', ()=>{
        const actual = StringUtils.toLowerCaseWithId('ABC')
        expect(actual).toBe('abc123');
    })


})