import { RequestHandler } from "express"
import { validationResult } from "express-validator"
import RequestValidationError from "../errors/requestValidation"

export const validateRequestHandler: RequestHandler = (req, _res, next) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        throw new RequestValidationError(validationErrors.array())
    }

    next()
}