import { ValidationError } from "express-validator"
import { IError, IErrorFormatter } from "../errors/IErrorFormatter"

const validationErrorFormatter = ({ msg, param }: ValidationError): IError => {
    return {
        message: msg,
        field: param
    }
}

const isCustomError = (error: Error|IErrorFormatter): error is IErrorFormatter => {
    return "formatError" in error
}

export { validationErrorFormatter, isCustomError }