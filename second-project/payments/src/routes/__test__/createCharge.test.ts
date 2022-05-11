/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, jest } from "@jest/globals"
import { OrderStatus } from "@vhr_gittix/common-lib"
import { Types } from "mongoose"
import request from "supertest"
import { app } from "../../app"
import { Payment } from "../../models/payment"
import { stripeClient } from "../../stripeClient"

describe("Testing POST /api/v1/payments endpoint", () => {
    const agent = request(app)
    const baseEndpoint = "/api/v1/payments"
    const fakeChargeId = "ch_3KrsIHGDSCqsBuxW0Nry5y2u"
    const cookies = globalThis.signup()

    test("Should return a 404 status if the order was not found", () => {
        return agent.post(baseEndpoint).set("Cookie", cookies).send({ orderId: new Types.ObjectId().toString(), token: "1234" }).expect(404)
    })

    test("Should return a 401 status if the user tries to access another user's order", async() => {
        const otherUserOrder = await globalThis.createOrder()
        return agent.post(baseEndpoint).set("Cookie", cookies).send({ orderId: otherUserOrder.id, token: "1234" }).expect(401)
    })

    test("Should return a 400 status if the user tries to pay a cancelled order", async() => {
        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)

        await order.set({ status: OrderStatus.CANCELLED }).save()
        return agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "1234" }).expect(400)
    })

    test("Should return a 400 status if the user tries to double pay the order", async() => {
        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)

        await order.set({ status: OrderStatus.COMPLETE }).save()
        return agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "1234" }).expect(400)
    })

    test("Should return a 201 status if the order was successfuly charged", async() => {
        const spy = jest.spyOn<any, any>(stripeClient.charges, "create").mockResolvedValue({ id: fakeChargeId })

        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)
        const res = await agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "tok_visa" })

        expect(res.statusCode).toBe(201)
        spy.mockRestore()
    })

    test("Should save a Payment record after a charge", async () => {
        const spy = jest.spyOn<any, any>(stripeClient.charges, "create").mockResolvedValue({ id: fakeChargeId })

        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)

        await agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "tok_visa" }).expect(201)
        const payment = await Payment.findOne({ orderId: order.id })

        expect(payment).not.toBeNull()
        expect(payment?.chargeId).toBe(fakeChargeId)

        spy.mockRestore()
    })

    test("Should call charges.create only once", async() => {
        const spy = jest.spyOn<any, any>(stripeClient.charges, "create").mockResolvedValue({ id: fakeChargeId })

        const userId = new Types.ObjectId().toString()
        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)
        await agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "tok_visa" }).expect(201)

        expect(spy).toBeCalledTimes(1)
        spy.mockRestore()
    })

    test("Should make a real charge", async() => {
        const userId = new Types.ObjectId().toString()

        const userCookies = globalThis.signup(userId)
        const order = await globalThis.createOrder(userId)

        await agent.post(baseEndpoint).set("Cookie", userCookies).send({ orderId: order.id, token: "tok_visa" }).expect(201)
        const allCharges = await stripeClient.charges.list()

        const orderPriceToCents = order.price * 100
        const hasTheCharge = allCharges.data.some((charge) => charge.amount == orderPriceToCents)

        expect(hasTheCharge).toBeTruthy()
    })
})
