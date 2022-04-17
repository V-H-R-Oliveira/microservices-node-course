import { Publisher, Subjects, IExpirationCompleteEvent } from "@vhr_gittix/common-lib"

export default class ExpirationCompletePublisher extends Publisher<IExpirationCompleteEvent> {
    readonly subject = Subjects.EXPIRATION_COMPLETE
}