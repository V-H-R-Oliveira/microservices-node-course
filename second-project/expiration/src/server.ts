import process from "process"
import OrderCreatedListener from "./events/listeners/orderCreated"
import { stan } from "./natsClient"

const bootstrap = async () => {
    if (!process.env?.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined")
    }

    if (!process.env?.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined")
    }

    if (!process.env?.NATS_URL) {
        throw new Error("NATS_URL must be defined")
    }

    await stan.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

    stan.client.on("close", () => {
        console.info("Closing NATS connection")
        process.exit()
    })

    process.on("SIGINT", stan.client.close)
    process.on("SIGTERM", stan.client.close)

    const orderCreatedListener = new OrderCreatedListener(stan.client)
    orderCreatedListener.listen()
}

bootstrap()