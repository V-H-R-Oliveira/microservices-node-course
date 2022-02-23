import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"
import { IError } from "../../errors/IError"

describe("Test signup route", () => {
    const agent = request(app)
    const endpoint = "/api/v1/users/signup"

    test.concurrent.each([
        [ { email: "valid@example.com", password: "P@ssw0rd" }, 201 ],
        [ { email: "invalid", password: "P@ssw0rd" }, 400 ],
        [ { email: "valid@example.com", password: "P" }, 400 ],
        [ {  }, 400 ]
    ])("When supplied with %j, it should return the status code %i", (payload, expectedStatusCode) => {
        return agent
            .post(endpoint)
            .send(payload)
            .expect("Content-Type", /json/)
            .expect(expectedStatusCode)
    })

    test("It should return the id and the email of the user after a successful signup", async () => {
        const payload = { email: "vitor@anycart.com", password: "1234" }
        const response = await agent
            .post(endpoint)
            .set("Content-Type", "application/json")
            .send(payload)

        expect(response.body).toHaveProperty("id")
        expect(response.body).toHaveProperty("email", payload.email)
    })

    test("It should return a fulfilled array of errors after an insuccessful signup", async () => {
        const payload = { email: "vitor", password: "1234" }

        const response = await agent
            .post(endpoint)
            .set("Content-Type", "application/json")
            .send(payload)

        expect(Array.isArray(response.body.errors)).toBeTruthy()
        expect(response.body.errors).not.toHaveLength(0)
    })

    test.concurrent.each([
        [ { email: "valid", password: "P@ssw0rd" }, "Email must be valid" ],
        [ { email: "valid", password: "P" }, "Email must be valid" ],
        [ { email: "valid@valid.com", password: "P" }, "Password must be between 4 and 20 characters" ],
        [ { email: "valid@valid.com", password: "aaaaaaaaaaaaaaaaaaaaa" }, "Password must be between 4 and 20 characters" ]
    ])("When supplied with %j, it should return the error message of '%s'", async (payload, expectedErrorMessage) => {
        const response = await agent
            .post(endpoint)
            .set("Content-Type", "application/json")
            .send(payload)

        const hasExpectedErrorMessage = response.body.errors
            .some((error: IError) => error.message == expectedErrorMessage)
        expect(hasExpectedErrorMessage).toBeTruthy()
    })

    test("It should return the error 'Email already registered' when the supplied email is already registered", async () => {
        const payload = { email: "vitor@anycart.com", password: "1234" }
        await agent
            .post(endpoint)
            .set("Content-Type", "application/json")
            .send(payload)
            .expect(201)

        const response = await agent
            .post(endpoint)
            .set("Content-Type", "application/json")
            .send(payload)
            .expect(400)

        const hasAlreadyRegisteredEmailErrorMessage = response.body.errors
            .some((error: IError) => error.message == "Email already registered")
        expect(hasAlreadyRegisteredEmailErrorMessage).toBeTruthy()
    })

    test("It should set the response header 'Set-Cookie'", async () => {
        const payload = { email: "vitor@anycart.com", password: "1234" }
        const response = await agent
            .post(endpoint)
            .set("Content-Type", "application/json")
            .send(payload)

        expect(response.get("Set-Cookie")).toBeDefined()
    })
})