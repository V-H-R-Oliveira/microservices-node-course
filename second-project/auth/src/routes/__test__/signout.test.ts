import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

describe("Test signout route", () => {
    const agent = request(app)
    const endpoint = "/api/v1/users/signout"

    test("It should signout a logged in user", async () => {
        const cookies = await globalThis.signup()
        return agent.post(endpoint).set("Cookie", cookies).expect(200)
    })

    test("It should signout a logged in user", async () => {
        const cookies = await globalThis.signup()
        const signoutResponse = await agent.post(endpoint).set("Cookie", cookies)
        const [ signoutCookies ] = signoutResponse.get("Set-Cookie")

        expect(signoutCookies).toEqual("session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly")
    })
})