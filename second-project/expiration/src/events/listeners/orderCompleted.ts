import { Message } from "node-nats-streaming"
import { Listener, Subjects, IOrderCompleteEvent } from "@vhr_gittix/common-lib"
import { QUEUE_GROUP_NAME } from "./queueGroupName"
import { expirationQueue } from "../../queues/expirationQueue"

export default class OrderCompletedListener extends Listener<IOrderCompleteEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_COMPLETE

    async onMessage(data: IOrderCompleteEvent["data"], msg: Message) {
        const job = await expirationQueue.getJob(data.id)

        if (job) {
            await job.remove()
        }

        msg.ack()
    }
}