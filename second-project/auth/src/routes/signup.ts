import { Request, Response } from "express"
import { BadRequestError } from "@vhr_gittix/common-lib"
import { User } from "../models/user"
import { createToken } from "../utils/utils"

export const signUpHandler = async (req: Request, res: Response) => {
    const hasEmail = await User.exists({ email: req.body.email })

    if (hasEmail) {
        throw new BadRequestError("Email already registered")
    }

    const newUser = User.build({ email: req.body.email, password: req.body.password })
    await newUser.save()

    const userJwtToken = createToken({
        id: newUser.id,
        email: newUser.email
    }, { expiresIn: "24h" })

    req.session = Object.assign({}, req.session, { jwt: userJwtToken })
    res.status(201).send(newUser)
}