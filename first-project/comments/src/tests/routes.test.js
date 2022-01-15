import { describe, test, expect } from "@jest/globals"
import request from "supertest"
import { validate } from "uuid"
import { app } from "../app.js"

describe("Testing Post router", () => {
    const agent = request.agent(app)

    describe("Testing /api/v1/posts/:id/comment", () => {
        test("It should get a 400 status when missing a comment", () => {
            return agent.post("/api/v1/posts/123/comment").expect(400)
        })

        test("It should return a status of 201 after successfully creating a comment", () => {
            return agent.post("/api/v1/posts/356/comment").set("Content-Type", "application/json").send({title: "testing", content: "comment"}).expect(201)
        })

        test("It should have the content type response set to application/json", () => {
            return agent.post("/api/v1/posts/356/comment").set("Content-Type", "application/json").send({title: "testing", content: "comment"}).expect("Content-Type", /json/)
        })

        test("A valid response should contain the property commentId", async () => {
            const response = await agent.post("/api/v1/posts/456/comment").set("Content-Type", "application/json").send({title: "testing", content: "comment"})
            expect(response.body).toHaveProperty("commentId")
        })

        test("It should save a comment and return a valid commentId uuid", async () => {
            const response = await agent.post("/api/v1/posts/123/comment").set("Content-Type", "application/json").send({title: "testing", content: "comment"})
            const isValidId = validate(response.body.commentId)
            expect(isValidId).toBeTruthy()
        })
    })

    describe("Testing /api/v1/posts/:id/comments", () => {
        test("It should return a 200 status given a postId", () => {
            return agent.get("/api/v1/posts/1234/comments").expect(200)
        })

        test("It should have the content type response set to application/json", () => {
            return agent.get("/api/v1/posts/1234/comments").expect("Content-Type", /json/)
        })

        test("The successfully response should contain the property comments", async () => {
            const response = await agent.get("/api/v1/posts/1234/comments")
            expect(response.body).toHaveProperty("comments")
        })

        test("It should return a list of comments given a valid postId", async () => {
            const response = await agent.get("/api/v1/posts/1234/comments")
            expect(response.body.comments).toBeInstanceOf(Array)
        })
    })
})