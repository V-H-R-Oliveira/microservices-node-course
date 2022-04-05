import { Subjects } from "./subjects"

export interface ITicketCreatedEvent {
    subject: Subjects.TICKED_CREATED,
    data: {
        id: string,
        title: string,
        price: number
    }
}