import { Listener, Subjects, IRefundCreatedEvent } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class RefundCreatedListener extends Listener<IRefundCreatedEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.REFUND_CREATED

    async onMessage(data: IRefundCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderId)

        if (!order) {
            throw new Error(`Order ${data.orderId} not found`)
        }

        await order.set({ refundId: data.refundId }).save()
        msg.ack()
    }
}