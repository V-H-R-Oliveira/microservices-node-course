/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, test, jest } from "@jest/globals"
import { IOrderCancelledEvent } from "@vhr_gittix/common-lib"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { stan } from "../../../natsClient"
import OrderCancelledListener from "../orderCancelled"

describe("Testing the OrderCancelled listener", () => {
    const listenerSetup = async () => {
        const listener = new OrderCancelledListener(stan.client)
        const ticket = await Ticket.build({ title: "test", price: 2, userId: new Types.ObjectId().toString() }).save()

        const data: IOrderCancelledEvent["data"] = {
            id: new Types.ObjectId().toString(),
            version: 0,
            ticket: {
                id: ticket.id
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should set orderId property to undefined after receive an order cancelled event", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)

        const ticket = await Ticket.findById(data.ticket.id)
        expect(ticket!.orderId).toBeUndefined()
    })

    test("Should throw an exception if the ticket was not found", async () => {
        const { listener, data, message } = await listenerSetup()

        data.ticket.id = new Types.ObjectId().toString()

        try {
            await listener.onMessage(data, message)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe(`Ticket(${data.ticket.id}) not found`)
        }
    })

    test("Should publish a TicketUpdatedEvent after a successfull update", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(stan.client.publish).toHaveBeenCalledTimes(1)
    })

    test("Should not ack the message if the ticket was not found", async () => {
        const { listener, data, message } = await listenerSetup()

        data.ticket.id = new Types.ObjectId().toString()

        try {
            await listener.onMessage(data, message)
        } catch (err) {
            expect(message.ack).toHaveBeenCalledTimes(0)
        }
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toHaveBeenCalledTimes(1)
    })
})