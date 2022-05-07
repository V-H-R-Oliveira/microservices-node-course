import { Publisher, Subjects, IRefundCreatedEvent } from "@vhr_gittix/common-lib"

export default class RefundCreatedPublisher extends Publisher<IRefundCreatedEvent> {
    readonly subject = Subjects.REFUND_CREATED
}