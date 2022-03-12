import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

describe("Testing /ap1/v1/tickets endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"
    const cookies = globalThis.signup()

    test("Has a route handler listening to /api/tickets for post requests", async () => {
        const response = await agent.post(baseEndpoint).send({})
        expect(response.status).not.toEqual(404)
    })

    test("Can only be accessed if the user is signin", () => {
        return agent.post(baseEndpoint).send({}).expect(401)
    })

    test("Returns a status other than 401 if the user is signed in", async () => {
        const response = await agent.post(baseEndpoint).set("Cookie", cookies).send({})
        expect(response.status).not.toEqual(401)
    })

    test.concurrent.each([
        [ { price: 1.25 } ],
        [ { title: "", price: 1.5 } ]
    ])("Returns a status 400 if the title of (%o) is invalid", (payload) => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(400)
    })

    test.concurrent.each([
        [ { title: "test", price: -1.25 } ],
        [ { title: "test", price: 0 } ],
        [ { title: "test" } ]
    ])("Returns a status 400 if the price of (%o) is invalid", (payload) => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(400)
    })

    test.concurrent.each([
        [ { title: "test", price: 1.23 } ],
        [ { title: "new ticket", price: 0.01 } ],
        [ { title: "testing ticket", price: 1000.52 } ]
    ])("Creates a ticket with valid inputs (%o)", (payload) => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(201)
    })
})