import { AuthError, NotFoundError } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import { Ticket } from "../models/ticket"

export const updateTicketByIdHandler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    if (ticket?.userId != req._currentUser?.id) {
        throw new AuthError("Unauthorized update")
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    await ticket.save()
    return res.json(ticket)
}