import { describe, test, expect } from "@jest/globals"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Order, OrderStatus } from "../../models/order"
import { stan } from "../../natsClient"

describe("Testing POST /api/v1/orders endpoint", () => {

    const agent = request(app)
    const baseEndpoint = "/api/v1/orders"
    const cookies = globalThis.signup()

    test("Should return an error if the ticket does not exist", () => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: new Types.ObjectId() }).expect(404)
    })

    test("Should return an error if the ticket is already reserved", async() => {
        const ticket = await globalThis.buildTicket()

        await Order.build({
            ticket,
            userId: new Types.ObjectId().toString(),
            status: OrderStatus.CREATED,
            expiresAt: new Date()
        }).save()

        return agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(400)
    })

    test("Should reserve a ticket", async() => {
        const ticket = await globalThis.buildTicket()
        return agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
    })

    test("Should emit an ORDER_CREATED event after the successfully ticket reservation", async() => {
        const ticket = await globalThis.buildTicket()
        await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)

        expect(stan.client.publish).toHaveBeenCalledTimes(1)
    })
})