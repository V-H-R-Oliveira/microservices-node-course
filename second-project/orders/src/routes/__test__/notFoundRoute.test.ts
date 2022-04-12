import { describe, test } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

describe("Testing an invalid endpoint", () => {
    const agent = request(app)

    test("Should return a status 404 if the route does not exist", () => {
        return agent.get("/invalid").expect(404)
    })
})