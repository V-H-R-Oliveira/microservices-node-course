import { Listener, Subjects, IExpirationCompleteEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import OrderCancelledPublisher from "../publishers/orderCancelled"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class ExpirationCompleteListener extends Listener<IExpirationCompleteEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.EXPIRATION_COMPLETE

    async onMessage(data: IExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId).populate("ticket")

        if (!order) {
            throw new Error(`Order ${data.orderId} not found`)
        }

        if (order.status == OrderStatus.COMPLETE) {
            return msg.ack()
        }

        await order.set({ status: OrderStatus.CANCELLED }).save()

        const orderCancelledPublisher = new OrderCancelledPublisher(this.client)

        await orderCancelledPublisher.publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()
    }
}