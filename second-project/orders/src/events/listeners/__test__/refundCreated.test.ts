/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import request from "supertest"
import { IRefundCreatedEvent, OrderStatus } from "@vhr_gittix/common-lib"
import { stan } from "../../../natsClient"
import RefundCreatedListener from "../refundCreated"
import { app } from "../../../app"
import { Order } from "../../../models/order"

describe("Testing Refund Created Listener", () => {

    const agent = request(app)
    const baseEndpoint = "/api/v1/orders"
    const cookies = globalThis.signup()

    const listenerSetup = async () => {
        const listener = new RefundCreatedListener(stan.client)

        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        const updatedOrder = await Order.findById(order.id)

        await updatedOrder!.set({ status: OrderStatus.CANCELLED }).save()

        const data: IRefundCreatedEvent["data"] = {
            orderId: updatedOrder?.id,
            refundId: "re_3KwG7GGDSCqsBuxW02PSAclB"
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should set the refundId", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)

        const order = await Order.findById(data.orderId)

        expect(order).not.toBeNull()
        expect(order?.refundId).toBeDefined()
        expect(order?.refundId).toEqual(data.refundId)
    })

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

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toHaveBeenCalledTimes(1)
    })

    test("Should not ack the message if the refund operation failed", async () => {
        const { listener, data, message } = await listenerSetup()

        const wrongRefundData: IRefundCreatedEvent["data"] = {
            ...data,
            orderId: new Types.ObjectId().toString()
        }

        try {
            await listener.onMessage(wrongRefundData, message)
        } catch (err) {
            expect(message.ack).not.toBeCalled()
        }
    })
})