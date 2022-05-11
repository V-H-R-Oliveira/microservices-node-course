import { AuthError, BadRequestError, NotFoundError, OrderStatus } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import PaymentCreatedPublisher from "../events/publishers/paymentCreated"
import { Order } from "../models/order"
import { Payment } from "../models/payment"
import { stan } from "../natsClient"
import { stripeClient } from "../stripeClient"

const createChargeHandler = async (req: Request, res: Response) => {
    const order = await Order.findById(req.body.orderId)

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId != req._currentUser?.id) {
        throw new AuthError("Unauthorized access")
    }

    if (order.status == OrderStatus.CANCELLED || order.status == OrderStatus.COMPLETE) {
        throw new BadRequestError("Cannot pay the order")
    }

    const charge = await stripeClient.charges.create({
        currency: "usd",
        amount: order.price * 100, // convert to cents
        source: req.body.token
    })

    const payment = await Payment.build({
        orderId: order.id,
        chargeId: charge.id
    }).save()

    const paymentCreatedPublisher = new PaymentCreatedPublisher(stan.client)
    await paymentCreatedPublisher.publish({
        id: payment.id,
        chargeId: payment.chargeId,
        orderId: payment.orderId
    })

    res.status(201).json({ id: payment.id })
}

export { createChargeHandler }