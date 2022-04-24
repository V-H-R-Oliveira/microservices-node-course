import { Listener, Subjects, IOrderCreatedEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_CREATED

    async onMessage(data: IOrderCreatedEvent["data"], msg: Message) {
        await Order.build({
            originalOrderId: data.id,
            price: data.ticket.price,
            status: OrderStatus.CREATED,
            userId: data.userId
        }).save()

        // publish an awaiting-payment event

        msg.ack()
    }
}