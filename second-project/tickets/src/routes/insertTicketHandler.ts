import { Request, Response } from "express"
import TicketCreatedPublisher from "../events/publishers/ticketCreated"
import { Ticket } from "../models/ticket"
import { stan } from "../natsClient"

export const insertTicketHandler = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ticket = Ticket.build({ userId: req._currentUser!.id!, ...req.body })
    await ticket.save()

    const publisher = new TicketCreatedPublisher(stan.client)

    publisher.publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })

    res.status(201).json(ticket)
}