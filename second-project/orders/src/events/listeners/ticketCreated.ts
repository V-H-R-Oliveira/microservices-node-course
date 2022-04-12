import { Listener, Subjects, ITicketCreatedEvent } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/ticket"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.TICKED_CREATED

    async onMessage(data: ITicketCreatedEvent["data"], msg: Message) {
        await Ticket.build({ title: data.title, price: data.price, originalTicketId: data.id }).save()
        msg.ack()
    }
}