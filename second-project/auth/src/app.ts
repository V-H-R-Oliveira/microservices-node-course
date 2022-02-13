import express from "express"
import helmet from "helmet"
import cors from "cors"
import { router } from "./router/router"
import { errorHandler } from "./middlewares/errorHandler"


const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use("/api/v1/users", router)
app.use(errorHandler)

export { app }