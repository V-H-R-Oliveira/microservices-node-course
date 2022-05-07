import { AuthError, NotFoundError } from "@vhr_gittix/common-lib"
import { Request, Response } from "express"
import { Order } from "../models/order"
import { Refund } from "../models/refund"
import { stripeClient } from "../stripeClient"

const getRefundByOrderIdHandler = async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId != req._currentUser?.id) {
        throw new AuthError("Unauthorized access")
    }

    const refund = await Refund.findOne({ orderId: order.id })

    if (!refund) {
        throw new NotFoundError()
    }

    const stripeRefundData = await stripeClient.refunds.retrieve(refund.refundId)

    const response = {
        amount: stripeRefundData.amount / 100,
        currency: stripeRefundData.currency,
        reason: stripeRefundData.reason,
        created: stripeRefundData.created
    }

    res.json(response)
}

export { getRefundByOrderIdHandler }