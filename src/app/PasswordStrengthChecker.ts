

export type checkResult = {
    valid: boolean,
    errorMessage?: string
}

export class PasswordStrengthChecker {

    public checkPassword(password: string): checkResult {
        try {
            return {
                valid: this.isLongEnough(password) &&
                        this.hasLowerCase(password) &&
                        this.hasUpperCase(password)
            }
        } catch (error) {
            return {
                valid: false,
                errorMessage: error.message
            }
        }
    }

    private isLongEnough(password: string){
        if (password.length > 8) {
            return true;
        };
        throw new Error("Password must be at least 8 chars long!");    
    }

    private hasUpperCase(password: string){
        if (password != password.toLowerCase()) {
            return true;
        };
        throw new Error("Password must have an uppercase letter!");          
    }

    private hasLowerCase(password: string){
        if (password != password.toUpperCase()) {
            return true;
        };
        throw new Error("Password must have a lowercase letter!");        
    }
}