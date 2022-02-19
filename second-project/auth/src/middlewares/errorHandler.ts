import { ErrorRequestHandler } from "express"
import { isCustomError } from "../utils/utils"

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (isCustomError(err)) {
        const { statusCode, errors } = err.formatError()
        return res.status(statusCode).json({ errors })
    }

    next(err)
}