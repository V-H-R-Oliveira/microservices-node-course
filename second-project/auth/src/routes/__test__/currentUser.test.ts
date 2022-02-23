import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

describe("Test current-user route", () => {
    const agent = request(app)
    const endpoint = "/api/v1/users/current-user"
    const user = { email: "vitor@test.com", password: "1234" }

    test("It should return the email and the id of the logged in user", async () => {
        const cookies = await globalThis.signup()
        const response = await agent.get(endpoint).set("Cookie", cookies).expect(200)
        expect(response.body).toHaveProperty("email", user.email)
    })

    test("It should return null when the user is not loggedIn", async () => {
        const response = await agent.get(endpoint)
        expect(response.body).toBeNull()
    })
})