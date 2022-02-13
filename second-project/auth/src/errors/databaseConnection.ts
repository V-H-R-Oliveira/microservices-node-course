import { ValidationError } from "express-validator"
import CustomError from "./customError"

export default class DatabaseConnectionError extends CustomError {
    constructor(private errors?: ValidationError[]) {
        super("Failed to connect to the database", errors, 500)
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
}