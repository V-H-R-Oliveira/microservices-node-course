import { Publisher, Subjects, ITicketUpdatedEvent } from "@vhr_gittix/common-lib"

export default class TicketUpdatedPublisher extends Publisher<ITicketUpdatedEvent> {
    readonly subject = Subjects.TICKET_UPDATED
}