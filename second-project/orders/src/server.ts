import mongoose from "mongoose"
import process from "process"
import { DatabaseConnectionError } from "@vhr_gittix/common-lib"
import { app } from "./app"
import { stan } from "./natsClient"
import TicketCreatedListener from "./events/listeners/ticketCreated"
import TicketUpdatedListener from "./events/listeners/ticketUpdated"
import ExpirationCompleteListener from "./events/listeners/expirationComplete"
import PaymentCreatedListener from "./events/listeners/paymentCreated"

const port = process.env?.PORT ?? 8080

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

    await stan.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    stan.client.on("close", () => {
        console.info("Closing NATS connection")
        process.exit()
    })

    process.on("SIGINT", stan.client.close)
    process.on("SIGTERM", stan.client.close)

    const ticketCreatedListener = new TicketCreatedListener(stan.client)
    const ticketUpdatedListener = new TicketUpdatedListener(stan.client)
    const expirationCompleteListener = new ExpirationCompleteListener(stan.client)
    const paymentCreatedListener = new PaymentCreatedListener(stan.client)

    ticketCreatedListener.listen()
    ticketUpdatedListener.listen()
    expirationCompleteListener.listen()
    paymentCreatedListener.listen()

    await mongoose.connect(process.env.MONGO_URI)
    console.log("Successfully connected to mongodb")
}

app.listen(port, async () => {
    await bootstrap()
    console.info("Listen at port", port)
})