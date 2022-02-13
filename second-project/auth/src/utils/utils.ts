import { ValidationError } from "express-validator"
import { IError, IErrorFormat } from "../errors/IErrorFormatter"

const validationErrorFormatter = ({ msg, param }: ValidationError): IError => {
    return {
        message: msg,
        field: param
    }
}

const isIErrorFormatter = (error: Error|IErrorFormat): error is IErrorFormat => {
    return "formatError" in error
}

export { validationErrorFormatter, isIErrorFormatter }