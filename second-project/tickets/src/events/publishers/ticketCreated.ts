import { Publisher, ITicketCreatedEvent, Subjects } from "@vhr_gittix/common-lib"

export default class TicketCreatedPublisher extends Publisher<ITicketCreatedEvent> {
    readonly subject = Subjects.TICKED_CREATED
}