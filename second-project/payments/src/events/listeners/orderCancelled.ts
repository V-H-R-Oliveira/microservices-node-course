import { Listener, Subjects, IOrderCancelledEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
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

        // publish an awaiting-payment event

        msg.ack()
    }
}