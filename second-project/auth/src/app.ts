import express from "express"
import "express-async-errors"

import helmet from "helmet"
import cors from "cors"
import { router } from "./router/router"
import { errorHandler } from "./middlewares/errorHandler"
import NotFoundError from "./errors/notFoundError"


const app = express()

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use("/api/v1/users", router)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }