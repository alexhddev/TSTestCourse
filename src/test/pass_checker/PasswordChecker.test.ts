import { PasswordChecker } from "../../app/pass_checker/PasswordChecker";



describe('PasswordChecker test suite', ()=>{

    let sut:PasswordChecker;

    beforeEach(()=>{
        sut = new PasswordChecker(); 
    })

    test('PasswordChecker initial test', ()=>{
        sut.checkPassword('');
    })

});