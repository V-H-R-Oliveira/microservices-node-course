import { Publisher, Subjects, IOrderCancelledEvent } from "@vhr_gittix/common-lib"

export default class OrderCancelledPublisher extends Publisher<IOrderCancelledEvent> {
    readonly subject = Subjects.ORDER_CANCELLED
}