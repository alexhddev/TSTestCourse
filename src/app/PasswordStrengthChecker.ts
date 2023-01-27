

export type checkResult = {
    valid: boolean,
    errorMessage?: string
}

export class PasswordStrengthChecker {

    public checkPassword(password: string): checkResult {
        let valid = false
        if (password.length > 8) {
            valid = true;
        }
        return {
            valid: valid
        }
    }
}