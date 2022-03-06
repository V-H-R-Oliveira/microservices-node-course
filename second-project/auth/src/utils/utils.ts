import process from "process"
import { sign, SignOptions } from "jsonwebtoken"

export const createToken = (payload: object, jwtOptions: SignOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return sign(payload, process.env.JWT_KEY!, jwtOptions)
}
