import CustomError from "./customError"

export default class BadRequestError extends CustomError {
    constructor(private errorMessage: string) {
        super(errorMessage, 400)
        Object.setPrototypeOf(this, BadRequestError.prototype)
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