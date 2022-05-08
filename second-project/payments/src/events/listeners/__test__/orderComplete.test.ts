/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { IOrderCompleteEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import { Order } from "../../../models/order"
import OrderCompleteListener from "../orderComplete"

describe("Testing Order Complete Listener", () => {

    const listenerSetup = async () => {
        const listener = new OrderCompleteListener(stan.client)
        const order = await globalThis.createOrder()

        const data: IOrderCompleteEvent["data"] = {
            id: order.id,
            version: order.version + 1,
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should throw an error if the order was not found", async () => {
        const { listener, data, message } = await listenerSetup()
        data.id = new Types.ObjectId().toString()

        try {
            await listener.onMessage(data, message)
        } catch (err: any) {
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe(`Order ${data.id} not found`)
        }
    })

    test("Should set the order status to 'completed'", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        const order = await Order.findById(data.id)
        expect(order?.status).toBe(OrderStatus.COMPLETE)
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toBeCalledTimes(1)
    })
})