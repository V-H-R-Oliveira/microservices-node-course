import { Request, Response } from "express"

export const signOutHandler = (req: Request, res: Response) => {
    req.session = null
    res.sendStatus(200)
}