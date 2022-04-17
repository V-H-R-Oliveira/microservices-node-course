import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { ITicketUpdatedEvent } from "@vhr_gittix/common-lib"
import TicketUpdatedListener from "../ticketUpdated"
import { stan } from "../../../natsClient"
import { Ticket } from "../../../models/ticket"

describe("Testing Ticket Created Listener", () => {

    const listenerSetup = async () => {
        const listener = new TicketUpdatedListener(stan.client)

        const ticket = await globalThis.buildTicket()

        const data: ITicketUpdatedEvent["data"] = {
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: new Types.ObjectId().toString(),
            version: ticket.version + 1
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should update and save a ticket", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)

        const updatedTicket = await Ticket.findById(data.id)

        expect(updatedTicket).not.toBeNull()
        expect(updatedTicket?.title).toEqual(data.title)
        expect(updatedTicket?.price).toEqual(data.price)
        expect(updatedTicket?.version).toEqual(data.version)
    })

    test("Should throw an exception if the ticket was not found", async () => {
        const { listener, data, message } = await listenerSetup()

        try {
            await listener.onMessage({ ...data, id: new Types.ObjectId().toString() }, message)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            expect(err).toBeInstanceOf(Error)
            expect(err.message).toBe("Ticket not found")
        }
    })

    test("Should ack the message", async () => {
        const { listener, data, message } = await listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toHaveBeenCalledTimes(1)
    })

    test("Should throw an exception if the ticket version are out of order", async () => {
        const { listener, data, message } = await listenerSetup()

        const ticketUpdate2: ITicketUpdatedEvent["data"] = {
            id: data.id,
            title: data.title,
            price: 500,
            userId: data.userId,
            version: data.version + 2
        }

        try {
            await listener.onMessage(ticketUpdate2, message)
        } catch (err) {
            expect(err).toBeInstanceOf(Error)
        }
    })

    test("Should not ack the message if the update operation failed", async () => {
        const { listener, data, message } = await listenerSetup()

        const ticketUpdate2: ITicketUpdatedEvent["data"] = {
            id: data.id,
            title: data.title,
            price: 500,
            userId: data.userId,
            version: data.version + 2
        }

        try {
            await listener.onMessage(ticketUpdate2, message)
        } catch (err) {
            expect(message.ack).toBeCalledTimes(0)
        }
    })
})