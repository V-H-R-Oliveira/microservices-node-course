import { Listener, Subjects, IOrderCancelledEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { Payment } from "../../models/payment"
import { Refund } from "../../models/refund"
import { stan } from "../../natsClient"
import { stripeClient } from "../../stripeClient"
import RefundCreatedPublisher from "../publishers/refundCreated"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_CANCELLED

    async onMessage(data: IOrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findByIdAndPreviousVersion({ id: data.id, version: data.version })

        if (!order) {
            throw new Error(`Order ${data.id} not found`)
        }

        await order.set({ status: OrderStatus.CANCELLED }).save()
        const payment = await Payment.findOne({ orderId: order.id })

        if (payment) {
            const refund = await stripeClient.refunds.create({
                charge: payment.chargeId,
                reason: "requested_by_customer"
            })

            await Refund.build({
                orderId: order.id,
                refundId: refund.id
            }).save()

            const publisher = new RefundCreatedPublisher(stan.client)

            await publisher.publish({
                orderId: order.id,
                refundId: refund.id
            })
        }

        msg.ack()
    }
}