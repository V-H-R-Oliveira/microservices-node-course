import process from "process"
import { NextFunction, Response, Request } from "express"
import { verify } from "jsonwebtoken"
import { IUserPayload } from "./IToken"

export const decodeTokenHandler = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const jwtToken = req.session?.jwt
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