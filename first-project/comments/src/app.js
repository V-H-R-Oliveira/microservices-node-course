import express from "express"
import cors from "cors"
import helmet from "helmet"
import { router } from "./routes/router.js"

const app = express()

app.use(express.json())

app.use(helmet())
app.use(cors())

app.use("/api/v1/", router)

export {
    app
}