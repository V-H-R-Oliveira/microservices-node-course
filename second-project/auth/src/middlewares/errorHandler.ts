import { Request, Response, NextFunction } from "express"
import { isIErrorFormatter } from "../utils/utils"

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {

    if (isIErrorFormatter(err)) {
        return res.status(500).json({ error: err.formatError() })
    }

    next(err)
}