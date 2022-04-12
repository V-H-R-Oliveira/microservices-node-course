import { Publisher, Subjects, IOrderCreatedEvent } from "@vhr_gittix/common-lib"

export default class OrderCreatedPublisher extends Publisher<IOrderCreatedEvent> {
    readonly subject = Subjects.ORDER_CREATED
}