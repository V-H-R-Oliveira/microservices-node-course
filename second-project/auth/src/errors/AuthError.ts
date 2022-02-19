import CustomError from "./customError"

export default class AuthError extends CustomError {
    constructor(private errorMessage: string) {
        super(errorMessage, 401)
        Object.setPrototypeOf(this, AuthError.prototype)
    }

    formatError() {
        return {
            statusCode: this._statusCode,
            errors: [
                {
                    message: this.errorMessage
                }
            ]
        }
    }
}