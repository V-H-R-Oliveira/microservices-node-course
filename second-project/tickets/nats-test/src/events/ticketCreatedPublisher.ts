import { Publisher } from "./basePublisher"
import { ITicketCreatedEvent } from "./ITicketCreated"
import { Subjects } from "./subjects"

export class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
    readonly subject = Subjects.TICKED_CREATED
}