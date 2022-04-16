/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, expect, test } from "@jest/globals"
import { Types, Error } from "mongoose"
import { Ticket } from "../ticket"

describe("Test the Ticket model", () => {
    const userId = new Types.ObjectId().toString()

    test("Should not update the ticket if the version does not match", async () => {
        const ticket = await Ticket.build({ title: "test", price: 2, userId }).save()

        const ticketInstance = await Ticket.findById(ticket.id)
        const ticketInstance2 = await Ticket.findById(ticket.id)

        ticketInstance!.price = 50
        ticketInstance2!.price = 100

        await ticketInstance!.save()

        expect.assertions(1)

        try {
            await ticketInstance2!.save()
        } catch (err) {
            expect(err).toBeInstanceOf(Error.VersionError)
        }
    })

    test("Should increment the version number on multiple saves", async() => {
        const ticket = await Ticket.build({ title: "test", price: 2, userId }).save()
        expect(ticket.version).toBe(0)

        await ticket.save()
        expect(ticket.version).toBe(1)

        await ticket.save()
        expect(ticket.version).toBe(2)
    })
})