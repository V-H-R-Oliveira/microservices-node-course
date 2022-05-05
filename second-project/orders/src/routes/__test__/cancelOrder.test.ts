import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { Types } from "mongoose"
import { OrderStatus } from "@vhr_gittix/common-lib"
import { app } from "../../app"
import { stan } from "../../natsClient"
import { Order } from "../../models/order"

describe("Testing PATCH /api/v1/orders/:id endpoint", () => {

    const agent = request(app)
    const baseEndpoint = "/api/v1/orders"
    const cookies = globalThis.signup()

    test("Should return a bad request error if the order id is not valid", () => {
        return agent.post(`${baseEndpoint}/1234`).set("Cookie", cookies).expect(400)
    })

    test("Should return null if the order was not found", () => {
        const orderId = new Types.ObjectId().toString()
        return agent.post(`${baseEndpoint}/${orderId}`).set("Cookie", cookies).expect(404)
    })

    test("Should return an authorization error if the user tries to cancel an order that does not belong to him", async () => {
        const user1Cookies = globalThis.signup()
        const user2Cookies = globalThis.signup()

        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", user1Cookies).send({ ticketId: ticket.id }).expect(201)
        return agent.post(`${baseEndpoint}/${order.id}`).set("Cookie", user2Cookies).expect(401)
    })

    test("Should return status 200 when after an order cancel", async () => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        return agent.post(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
    })

    test("Should return the order details after an order cancel", async () => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        const { body: requestedOrder } = await agent.post(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
        expect(requestedOrder.id).toBe(order.id)
    })

    test("Should return the cancelled status after an order cancel", async () => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        await agent.post(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
        const { body: orderDetails } = await agent.get(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
        expect(orderDetails.status).toBe(OrderStatus.CANCELLED)
    })

    test("Should send a ORDER_CANCELLED event after an order cancel", async () => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)
        await agent.post(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(200)
        expect(stan.client.publish).toHaveBeenCalledTimes(2)
    })

    test("Should return status 500 if we try to cancel a complete order", async () => {
        const ticket = await globalThis.buildTicket()
        const { body: order } = await agent.post(baseEndpoint).set("Cookie", cookies).send({ ticketId: ticket.id }).expect(201)

        const savedOrder = await Order.findById(order.id)
        await savedOrder?.set({ status: OrderStatus.COMPLETE }).save()

        return agent.post(`${baseEndpoint}/${order.id}`).set("Cookie", cookies).expect(500)
    })
})