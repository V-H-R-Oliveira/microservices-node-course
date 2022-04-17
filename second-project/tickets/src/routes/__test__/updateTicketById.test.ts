import { describe, test, expect } from "@jest/globals"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/ticket"

describe("Testing PUT /ap1/v1/ticket/:id endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"
    const testTicket = { title: "test", price: 1.23 }
    const cookies = globalThis.signup()

    test("Should have a route handler listening to /api/ticket/:id for put requests", async () => {
        const response = await agent.put(`${baseEndpoint}/123`).send({})
        expect(response.status).not.toEqual(404)
    })

    test("Can only be accessed if the user is signin", () => {
        return agent.put(`${baseEndpoint}/123`).send({}).expect(401)
    })

    test("Should return a status other than 401 if the user is signed in", async () => {
        const response = await agent.put(`${baseEndpoint}/123`).set("Cookie", cookies).send({})
        expect(response.status).not.toEqual(401)
    })

    test("Should return a status 200 after a successfull update", async () => {
        const res = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        return agent.put(`${baseEndpoint}/${res.body.id}`).set("Cookie", cookies).send({ ...testTicket, title: "updated ticket" }).expect(200)
    })

    test("Should return a 400 status if the ticket id is invalid", () => {
        return agent.put(`${baseEndpoint}/123`).set("Cookie", cookies).send({ ...testTicket, title: "updated ticket" }).expect(400)
    })

    test("Should return a 404 status if the ticket id was not found", () => {
        const id = new Types.ObjectId().toHexString()
        return agent.put(`${baseEndpoint}/${id}`).set("Cookie", cookies).send({ ...testTicket, title: "updated ticket" }).expect(404)
    })

    test.concurrent.each([
        [ { title: "", price: 1.23 } ],
        [ { title: "test", price: -1.23 } ],
        [ { title: "", price: -1 } ],
    ])("Should return a 400 status if %o is invalid", (payload) => {
        const id = new Types.ObjectId().toHexString()
        return agent.put(`${baseEndpoint}/${id}`).set("Cookie", cookies).send(payload).expect(400)
    })

    test("Should return a 401 status if the user tries to update other user ticket.", async () => {
        const res = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        const newUser = globalThis.signup()
        return agent.put(`${baseEndpoint}/${res.body.id}`).set("Cookie", newUser).send(testTicket).expect(401)
    })

    test.concurrent.each([
        [ { title: "test", price: 1.23 }, { title: "updated ticket", price: 1.23 } ],
        [ { title: "test", price: 1.23 }, { title: "test", price: 1.25 } ],
        [ { title: "test", price: 1.23 }, { title: "updated test", price: 1.29 } ],
    ])("Should return the updated ticket after a successfull update", async (originalTicket, updatedTicket) => {
        const ticketRes = await agent.post(baseEndpoint).set("Cookie", cookies).send(originalTicket).expect(201)
        const updatedTicketRes = await agent.put(`${baseEndpoint}/${ticketRes.body.id}`).set("Cookie", cookies).send(updatedTicket).expect(200)
        expect(updatedTicketRes.body).toMatchObject(updatedTicket)
    })

    test("Should reject updates if the ticket is reserved", async () => {
        const { body: createdTicket } = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        const ticket = await Ticket.findById(createdTicket.id)

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await ticket!.set({ orderId: new Types.ObjectId().toHexString() }).save()
        return agent.put(`${baseEndpoint}/${createdTicket.id}`).set("Cookie", cookies).send(testTicket).expect(400)
    })
})