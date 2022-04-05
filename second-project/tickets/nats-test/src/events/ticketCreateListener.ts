import { Message } from "node-nats-streaming"
import { Listener } from "./baseListener"
import { ITicketCreatedEvent } from "./ITicketCreated"
import { Subjects } from "./subjects"

export class TicketCreatedListener extends Listener<ITicketCreatedEvent> {
    readonly subject = Subjects.TICKED_CREATED
    queueGroupName = "payments-service"

    onMessage(data: ITicketCreatedEvent['data'], msg: Message): void {
        console.log("Event data:", data.id, data.title, data.price)
        msg.ack()
    }
}