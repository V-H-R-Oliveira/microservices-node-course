import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { stan } from "../../natsClient"
import { app } from "../../app"

describe("Testing /api/v1/tickets endpoint", () => {

    const agent = request(app)
    const baseEndpoint = "/api/v1/tickets"
    const cookies = globalThis.signup()

    test("Can only be accessed if the user is signin", () => {
        return agent.post(baseEndpoint).send({}).expect(401)
    })

    test.concurrent.each([
        [ { price: 1.25 } ],
        [ { title: "", price: 1.5 } ]
    ])("Should return a status 400 if the title of (%o) is invalid", (payload) => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(400)
    })

    test.concurrent.each([
        [ { title: "test", price: -1.25 } ],
        [ { title: "test", price: 0 } ],
        [ { title: "test" } ]
    ])("Should return a status 400 if the price of (%o) is invalid", (payload) => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(400)
    })

    test.concurrent.each([
        [ { title: "test", price: 1.23 } ],
        [ { title: "new ticket", price: 0.01 } ],
        [ { title: "testing ticket", price: 1000.52 } ]
    ])("Should create a ticket with valid inputs (%o)", (payload) => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send(payload).expect(201)
    })

    test("Stan client publish method should be called only once", async () => {
        await agent.post(baseEndpoint).set("Cookie", cookies).send({ title: "test", price: 1 }).expect(201)
        expect(stan.client.publish).toHaveBeenCalledTimes(1)
    })
})