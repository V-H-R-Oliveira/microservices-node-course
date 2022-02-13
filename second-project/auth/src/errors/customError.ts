import { ValidationError } from "express-validator"
import { IErrorFormat } from "./IErrorFormatter"
import { validationErrorFormatter } from "../utils/utils"

export default class CustomError extends Error implements IErrorFormat {
    constructor(protected _errors: ValidationError[]) {
        super()
        Object.setPrototypeOf(this, CustomError.prototype)
    }

    formatError() {
        return this._errors.map(validationErrorFormatter.bind(this))
    }
}