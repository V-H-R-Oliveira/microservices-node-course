import { Response, Request } from "express"

export const currentUserHandler = (req: Request, res: Response) => {
    res.json(req._currentUser)
}