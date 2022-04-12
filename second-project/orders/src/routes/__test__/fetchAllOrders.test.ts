import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

describe("Testing GET /api/v1/orders endpoint", () => {

    const agent = request(app)
    const baseEndpoint = "/api/v1/orders"
    const cookies = globalThis.signup()

    test("Should return an array of orders", async () => {
        const { body: orders } = await agent.get(baseEndpoint).set("Cookie", cookies).expect(200)
        expect(Array.isArray(orders)).toBeTruthy()
    })

    test("Should return an array with two orders", async () => {
        const user1Cookies = globalThis.signup()
        const user2Cookies = globalThis.signup()

        const ticket = await globalThis.buildTicket()
        const ticket2 = await globalThis.buildTicket()
        const ticket3 = await globalThis.buildTicket()

        await agent.post(baseEndpoint).set("Cookie", user1Cookies).send({ ticketId: ticket.id }).expect(201)
        await agent.post(baseEndpoint).set("Cookie", user2Cookies).send({ ticketId: ticket2.id }).expect(201)
        await agent.post(baseEndpoint).set("Cookie", user2Cookies).send({ ticketId: ticket3.id }).expect(201)

        const { body: orders } = await agent.get(baseEndpoint).set("Cookie", user2Cookies).expect(200)
        expect(orders).toHaveLength(2)
    })

    test("Should match the orders with the one that was saved", async () => {
        const user1Cookies = globalThis.signup()
        const user2Cookies = globalThis.signup()

        const ticket = await globalThis.buildTicket()
        const ticket2 = await globalThis.buildTicket()
        const ticket3 = await globalThis.buildTicket()

        await agent.post(baseEndpoint).set("Cookie", user1Cookies).send({ ticketId: ticket.id }).expect(201)
        const { body: order2 } = await agent.post(baseEndpoint).set("Cookie", user2Cookies).send({ ticketId: ticket2.id }).expect(201)
        const { body: order3 } = await agent.post(baseEndpoint).set("Cookie", user2Cookies).send({ ticketId: ticket3.id }).expect(201)

        const { body: orders } = await agent.get(baseEndpoint).set("Cookie", user2Cookies).expect(200)
        const matchOrdersIds = orders[0].id === order2.id && orders[1].id === order3.id
        expect(matchOrdersIds).toBeTruthy()
    })

    test("Should match the reserved order tickets", async () => {
        const user1Cookies = globalThis.signup()
        const user2Cookies = globalThis.signup()

        const ticket = await globalThis.buildTicket()
        const ticket2 = await globalThis.buildTicket()
        const ticket3 = await globalThis.buildTicket()

        await agent.post(baseEndpoint).set("Cookie", user1Cookies).send({ ticketId: ticket.id }).expect(201)
        await agent.post(baseEndpoint).set("Cookie", user2Cookies).send({ ticketId: ticket2.id }).expect(201)
        await agent.post(baseEndpoint).set("Cookie", user2Cookies).send({ ticketId: ticket3.id }).expect(201)

        const { body: orders } = await agent.get(baseEndpoint).set("Cookie", user2Cookies).expect(200)
        const matchReservedTicketsIds = orders[0].ticket.id === ticket2.id && orders[1].ticket.id === ticket3.id
        expect(matchReservedTicketsIds).toBeTruthy()
    })
})