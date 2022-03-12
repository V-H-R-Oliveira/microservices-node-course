import { Request, Response } from "express"
import { Ticket } from "../models/ticket"

export const getAllTicketsHandler = async (_req: Request, res: Response) => {
    const tickets = await Ticket.find({})
    res.json({ tickets })
}