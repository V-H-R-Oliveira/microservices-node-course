/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { IOrderCancelledEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import { Order } from "../../../models/order"
import OrderCancelledListener from "../orderCancelled"
import { stripeClient } from "../../../stripeClient"
import { Refund } from "../../../models/refund"
import { Payment } from "../../../models/payment"

describe("Testing Order Cancelled Listener", () => {
    const fakeRefundId = "re_3KwG7GGDSCqsBuxW02PSAclB"

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

    test.todo("Should cancel the chargeId")

    test("Should make a refund if a payment was made", async () => {
        const refundSpy = jest.spyOn<any, any>(stripeClient.refunds, "create").mockResolvedValue({ id: fakeRefundId })
        const { listener, data, message } = await listenerSetup()

        await Payment.build({ orderId: data.id, chargeId: "ch_3KrsIHGDSCqsBuxW0Nry5y2u" }).save()
        await listener.onMessage(data, message)

        const refund = await Refund.findOne({ refundId: fakeRefundId })

        expect(refund).not.toBeNull()
        expect(refund?.orderId).toBe(data.id)

        refundSpy.mockRestore()
    })

    test("Should publish a refund:created after a successful refund", async () => {
        const refundSpy = jest.spyOn<any, any>(stripeClient.refunds, "create").mockResolvedValue({ id: fakeRefundId })
        const { listener, data, message } = await listenerSetup()

        await Payment.build({ orderId: data.id, chargeId: "ch_3KrsIHGDSCqsBuxW0Nry5y2u" }).save()
        await listener.onMessage(data, message)

        expect(stan.client.publish).toHaveBeenCalledTimes(1)
        refundSpy.mockRestore()
    })

    test("Should not publish a refund:created if the order has not received a payment", async () => {
        const refundSpy = jest.spyOn<any, any>(stripeClient.refunds, "create").mockResolvedValue({ id: fakeRefundId })
        const { listener, data, message } = await listenerSetup()

        await listener.onMessage(data, message)
        expect(stan.client.publish).not.toHaveBeenCalled()

        refundSpy.mockRestore()
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