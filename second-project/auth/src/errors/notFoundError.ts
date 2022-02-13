import { ValidationError } from "express-validator"
import CustomError from "./customError"

export default class NotFoundError extends CustomError {
    constructor(private errors?: ValidationError[]) {
        super("route not found", errors, 404)
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    formatError() {
        return {
            statusCode: this._statusCode,
            errors: [
                {
                    message: "Not found"
                }
            ]
        }
    }
}