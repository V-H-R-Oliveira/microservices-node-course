import { describe, test, expect, jest } from "@jest/globals"
import { IOrderCompleteEvent } from "@vhr_gittix/common-lib"
import { Message } from "node-nats-streaming"
import { stan } from "../../../natsClient"
import OrderCompletedListener from "../orderCompleted"

describe("Testing Order Completed Listener", () => {

    const listenerSetup = () => {
        const listener = new OrderCompletedListener(stan.client)
        const dateNow = new Date()
        const delay = 10 / 60

        dateNow.setSeconds(dateNow.getSeconds() + delay)

        const data: IOrderCompleteEvent["data"] = {
            id: "1234",
            version: 0
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