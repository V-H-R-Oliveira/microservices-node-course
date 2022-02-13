import { ValidationError } from "express-validator"
import CustomError from "./customError"

export default class DatabaseConnectionError extends CustomError {
    constructor(private errors: ValidationError[]) {
        super(errors)
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
}