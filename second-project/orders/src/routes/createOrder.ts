import { BadRequestError, NotFoundError, OrderStatus } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import { Ticket } from "../models/ticket"
import { Order } from "../models/order"
import OrderCreatedPublisher from "../events/publishers/orderCreated"
import { stan } from "../natsClient"
import { EXPIRATION_WINDOW_SECONDS } from "../constants"

const createOrderHandler = async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.body.ticketId)

    if (!ticket) {
        throw new NotFoundError()
    }

    const isTicketReserved = await ticket.isReserved()

    if (isTicketReserved) {
        throw new BadRequestError("Ticket is already reserved")
    }

    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = await Order.build({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        userId: req._currentUser!.id!,
        status: OrderStatus.CREATED,
        expiresAt,
        ticket
    }).save()

    const publisher = new OrderCreatedPublisher(stan.client)

    publisher.publish({
        id: order.id,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        version: order.version,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
        }
    })

    res.status(201).json(order)
}

export { createOrderHandler }