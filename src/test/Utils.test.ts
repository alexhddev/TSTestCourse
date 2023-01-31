import { getStringInfo, stringInfo, toUpperCase } from "../app/Utils";


describe('Utils test suite', () => {
    it('should return uppercase', () => {
        // arrange
        const expected = 'SOME_NAME';
        const sut = toUpperCase;
        // act
        const actual = sut('some_name')
        // assert
        expect(actual).toBe(expected);
    });


    describe('getStringInfo for My-String should', ()=>{
        let actual:stringInfo

        beforeEach(()=>{
            actual = getStringInfo('My-String')
        });

        test('return right length', ()=>{
            expect(actual.characters.length).toBe(9)
        });

        test('return right lowerCase', ()=>{
            expect(actual.lowerCase).toBe('my-string');
        });

        test('return right lowerCase', ()=>{
            expect(actual.upperCase).toBe('MY-STRING');
        });

        test('return right characters', ()=>{
            expect(actual.characters).toEqual(['M', 'y', '-','S', 't', 'r','i', 'n', 'g']);
            expect(actual.characters).toEqual(expect.arrayContaining(['t', 'r','i', 'n', 'g','M', 'y', '-','S']))
        });

        test('contain M in characters', ()=>{
            expect(actual.characters).toContain<string>('M');
        });

        test('return defined extra info', ()=>{
            expect(actual.extraInfo).toBeDefined();
        });

        test('return right extra info', ()=>{
            expect(actual.extraInfo).toEqual({})
        });
    })

    it('should return info for valid string', () => {
        const actual = getStringInfo('My-String');

        expect(actual.lowerCase).toBe('my-string');
        expect(actual.extraInfo).toEqual({});

        expect(actual.characters).toEqual(['M', 'y', '-','S', 't', 'r','i', 'n', 'g']);
        
        expect(actual.characters).toEqual(expect.arrayContaining(['t', 'r','i', 'n', 'g','M', 'y', '-','S']))

        expect(actual.extraInfo).not.toBe(undefined);
        expect(actual.extraInfo).toBeDefined();
        expect(actual.extraInfo).toBeTruthy();
    })
});