import { PasswordChecker } from "../../app/pass_checker/PasswordChecker"


describe('PasswordChecker test suite', () => {

    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    })

    it('Password with less than 8 chars is invalid', () => {
        const actual = sut.checkPassword('1234567');
        expect(actual).toBe(false);
    });

    it('Password with more than 8 chars is ok', () => {
        const actual = sut.checkPassword('12345678Aa');
        expect(actual).toBe(true);
    });

    it('Password with no upper case letter is invalid', () => {
        const actual = sut.checkPassword('1234abcd');
        expect(actual).toBe(false);
    });

    it('Password with upper case letter is valid', () => {
        const actual = sut.checkPassword('1234abcdA');
        expect(actual).toBe(true);
    });

    it('Password with no lower case letter is invalid', () => {
        const actual = sut.checkPassword('1234ABCD');
        expect(actual).toBe(false);
    });

    it('Password with lower case letter is valid', () => {
        const actual = sut.checkPassword('1234ABCDa');
        expect(actual).toBe(true);
    });


})