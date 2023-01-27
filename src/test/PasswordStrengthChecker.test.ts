import { checkResult, PasswordStrengthChecker } from "../app/PasswordStrengthChecker";




describe('PasswordStrengthChecker test suite', ()=>{

    describe('normal user', ()=>{

        let sut: PasswordStrengthChecker;

        beforeEach(()=>{
            sut = new PasswordStrengthChecker();
        })

        it('password with more than 8 chars is valid', ()=>{
            const expected:checkResult = {
                valid: true
            }
            const input = 'myPassword';

            const actual = sut.checkPassword(input);

            expect(actual).toEqual(expected);
        });

        it('password with less than 8 chars is invalid', ()=>{
            const expected:checkResult = {
                valid: false
            }
            const input = 'myPass';

            const actual = sut.checkPassword(input);

            expect(actual).toEqual(expected);
        });



    });
});