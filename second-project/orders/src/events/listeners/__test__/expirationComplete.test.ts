import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { IExpirationCompleteEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import ExpirationCompleteListener from "../expirationComplete"
import { Order } from "../../../models/order"

describe("Testing Expiration Complete Listener", () => {

    const listenerSetup = async () => {
        const listener = new ExpirationCompleteListener(stan.client)
        const ticket = await globalThis.buildTicket()

        const order = await Order.build({
            userId: new Types.ObjectId().toString(),
            expiresAt: new Date(),
            status: OrderStatus.CREATED,
            ticket
        }).save()

        const data: IExpirationCompleteEvent["data"] = {
            orderId: order.id
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should cancel the order if received an expiration complete event", async () => {
        const { listener, data, message } = await listenerSetup()

        await listener.onMessage(data, message)

        const order = await Order.findById(data.orderId)
        expect(order?.status).toBe(OrderStatus.CANCELLED)
    })

    test("Should throw an exception if the order was not found", async () => {
        const { listener, data, message } = await listenerSetup()
        try {
            data.orderId = new Types.ObjectId().toString()
            await listener.onMessage(data, message)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe(`Order ${data.orderId} not found`)
        }
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toHaveBeenCalledTimes(1)
    })

    test("Should publish an order cancelled event after the order have been canceled", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(stan.client.publish).toHaveBeenCalledTimes(1)
    })
})