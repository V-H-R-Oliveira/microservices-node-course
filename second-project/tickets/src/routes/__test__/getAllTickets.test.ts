import { describe, test, expect, jest } from "@jest/globals"
import request from "supertest"

jest.mock("../../natsClient")

import { app } from "../../app"

describe("Testing GET /ap1/v1/tickets endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"

    test("Should contain the field \"tickets\" in the response", async () => {
        const res = await agent.get(baseEndpoint).expect(200)
        expect(res.body).toHaveProperty("tickets")
    })

    test("Return an empty array when there is no tickets", async () => {
        const res = await agent.get(baseEndpoint).expect(200)
        expect(res.body.tickets).toHaveLength(0)
    })

    test("Return a non empty array when there are tickets", async () => {
        const testTicket = { title: "test", price: 1.23 }
        const cookies = globalThis.signup()

        await agent.post(baseEndpoint).set("Cookie", cookies).send(testTicket).expect(201)
        const res = await agent.get(baseEndpoint).expect(200)

        expect(res.body.tickets).not.toHaveLength(0)
    })
})