import { Request, Response, NextFunction } from "express"
import { isCustomError } from "../utils/utils"

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {

    if(isCustomError(err)) {
        const { statusCode, errors } = err.formatError()
        return res.status(statusCode).json({ errors })
    }

    next(err)
}