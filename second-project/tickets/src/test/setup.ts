import process from "process"
import { beforeAll, beforeEach, afterAll } from "@jest/globals"
import { sign } from "jsonwebtoken"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"

declare global {
    // eslint-disable-next-line no-var
    var signup: () => string[]
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

global.signup = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = sign({ id: new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" }, process.env.JWT_KEY!)
    const cookie = JSON.stringify({ jwt: token })
    const base64Cookie = Buffer.from(cookie).toString("base64")

    return [ `session=${base64Cookie}` ]
}