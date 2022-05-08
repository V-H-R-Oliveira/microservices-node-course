import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { IPaymentCreated, OrderStatus } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import PaymentCreatedListener from "../paymentCreated"
import { Order } from "../../../models/order"

describe("Testing Payment Created Listener", () => {

    const listenerSetup = async () => {
        const listener = new PaymentCreatedListener(stan.client)

        const ticket = await globalThis.buildTicket()

        const order = await Order.build({
            userId: new Types.ObjectId().toString(),
            expiresAt: new Date(),
            status: OrderStatus.CREATED,
            ticket
        }).save()

        const data: IPaymentCreated["data"] = {
            id: new Types.ObjectId().toString(),
            chargeId: "ch_3KrsIHGDSCqsBuxW0Nry5y2u",
            orderId: order.id
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should throw an exception if the order was not found", async () => {
        const { listener, data, message } = await listenerSetup()

        data.orderId = new Types.ObjectId().toString()

        try {
            await listener.onMessage(data, message)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe(`Order ${data.orderId} not found`)
        }
    })

    test("Should update the order status to be 'COMPLETE'", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)

        const order = await Order.findById(data.orderId)

        expect(order).not.toBeNull()
        expect(order?.status).toBe(OrderStatus.COMPLETE)
    })

    test("Should publish an order:complete event", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(stan.client.publish).toHaveBeenCalledTimes(1)
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toBeCalledTimes(1)
    })
})