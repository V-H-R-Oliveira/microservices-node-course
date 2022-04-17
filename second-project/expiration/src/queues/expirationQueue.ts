import process from "process"
import Queue from "bull"
import ExpirationCompletePublisher from "../events/publishers/expirationComplete"
import { stan } from "../natsClient"

interface IJobPayload {
    orderId: string
}

export const expirationQueue = new Queue<IJobPayload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {
    const publisher = new ExpirationCompletePublisher(stan.client)

    await publisher.publish({
        orderId: job.data.orderId
    })
})