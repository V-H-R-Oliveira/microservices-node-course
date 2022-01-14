import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { validate } from "uuid"
import { app } from "../app.js"

describe("Testing Post router", () => {
    const agent = request.agent(app)

    describe("Testing /api/v1/posts", () => {
        const URL = "/api/v1/posts"

        test("It should get a 200 status", () => {
            return agent.get(URL).expect(200)
        })

        test("It should have the Content-Type header with the application/json value", () => {
            return agent.get(URL).expect("Content-Type", /json/)
        })

        test("It should have the field posts in the response", async () => {
            const response = await agent.get(URL)
            expect(response.body).toHaveProperty("posts")
        })

        test("It should return a list of posts", async () => {
            const response = await agent.get(URL)
            expect(response.body.posts).toBeInstanceOf(Array)
        })
    })

    describe("Testing /api/v1/post", () => {
        const URL = "/api/v1/post"

        const TEST_REQUEST_BODY = {
            title: "testing",
            content: "Testing post"
        }

        test("It should create a new post and the response should contain the postId field", async () => {
            const response = await agent.post(URL).set("Content-Type", "application/json").send(TEST_REQUEST_BODY)
            expect(response.body).toHaveProperty("postId")
        })

        test("It should create a new post and the response should contain a valid uuid", async () => {
            const response = await agent.post(URL).set("Content-Type", "application/json").send(TEST_REQUEST_BODY)
            const isValidId = validate(response.body.postId)
            expect(isValidId).toBeTruthy()
        })

        test("It should return status 400 when trying to create an invalid post", () => {
            return agent.post(URL).expect(400)
        })
    })
})