import { toUpperCase } from "../app/Utils";


describe('Utils test suite', ()=>{
    it('should return uppercase', ()=>{

        // arrange
        const expected = 'SOME_NAME';

        // act
        const actual = toUpperCase('some_name')

        // assert
        expect(actual).toBe(expected);
    });
});