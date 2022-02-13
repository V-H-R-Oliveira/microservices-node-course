import { ValidationError } from "express-validator"
import { IErrorFormatter } from "./IErrorFormatter"
import { validationErrorFormatter } from "../utils/utils"

export default abstract class CustomError extends Error implements IErrorFormatter {
    constructor(public message: string, protected _errors: ValidationError[] = [], protected _statusCode: number) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    formatError() {
        return {
            errors: this._errors.map(validationErrorFormatter.bind(this)),
            statusCode: this._statusCode
        }
    }
}