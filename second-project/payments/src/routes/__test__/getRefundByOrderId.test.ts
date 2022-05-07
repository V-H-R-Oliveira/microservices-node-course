/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, jest } from "@jest/globals"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Refund } from "../../models/refund"
import { stripeClient } from "../../stripeClient"

describe("Testing GET /api/v1/payments/refunds/:id endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/payments"
    const fakeChargeId = "ch_3KrsIHGDSCqsBuxW0Nry5y2u"
    const fakeRefundId = "re_3KwG7GGDSCqsBuxW02PSAclB"
    const cookies = globalThis.signup()
    const mockRefundData = {
        amount: 100,
        currency: "usd",
        reason: "test",
        created: Date.now()
    }

    test("Should return a 404 status if the order was not found", () => {
        return agent.get(`${baseEndpoint}/refunds/${new Types.ObjectId().toString()}`).set("Cookie", cookies).expect(404)
    })

    test("Should return a 401 status if the user tries to access another user's order", async () => {
        const otherUserOrder = await globalThis.createOrder()
        return agent.get(`${baseEndpoint}/refunds/${otherUserOrder.id}`).set("Cookie", cookies).expect(401)
    })

    test("Should return a 404 status if the user tries to fetch a non existent refund", async () => {
        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)

        const order = await globalThis.createOrder(userId)
        return agent.get(`${baseEndpoint}/refunds/${order.id}`).set("Cookie", userCookies).expect(404)
    })

    test("Should return a 200 status if a refund was found", async () => {
        const createChargeSpy = jest.spyOn<any, any>(stripeClient.charges, "create").mockResolvedValue({ id: fakeChargeId })
        const retrieveRefundSpy = jest.spyOn<any, any>(stripeClient.refunds, "retrieve").mockResolvedValue(mockRefundData)

        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)
        await agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "tok_visa" }).expect(201)

        await Refund.build({ orderId: order.id, refundId: fakeRefundId }).save()

        const res = await agent.get(`${baseEndpoint}/refunds/${order.id}`).set("Cookie", userCookies)

        expect(res.statusCode).toBe(200)

        createChargeSpy.mockRestore()
        retrieveRefundSpy.mockRestore()
    })

    test("Should call refunds.retrieve only once", async () => {
        const createChargeSpy = jest.spyOn<any, any>(stripeClient.charges, "create").mockResolvedValue({ id: fakeChargeId })
        const retrieveRefundSpy = jest.spyOn<any, any>(stripeClient.refunds, "retrieve").mockResolvedValue(mockRefundData)

        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)
        await agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "tok_visa" }).expect(201)

        await Refund.build({ orderId: order.id, refundId: fakeRefundId }).save()
        await agent.get(`${baseEndpoint}/refunds/${order.id}`).set("Cookie", userCookies).expect(200)

        expect(retrieveRefundSpy).toHaveBeenCalledTimes(1)

        createChargeSpy.mockRestore()
        retrieveRefundSpy.mockRestore()
    })
})
