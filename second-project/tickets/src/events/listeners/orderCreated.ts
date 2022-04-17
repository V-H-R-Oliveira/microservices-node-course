import { Message } from "node-nats-streaming"
import { Listener, Subjects, IOrderCreatedEvent } from "@vhr_gittix/common-lib"
import TicketUpdatedPublisher from "../publishers/ticketUpdated"
import { QUEUE_GROUP_NAME } from "./queueGroupName"
import { Ticket } from "../../models/ticket"

export default class OrderCreatedListener extends Listener<IOrderCreatedEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_CREATED

    async onMessage(data: IOrderCreatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if (!ticket) {
            throw new Error(`Ticket(${data.ticket.id}) not found`)
        }

        await ticket.set({ orderId: data.id }).save()

        const publisher = new TicketUpdatedPublisher(this.client)

        await publisher.publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })

        msg.ack()
    }
}