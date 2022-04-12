import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { Types } from "mongoose"
import { app } from "../../app"

describe("Testing GET /api/v1/orders/:id endpoint", () => {

    const agent = request(app)
    const baseEndpoint = "/api/v1/orders"
    const cookies = globalThis.signup()

    test("Should return a bad request error if the order id is not valid", () => {
        return agent.get(`${baseEndpoint}/1234`).set("Cookie", cookies).expect(400)
    })

    test("Should return null if the order was not found", () => {
        const orderId = new Types.ObjectId().toString()
        return agent.get(`${baseEndpoint}/${orderId}`).set("Cookie", cookies).expect(404)
    })

    test("Should return an authorization error if the user tries to access an order that does not belong to him", async() => {
        const user1Cookies = globalThis.signup()
        const user2Cookies = globalThis.signup()

        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", user1Cookies).send({ ticketId: ticket.id }).expect(201)
        return agent.get(`${baseEndpoint}/${order.id}`).set("Cookie", user2Cookies).expect(401)
    })

    test("Should return status 200 when after a successfully fetch", async() => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        return agent.get(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
    })

    test("Should return the order details for after a successfully fetch", async() => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        const { body: requestedOrder } = await agent.get(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
        expect(requestedOrder.id).toBe(order.id)
    })

    test("Should include the attached ticket", async () => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        const { body: requestedOrder } = await agent.get(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
        expect(requestedOrder.ticket.id).toBe(ticket.id)
    })
})