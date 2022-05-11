import { Listener, Subjects, ITicketUpdatedEvent } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../models/ticket"
import { QUEUE_GROUP_NAME } from "./queueGroupName"

export default class TicketUpdatedListener extends Listener<ITicketUpdatedEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.TICKET_UPDATED

    async onMessage(data: ITicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findByIdAndPreviousVersion({ id: data.id, version: data.version })

        if (!ticket) {
            throw new Error("Ticket not found")
        }

        await ticket.set({ title: data.title, price: data.price }).save()
        msg.ack()
    }
}