import { describe, test, expect } from "@jest/globals"
import mongoose from "mongoose"
import request from "supertest"
import { app } from "../../app"

describe("Testing /api/v1/tickets/:id endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"
    const cookies = globalThis.signup()

    test("Should return a 400 if ticket id is invalid", () => {
        return agent.get(`${baseEndpoint}/1`).expect(400)
    })

    test("Should return a 404 if the ticket is not found", () => {
        const id = new mongoose.Types.ObjectId().toHexString()
        return agent.get(`${baseEndpoint}/${id}`).expect(404)
    })

    test("Should return the requested ticket", async () => {
        const payload = { title: "test", price: 2 }
        const response = await agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(201)
        const ticketResponse = await agent.get(`${baseEndpoint}/${response.body.id}`).expect(200)
        expect(ticketResponse.body).toMatchObject(payload)
    })
})