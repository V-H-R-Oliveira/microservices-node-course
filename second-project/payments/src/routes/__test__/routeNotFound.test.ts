import { describe, test } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

describe("Testing an invalid endpoint", () => {
    const agent = request(app)

    test("Should return a 404 status if the route does not exist", () => {
        return agent.get("/").expect(404)
    })
})