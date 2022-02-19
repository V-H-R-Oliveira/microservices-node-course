import CustomError from "./customError"

export default class NotFoundError extends CustomError {
    constructor() {
        super("route not found", 404)
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    formatError() {
        return {
            statusCode: this._statusCode,
            errors: [
                {
                    message: "route not found"
                }
            ]
        }
    }
}