import mongoose from "mongoose"
import process from "process"
import { DatabaseConnectionError } from "@vhr_gittix/common-lib"
import { app } from "./app"
import { stan } from "./natsClient"
import OrderCreatedListener from "./events/listeners/orderCreated"
import OrderCancelledListener from "./events/listeners/orderCancelled"
import OrderCompleteListener from "./events/listeners/orderComplete"

const port = process.env?.PORT ?? 8080

const gracefulShutdown = async () => {
    stan.client.close()
    await Promise.all(mongoose.connections.map((conn) => conn.close()))
}

const bootstrap = async () => {
    if (!process.env?.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }

    if (!process.env?.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined")
    }

    if (!process.env?.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined")
    }

    if (!process.env?.NATS_URL) {
        throw new Error("NATS_URL must be defined")
    }

    if (!process.env?.MONGO_URI) {
        throw new DatabaseConnectionError()
    }

    if (!process.env?.STRIPE_KEY) {
        throw new Error("STRIPE_KEY must be defined")
    }

    await stan.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    stan.client.on("close", () => {
        console.info("Closing NATS connection")
        process.exit()
    })

    const orderCreatedListener = new OrderCreatedListener(stan.client)
    const orderCancelledListener = new OrderCancelledListener(stan.client)
    const orderCompleteListener = new OrderCompleteListener(stan.client)

    orderCreatedListener.listen()
    orderCancelledListener.listen()
    orderCompleteListener.listen()

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Successfully connected to mongodb")

    process.on("SIGINT", gracefulShutdown)
    process.on("SIGTERM", gracefulShutdown)
}

app.listen(port, async () => {
    await bootstrap()
    console.info("Listen at port", port)
})