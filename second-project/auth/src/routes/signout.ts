import { RequestHandler } from "express"

export const signOutHandler: RequestHandler = (req, res) => {
    res.sendStatus(200)
}