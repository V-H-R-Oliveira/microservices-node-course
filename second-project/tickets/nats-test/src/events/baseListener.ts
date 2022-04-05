import { Message, Stan } from "node-nats-streaming"
import { IEvent } from "./IEvent"

export abstract class Listener<T extends IEvent> {
    abstract subject: T['subject']
    abstract queueGroupName: string
    abstract onMessage(data: T['data'], msg: Message): void
    protected ackWait = 5000

    constructor(private client: Stan) { }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscriptionOptions = this.subscriptionOptions()
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, subscriptionOptions)

        subscription.on("message", (msg: Message) => {
            console.info(`
                Message received: ${this.subject} / ${this.queueGroupName}
            `)

            const parsedData = this.parseMessage(msg)
            this.onMessage(parsedData, msg)
        })
    }

    parseMessage(msg: Message) {
        const msgData = msg.getData().toString()
        return JSON.parse(msgData)
    }
}