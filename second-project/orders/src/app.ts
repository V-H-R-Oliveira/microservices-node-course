import express from "express"
import "express-async-errors"

import cookieSession from "cookie-session"
import helmet from "helmet"
import cors from "cors"
import { router } from "./router/router"
import { isProd, errorHandler, NotFoundError, decodeTokenHandler } from "@vhr_gittix/common-lib"

const app = express()

app.set("trust proxy", true)

app.use(cookieSession({
    signed: false,
    secure: isProd(),
    httpOnly: true
}))

app.use(decodeTokenHandler)

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use("/api/v1/orders", router)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }