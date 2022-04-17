import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import { Message } from "node-nats-streaming"
import { ITicketCreatedEvent } from "@vhr_gittix/common-lib"
import TicketCreatedListener from "../ticketCreated"
import { stan } from "../../../natsClient"
import { Ticket } from "../../../models/ticket"

describe("Testing Ticket Created Listener", () => {

    const listenerSetup = () => {
        const listener = new TicketCreatedListener(stan.client)

        const data: ITicketCreatedEvent["data"] = {
            id: new Types.ObjectId().toString(),
            title: "test listener",
            price: 123,
            userId: new Types.ObjectId().toString(),
            version: 0
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message: Message = {
            ack: jest.fn()
        }

        return { listener, data, message }
    }

    test("Should create and save a ticket", async () => {
        const { listener, data, message } = listenerSetup()
        await listener.onMessage(data, message)
        const ticket = await Ticket.findById(data.id)
        expect(ticket).not.toBeNull()
    })

    test("Should ack the message", async() => {
        const { listener, data, message } = listenerSetup()
        await listener.onMessage(data, message)
        expect(message.ack).toBeCalledTimes(1)
    })
})