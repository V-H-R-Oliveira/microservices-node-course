import { describe, test, expect, jest } from "@jest/globals"
import mongoose from "mongoose"
import request from "supertest"

jest.mock("../../natsClient")

import { app } from "../../app"

describe("Testing PUT /ap1/v1/ticket/:id endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"
    const testTicket = { title: "test", price: 1.23 }
    const cookies = globalThis.signup()

    test("Has a route handler listening to /api/ticket/:id for put requests", async () => {
        const response = await agent.put(`${baseEndpoint}/123`).send({})
        expect(response.status).not.toEqual(404)
    })

    test("Can only be accessed if the user is signin", () => {
        return agent.put(`${baseEndpoint}/123`).send({}).expect(401)
    })

    test("Returns a status other than 401 if the user is signed in", async () => {
        const response = await agent.put(`${baseEndpoint}/123`).set("Cookie", cookies).send({})
        expect(response.status).not.toEqual(401)
    })

    test("Returns status 200 after a successfull update", async () => {
        const res = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        return agent.put(`${baseEndpoint}/${res.body.id}`).set("Cookie", cookies).send({ ...testTicket, title: "updated ticket" }).expect(200)
    })

    test("Returns a 400 status if the ticket id is invalid", () => {
        return agent.put(`${baseEndpoint}/123`).set("Cookie", cookies).send({ ...testTicket, title: "updated ticket" }).expect(400)
    })

    test("Returns a 404 status if the ticket id was not found", () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        return agent.put(`${baseEndpoint}/${id}`).set("Cookie", cookies).send({ ...testTicket, title: "updated ticket" }).expect(404)
    })

    test.concurrent.each([
        [ { title: "", price: 1.23 } ],
        [ { title: "test", price: -1.23 } ],
        [ { title: "", price: -1 } ],
    ])("Returns a 400 status if %o is invalid", (payload) => {
        const id = new mongoose.Types.ObjectId().toHexString()
        return agent.put(`${baseEndpoint}/${id}`).set("Cookie", cookies).send(payload).expect(400)
    })

    test("Returns a 401 status if the user tries to update other user ticket.", async () => {
        const res = await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        const newUser = globalThis.signup()
        return agent.put(`${baseEndpoint}/${res.body.id}`).set("Cookie", newUser).send(testTicket).expect(401)
    })

    test.concurrent.each([
        [ { title: "test", price: 1.23 }, { title: "updated ticket", price: 1.23 } ],
        [ { title: "test", price: 1.23 }, { title: "test", price: 1.25 } ],
        [ { title: "test", price: 1.23 }, { title: "updated test", price: 1.29 } ],
    ])("Return the updated ticket after a successfull update", async (originalTicket, updatedTicket) => {
        const ticketRes = await agent.post(baseEndpoint).set("Cookie", cookies).send(originalTicket).expect(201)
        const updatedTicketRes = await agent.put(`${baseEndpoint}/${ticketRes.body.id}`).set("Cookie", cookies).send(updatedTicket).expect(200)
        expect(updatedTicketRes.body).toMatchObject(updatedTicket)
    })
})