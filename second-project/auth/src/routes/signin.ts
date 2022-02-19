import { Request, Response } from "express"
import BadRequestError from "../errors/badRequest"
import { User } from "../models/user"
import Password from "../services/password"
import { createToken } from "../utils/utils"

export const signInHandler = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        throw new BadRequestError("User account not found")
    }

    const passwordsMatch = await Password.compare(user.password, req.body.password)

    if (!passwordsMatch) {
        throw new BadRequestError("Invalid credentials")
    }

    const userJwtToken = createToken({
        id: user.id,
        email: user.email
    }, { expiresIn: "24h" })

    req.session = Object.assign({}, req.session, { jwt: userJwtToken })
    res.sendStatus(200)
}