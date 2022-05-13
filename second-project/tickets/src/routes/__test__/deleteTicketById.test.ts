import { describe, test } from "@jest/globals"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"

describe("Testing DELETE /api/v1/ticket/:id endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"
    const testTicket = { title: "test", price: 1.23 }
    const cookies = globalThis.signup()

    test("Should return a 400 status if the ticket id is invalid", () => {
        return agent.delete(`${baseEndpoint}/123`).set("Cookie", cookies).expect(400)
    })

    test("Can only be accessed if the user is signin", () => {
        return agent.delete(`${baseEndpoint}/123`).send({}).expect(401)
    })

    test("Should return a 404 status if the ticket id was not found", () => {
        const id = new Types.ObjectId().toHexString()
        return agent.delete(`${baseEndpoint}/${id}`).set("Cookie", cookies).expect(404)
    })

    test("Should return a 401 status if the user tries to delete other user ticket.", async () => {
        const res = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        const newUser = globalThis.signup()
        return agent.delete(`${baseEndpoint}/${res.body.id}`).set("Cookie", newUser).expect(401)
    })

    test("Should not delete if the ticket is reserved", async () => {
        const { body: createdTicket } = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        const ticket = await Ticket.findById(createdTicket.id)
        await ticket?.set({ orderId: new Types.ObjectId().toHexString() }).save()
        return agent.delete(`${baseEndpoint}/${createdTicket.id}`).set("Cookie", cookies).expect(400)
    })

    test("Should return a status 200 after a successful delete", async () => {
        const res = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        return agent.delete(`${baseEndpoint}/${res.body.id}`).set("Cookie", cookies).expect(200)
    })
})