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

    it('should return info for valid string', () => {
        const actual = getStringInfo('My-String');

        expect(actual.lowerCase).toBe('my-string');
        expect(actual.extraInfo).toEqual({});

        expect(actual.characters.length).toBe(9)
        expect(actual.characters).toHaveLength(9);

        expect(actual.characters).toEqual(['M', 'y', '-','S', 't', 'r','i', 'n', 'g']);
        expect(actual.characters).toContain<string>('M');
        expect(actual.characters).toEqual(expect.arrayContaining(['t', 'r','i', 'n', 'g','M', 'y', '-','S']))

        expect(actual.extraInfo).not.toBe(undefined);
        expect(actual.extraInfo).toBeDefined();
        expect(actual.extraInfo).toBeTruthy();
    })
});