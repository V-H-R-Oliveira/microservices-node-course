import { ValidationError } from "express-validator"
import CustomError from "./customError"

export default class RequestValidationError extends CustomError {
    constructor(private errors: ValidationError[]) {
        super(errors)
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }
}