/* eslint-disable no-var */
import process from "process"
import { beforeAll, beforeEach, afterAll, jest } from "@jest/globals"
import { sign } from "jsonwebtoken"
import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { IOrderDoc, Order } from "../models/order"
import { OrderStatus } from "@vhr_gittix/common-lib"

declare global {
    var signup: (id?:string) => string[]
    var createOrder: (userId?:string) => Promise<IOrderDoc>
}

let mongodb: MongoMemoryServer

jest.mock("../natsClient")

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

global.createOrder = (userId?: string) => {
    return Order.build({
        originalOrderId: new mongoose.Types.ObjectId().toString(),
        price: +(Math.floor(Math.random() * (1000 - 1 + 1) + 1)).toFixed(2),
        status: OrderStatus.CREATED,
        userId: userId || new mongoose.Types.ObjectId().toString()
    }).save()
}

global.signup = (id?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const token = sign({ id: id || new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" }, process.env.JWT_KEY!)
    const cookie = JSON.stringify({ jwt: token })
    const base64Cookie = Buffer.from(cookie).toString("base64")

    return [ `session=${base64Cookie}` ]
}