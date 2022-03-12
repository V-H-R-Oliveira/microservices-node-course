import { NotFoundError } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import { Ticket } from "../models/ticket"

export const getTicketByIdHandler = async (req: Request, res: Response) => {

    const ticket = await Ticket.findById(req.params.id)

    if (ticket) {
        return res.json(ticket)
    }

    throw new NotFoundError()
}