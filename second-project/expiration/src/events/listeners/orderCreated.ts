import { Message } from "node-nats-streaming"
import { Listener, Subjects, IOrderCreatedEvent } from "@vhr_gittix/common-lib"
import { QUEUE_GROUP_NAME } from "./queueGroupName"
import { expirationQueue } from "../../queues/expirationQueue"

export default class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_CREATED

    async onMessage(data: IOrderCreatedEvent["data"], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - Date.now()
        console.info(`Waiting ${delay} ms to process the job`)

        await expirationQueue.add({ orderId: data.id }, { delay, jobId: data.id })
        msg.ack()
    }
}