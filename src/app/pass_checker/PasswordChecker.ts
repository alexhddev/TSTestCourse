

export enum PasswordErrors {
    SHORT = 'Password is too short!',
    NO_UPPER_CASE = 'Upper case letter required!',
    NO_LOWER_CASE = 'Lower case letter required!'
}


export interface CheckResult {
    valid: boolean,
    reasons: PasswordErrors[]
}

export class PasswordChecker {

    public checkPassword(password: string): CheckResult{
        const reasons:PasswordErrors[] = [];

        if(password.length < 8) {
            reasons.push(PasswordErrors.SHORT);
        }
        if (password == password.toLowerCase()) {
            reasons.push(PasswordErrors.NO_UPPER_CASE);
        }
        if (password == password.toUpperCase()) {
            reasons.push(PasswordErrors.NO_LOWER_CASE);
        }
        return {
            valid: reasons.length > 0 ? false : true,
            reasons: reasons
        };        
    }
}