import { connect } from "node-nats-streaming"
import process from "process"
import { TicketCreatedListener } from "./events/ticketCreateListener"

console.clear()

const stan = connect("ticketing", "listener-1", {
    url: "http://localhost:4222"
})

stan.on("connect", () => {
    console.log("Listener connected to NATS")

    stan.on("connection_lost", (error) => {
        console.error("disconnected from stan", error)
    })

    stan.on("close", process.exit)

    const listener = new TicketCreatedListener(stan)
    listener.listen()
})

process.on("SIGINT", stan.close)
process.on("SIGTERM", stan.close)
