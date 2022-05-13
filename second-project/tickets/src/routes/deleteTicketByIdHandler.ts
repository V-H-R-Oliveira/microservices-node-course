import { AuthError, BadRequestError, NotFoundError } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import { Ticket } from "../models/ticket"

export const deleteTicketByIdHandler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    if (ticket?.userId != req._currentUser?.id) {
        throw new AuthError("Unauthorized update")
    }

    if (ticket.orderId) {
        throw new BadRequestError("Cannot remove the ticket")
    }

    await ticket.delete()
    res.sendStatus(200)
}