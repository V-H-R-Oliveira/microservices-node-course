import { RequestHandler } from "express"
import { validationResult } from "express-validator"

import RequestValidationError from "../errors/requestValidation"

export const signUpHandler: RequestHandler = (req, res) => {
    const validationErrors = validationResult(req)

    if (!validationErrors.isEmpty()) {
        throw new RequestValidationError(validationErrors.array())
    }

    res.sendStatus(201)
}