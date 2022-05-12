import mongoose from "mongoose"
import process from "process"
import { app } from "./app"
import { DatabaseConnectionError } from "@vhr_gittix/common-lib"

const port = process.env?.PORT ?? 8080

const gracefulShutdown = async () => {
    await Promise.all(mongoose.connections.map(conn => conn.close()))
}

const bootstrap = async () => {
    if (!process.env?.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }

    try {
        if (!process.env?.MONGO_URI) {
            throw new DatabaseConnectionError()
        }

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected to mongodb")

        process.on("SIGTERM", async () => {
            await gracefulShutdown()
        })

        process.on("SIGINT", async () => {
            await gracefulShutdown()
        })
    } catch (err) {
        console.error("Failed to connect due error:", err)
        throw new DatabaseConnectionError()
    }
}

app.listen(port, async () => {
    await bootstrap()
    console.info("Listen at port", port)
})