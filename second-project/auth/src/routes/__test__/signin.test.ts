import { describe, test, beforeEach, expect } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"
import { IError } from "../../errors/IError"

describe("Test signin route", () => {
    const agent = request(app)
    const endpoint = "/api/v1/users/signin"
    const user = { email: "vitor@test.com", password: "1234" }

    beforeEach(() => {
        return globalThis.signup()
    })

    test.concurrent.each([
        [ user, 200 ],
        [ { email: user.email, password: "12" }, 400 ],
        [ { email: "vitor@test2.com", password: "1234" }, 400 ]
    ])("When supplied with %j, it should return the status code %i", (payload, expectedStatusCode) => {
        return agent.post(endpoint).send(payload).expect(expectedStatusCode)
    })

    test.concurrent.each([
        [ { email: user.email, password: "12" }, "Invalid credentials" ],
        [ { email: "vitor@test2.com", password: "1234" }, "User account not found" ]
    ])("When supplied with %j, it should return the error message of '%s'", async (payload, expectedErrorMessage) => {
        const response = await agent.post(endpoint).send(payload)

        const hasExpectedErrorMessage = response.body.errors
            .some((error: IError) => error.message == expectedErrorMessage)

        expect(hasExpectedErrorMessage).toBeTruthy()
    })

    test("It should set the response header 'Set-Cookie'", async () => {
        const response = await agent
            .post(endpoint)
            .send(user)

        expect(response.get("Set-Cookie")).toBeDefined()
    })
})