import { Listener, Subjects, IPaymentCreated, OrderStatus } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Order } from "../../models/order"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class PaymentCreatedListener extends Listener<IPaymentCreated> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.PAYMENT_CREATED

    async onMessage(data: IPaymentCreated["data"], msg: Message) {
        const order = await Order.findById(data.orderId)

        if (!order) {
            throw new Error(`Order ${data.orderId} not found`)
        }

        await order.set({ status: OrderStatus.COMPLETE }).save()
        msg.ack()
    }
}