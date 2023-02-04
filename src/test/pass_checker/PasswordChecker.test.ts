import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker"


describe('PasswordChecker test suite', () => {

    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    })

    it('Password with less than 8 chars is invalid', () => {
        const actual = sut.checkPassword('1234567');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.SHORT);
    });

    it('Password with more than 8 chars is ok', () => {
        const actual = sut.checkPassword('12345678');
        expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
    });

    it('Password with no upper case letter is invalid', () => {
        const actual = sut.checkPassword('abcd');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE)
    });

    it('Password with upper case letter is valid', () => {
        const actual = sut.checkPassword('abcD');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE)
    });

    it('Password with no lower case letter is invalid', () => {
        const actual = sut.checkPassword('ABCD');
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE)
    });

    it('Password with lower case letter is valid', () => {
        const actual = sut.checkPassword('ABCDa');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE)
    });

    it('Complex password is valid', () => {
        const actual = sut.checkPassword('1234abcD');
        expect(actual.reasons).toHaveLength(0);
        expect(actual.valid).toBe(true);
    });

    it('Admin password with no number is invalid', () => {
        const actual = sut.checkAdminPassword('abcdABCD')
        expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER)
        expect(actual.valid).toBe(false);
    });

    it('Admin password with number is valid', () => {
        const actual = sut.checkAdminPassword('abcdABCD7')
        expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER)
    });


})