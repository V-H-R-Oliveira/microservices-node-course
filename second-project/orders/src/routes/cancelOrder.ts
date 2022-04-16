import { Request, Response } from "express"
import { AuthError, NotFoundError, OrderStatus } from "@vhr_gittix/common-lib"
import { Order } from "../models/order"
import OrderCancelledPublisher from "../events/publishers/orderCancelled"
import { stan } from "../natsClient"

const cancelOrderHandler = async(req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate("ticket")

    if (!order) {
        throw new NotFoundError()
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (order.userId != req._currentUser!.id!) {
        throw new AuthError("Cannot access other user orders")
    }

    order.status = OrderStatus.CANCELLED
    await order.save()

    const publisher = new OrderCancelledPublisher(stan.client)

    publisher.publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    })

    res.json(order)
}

export { cancelOrderHandler }