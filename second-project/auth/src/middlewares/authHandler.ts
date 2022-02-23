import { NextFunction, Request, Response } from "express"
import AuthError from "../errors/AuthError"

export const authHandler = (req: Request, _res: Response, next: NextFunction) => {
    if (req._currentUser) {
        return next()
    }

    throw new AuthError("Unauthorized access")
}