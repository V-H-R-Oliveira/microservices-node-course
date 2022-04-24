import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { IOrderCreatedEvent } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import OrderCreatedListener from "../orderCreated"
import { Order } from "../../../models/order"

describe("Testing Order Created Listener", () => {

    const listenerSetup = () => {
        const listener = new OrderCreatedListener(stan.client)

        const data: IOrderCreatedEvent["data"] = {
            id: new Types.ObjectId().toString(),
            userId: new Types.ObjectId().toString(),
            version: 0,
            expiresAt: Date.now().toString(),
            ticket: {
                id: new Types.ObjectId().toString(),
                price: 156
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should replicate the order", async () => {
        const { listener, data, message } = listenerSetup()
        await listener.onMessage(data, message)
        const order = await Order.findById(data.id)
        expect(order).not.toBeNull()
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toBeCalledTimes(1)
    })
})