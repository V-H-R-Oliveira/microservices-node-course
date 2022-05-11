import { Message } from "node-nats-streaming"
import { Listener, Subjects, IOrderCancelledEvent } from "@vhr_gittix/common-lib"
import { QUEUE_GROUP_NAME } from "./queueGroupName"
import { expirationQueue } from "../../queues/expirationQueue"

export default class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_CANCELLED

    async onMessage(data: IOrderCancelledEvent["data"], msg: Message) {
        const job = await expirationQueue.getJob(data.id)

        if (job) {
            await job.remove()
        }

        msg.ack()
    }
}