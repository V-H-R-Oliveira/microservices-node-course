import process from "process"
import { ValidationError } from "express-validator"
import { sign, SignOptions } from "jsonwebtoken"
import CustomError from "../errors/customError"
import { IError } from "../errors/IError"

const validationErrorFormatter = ({ msg, param }: ValidationError): IError => {
    return {
        message: msg,
        field: param
    }
}

const isCustomError = (error: Error): error is CustomError => {
    return "formatError" in error
}

const createToken = (payload: object, jwtOptions: SignOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sign(payload, process.env.JWT_KEY!, jwtOptions)
}

const isProd = () => !!(process.env?.NODE_ENV && process.env.NODE_ENV != "test")

export { validationErrorFormatter, isCustomError, createToken, isProd }