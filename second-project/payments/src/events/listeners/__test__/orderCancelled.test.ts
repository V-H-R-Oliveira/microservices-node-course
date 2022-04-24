import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { IOrderCancelledEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import { Order } from "../../../models/order"
import OrderCancelledListener from "../orderCancelled"

describe("Testing Order Cancelled Listener", () => {

    const listenerSetup = async () => {
        const listener = new OrderCancelledListener(stan.client)
        const orderId = new Types.ObjectId().toString()

        await Order.build({
            originalOrderId: orderId,
            price: 123,
            status: OrderStatus.CREATED,
            userId: new Types.ObjectId().toString()
        }).save()

        const data: IOrderCancelledEvent["data"] = {
            id: orderId,
            version: 1,
            ticket: {
                id: new Types.ObjectId().toString(),
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should update the order status to order cancelled", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        const order = await Order.findById(data.id)
        expect(order?.status).toBe(OrderStatus.CANCELLED)
    })

    test("Should throw an exception when the order was not found", async () => {
        const { listener, data, message } = await listenerSetup()

        data.id = new Types.ObjectId().toString()

        try {
            await listener.onMessage(data, message)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe(`Order ${data.id} not found`)
        }
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toBeCalledTimes(1)
    })
})