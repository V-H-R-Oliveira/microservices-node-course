import { RequestHandler } from "express"

export const currentUserHandler: RequestHandler = (req, res) => {
    res.sendStatus(200)
}