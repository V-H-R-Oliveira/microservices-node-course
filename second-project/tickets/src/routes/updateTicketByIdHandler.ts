import { AuthError, BadRequestError, NotFoundError } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import TicketUpdatedPublisher from "../events/publishers/ticketUpdated"
import { Ticket } from "../models/ticket"
import { stan } from "../natsClient"

export const updateTicketByIdHandler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        throw new NotFoundError()
    }

    if (ticket.orderId) {
        throw new BadRequestError("Cannot edit ticket")
    }

    if (ticket?.userId != req._currentUser?.id) {
        throw new AuthError("Unauthorized update")
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    })

    await ticket.save()

    const publisher = new TicketUpdatedPublisher(stan.client)

    publisher.publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })

    return res.json(ticket)
}