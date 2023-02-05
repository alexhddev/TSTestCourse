import { PasswordChecker, PasswordErrors } from "../../app/pass_checker/PasswordChecker";



describe('PasswordChecker test suite', () => {

    let sut: PasswordChecker;

    beforeEach(() => {
        sut = new PasswordChecker();
    })

    test('Password with less than 8 chars is invalid', () => {
        const actual = sut.checkPassword('1234567');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.SHORT);
    });

    test('Password with more than 8 chars is ok', () => {
        const actual = sut.checkPassword('12345678');
        expect(actual.reasons).not.toContain(PasswordErrors.SHORT);
    });

    test('Password with no lower case is invalid', () => {
        const actual = sut.checkPassword('ABCD');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_LOWER_CASE);
    });

    test('Password with lower case is ok', () => {
        const actual = sut.checkPassword('aBCD');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_LOWER_CASE);
    });

    test('Password with no upper case is invalid', () => {
        const actual = sut.checkPassword('abcd');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_UPPER_CASE);
    });

    test('Password with upper case is ok', () => {
        const actual = sut.checkPassword('abcD');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_UPPER_CASE);
    });

    test('abcdDEF! is VALID', () => {
        const actual = sut.checkPassword('abcdDEF!');
        expect(actual.reasons).toHaveLength(0);
        expect(actual.valid).toBe(true);
    });

    test('Admin password with no number case is invalid', () => {
        const actual = sut.checkAdminPassword('abcdDEF!');
        expect(actual.valid).toBe(false);
        expect(actual.reasons).toContain(PasswordErrors.NO_NUMBER);
    });

    test('Admin password with number case is valid', () => {
        const actual = sut.checkAdminPassword('abcdDEF!1');
        expect(actual.reasons).not.toContain(PasswordErrors.NO_NUMBER);
    });





});