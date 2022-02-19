import process from "process"
import { NextFunction, Response, Request } from "express"
import { verify } from "jsonwebtoken"
import { IUserPayload } from "./IToken"
import AuthError from "../errors/AuthError"

export const decodeTokenHandler = (req: Request, _res: Response, next: NextFunction) => {
    if (!req.session?.isPopulated) {
        throw new AuthError("Authentication information not present")
    }

    const jwtToken = req.session?.jwt

    if (!jwtToken) {
        throw new AuthError("Invalid token")
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const decodedToken = verify(jwtToken, process.env.JWT_KEY!) as IUserPayload
        req._currentUser = decodedToken
    } catch (err) {
        console.error("Failed to verify auth due error:", err)
        req._currentUser = null
    } finally {
        next()
    }
}