import { JwtPayload } from "jsonwebtoken"

export interface IUserPayload extends JwtPayload {
    id: string
    email: string
}

declare module "express" {
    export interface Request {
        _currentUser?: IUserPayload | null
    }
}
