import mongoose from "mongoose"
import process from "process"
import { app } from "./app"
import { DatabaseConnectionError } from "@vhr_gittix/common-lib"

const port = process.env?.PORT ?? 8080

const bootstrap = async () => {
    if (!process.env?.JWT_KEY) {
        throw new Error("JWT_KEY must be defined")
    }

    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth")
        console.log("Successfully connected to mongodb")
    } catch (err) {
        console.error("Failed to connect due error:", err)
        throw new DatabaseConnectionError()
    }
}

app.listen(port, async () => {
    await bootstrap()
    console.info("Listen at port", port)
})