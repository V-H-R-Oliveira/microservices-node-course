import { ValidationError } from "express-validator"
import { validationErrorFormatter } from "../utils/utils"
import CustomError from "./customError"

export default class RequestValidationError extends CustomError {
    constructor(private errors: ValidationError[]) {
        super("invalid request parameters", 400)
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    formatError() {
        return {
            statusCode: this._statusCode,
            errors: this.errors.map(validationErrorFormatter.bind(this))
        }
    }
}