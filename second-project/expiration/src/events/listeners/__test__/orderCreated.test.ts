import { describe, test, expect, jest } from "@jest/globals"
import { IOrderCreatedEvent } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { stan } from "../../../natsClient"
import OrderCreatedListener from "../orderCreated"

describe("Testing Ticket Created Listener", () => {

    const listenerSetup = () => {
        const listener = new OrderCreatedListener(stan.client)
        const dateNow = new Date()
        const fiveSeconds = 10 / 60

        dateNow.setSeconds(dateNow.getSeconds() + fiveSeconds)

        const data: IOrderCreatedEvent["data"] = {
            id: "1234",
            userId: "456",
            version: 0,
            expiresAt: dateNow.toISOString(),
            ticket: {
                id: "1222",
                price: 5.67
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should ack the message", async () => {
        const { listener, data, message } = listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toBeCalledTimes(1)
    })
})