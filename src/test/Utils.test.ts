import { getStringInfo, stringInfo, StringUtils, toUpperCase } from "../app/Utils";


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

    describe.only('StringUtils tests', ()=>{
        let sut: StringUtils;
        beforeEach(()=>{
           sut = new StringUtils(); 
        });

        it('Should throw error on invalid argument - function', ()=>{
            function expectError(){
                sut.getStringInfo('');
            }
            expect(expectError).toThrow();
            expect(expectError).toThrowError('Invalid argument!')
        })

        it('Should throw error on invalid argument - arrow function', ()=>{
            expect(()=>{
                sut.getStringInfo('');
            }).toThrowError('Invalid argument!')
        })

        it.only('Should throw error on invalid argument - try catch block', (done)=>{
            try {
                sut.getStringInfo('');
                done('GetString info for invalid argument should throw error!')
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
                expect(error).toHaveProperty('message', 'Invalid argument!');
            }
        })








    });

    describe('ToUpperCase examples', ()=>{
        it.each([
            {input:'abc', expected: 'ABC'},
            {input:'My-String', expected: 'MY-STRING'}
        ])('$input toUpperCase should be $expected', ({input, expected})=>{
            const actual = toUpperCase(input);
            expect(actual).toBe(expected);
        })
    })


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