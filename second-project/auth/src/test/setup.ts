import { beforeAll, beforeEach, afterAll } from "@jest/globals"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import agent from "supertest"
import { app } from "../app"

declare global {
    // eslint-disable-next-line no-var
    var signup: () => Promise<string[]>
}

let mongodb: MongoMemoryServer

beforeAll(async () => {
    mongodb = await MongoMemoryServer.create()
    const mongoURI = mongodb.getUri()
    await mongoose.connect(mongoURI)
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    await Promise.all(collections.map((collection) => collection.deleteMany({})))
})

afterAll(async () => {
    await mongoose.connection.close()
    await mongodb.stop()
})

global.signup = async () => {
    const user = { email: "vitor@test.com", password: "1234" }
    const response = await agent(app).post("/api/v1/users/signup").send(user).expect(201)
    return response.get("Set-Cookie")
}