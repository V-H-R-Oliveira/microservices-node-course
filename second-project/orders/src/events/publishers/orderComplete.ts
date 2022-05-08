import { Publisher, Subjects, IOrderCompleteEvent } from "@vhr_gittix/common-lib"

export default class OrderCompletePublisher extends Publisher<IOrderCompleteEvent> {
    readonly subject = Subjects.ORDER_COMPLETE
}