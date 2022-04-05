import process from "process"
import { randomUUID } from "crypto"
import { connect } from "node-nats-streaming"
import { TicketCreatedPublisher } from "./events/ticketCreatedPublisher"

console.clear()

const publisherID = randomUUID()

const stan = connect("ticketing", publisherID, {
    url: "http://localhost:4222"
})

stan.on("connect", async () => {
    console.log("Publisher connected to NATS")

    stan.once("connection_lost", (error) => {
        console.error("disconnected from stan", error)
    })

    stan.once("close", () => process.exit())

   const data = {
        id: randomUUID(),
        title: "test",
        price: 1.2
    }

    const publisher = new TicketCreatedPublisher(stan)

    await publisher.publish(data)

    // stan.publish("ticket:created", data, (err, guid) => {
    //     if (err) {
    //         console.error("Failed to publish due error:", err)
    //         return
    //     }

    //     console.log("Published event", guid)
    // })
})

process.once("SIGINT", () => stan.close())
process.once("SIGTERM", () => stan.close())