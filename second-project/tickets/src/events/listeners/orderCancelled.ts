import { Message } from "node-nats-streaming"
import { Listener, Subjects, IOrderCancelledEvent } from "@vhr_gittix/common-lib"
import TicketUpdatedPublisher from "../publishers/ticketUpdated"
import { QUEUE_GROUP_NAME } from "./queueGroupName"
import { Ticket } from "../../models/ticket"

export default class OrderCancelledListener extends Listener<IOrderCancelledEvent> {
    readonly queueGroupName = QUEUE_GROUP_NAME
    readonly subject = Subjects.ORDER_CANCELLED

    async onMessage(data: IOrderCancelledEvent["data"], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if (!ticket) {
            throw new Error(`Ticket(${data.ticket.id}) not found`)
        }

        await ticket.set({ orderId: undefined }).save()

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