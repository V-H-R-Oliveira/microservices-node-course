import { Publisher, Subjects, IPaymentCreated } from "@vhr_gittix/common-lib"

export default class PaymentCreatedPublisher extends Publisher<IPaymentCreated> {
    readonly subject = Subjects.PAYMENT_CREATED
}