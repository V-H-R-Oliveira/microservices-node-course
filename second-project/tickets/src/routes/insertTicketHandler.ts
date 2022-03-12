import { Request, Response } from "express"
import { Ticket } from "../models/ticket"

export const insertTicketHandler = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ticket = Ticket.build({ userId: req._currentUser!.id!, ...req.body })
    await ticket.save()
    res.status(201).json(ticket)
}