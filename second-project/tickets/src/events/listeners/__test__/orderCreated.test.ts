/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, test, jest } from "@jest/globals"
import { IOrderCreatedEvent } from "@vhr_gittix/common-lib"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import OrderCreatedListener from "../orderCreated"
import { stan } from "../../../natsClient"

describe("Testing the OrderCreated listener", () => {
    const listenerSetup = async () => {
        const listener = new OrderCreatedListener(stan.client)
        const userId = new Types.ObjectId().toString()
        const ticket = await Ticket.build({ title: "test", price: 2, userId }).save()

        const data: IOrderCreatedEvent["data"] = {
            id: new Types.ObjectId().toString(),
            expiresAt: Date.now().toString(),
            userId,
            version: 0,
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should set orderId property with the incoming orderId", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)

        const ticket = await Ticket.findById(data.ticket.id)

        expect(ticket!.orderId).toBeDefined()
        expect(ticket!.orderId).toBe(data.id)
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