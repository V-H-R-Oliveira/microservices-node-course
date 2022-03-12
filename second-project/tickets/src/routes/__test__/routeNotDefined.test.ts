import { test } from "@jest/globals"
import request from "supertest"
import { app } from "../../app"

const agent = request(app)

test("Returns 404 if ticket id is invalid", () => {
    return agent.get("/test").expect(404)
})