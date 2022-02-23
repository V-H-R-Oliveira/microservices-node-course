import express from "express"
import "express-async-errors"

import cookieSession from "cookie-session"
import helmet from "helmet"
import cors from "cors"
import { router } from "./router/router"
import { errorHandler } from "./middlewares/errorHandler"
import NotFoundError from "./errors/notFoundError"
import { isProd } from "./utils/utils"

const app = express()

app.set("trust proxy", true) // Trust request traffic as secure when using NGINX

app.use(cookieSession({
    signed: false,
    secure: isProd(),
    httpOnly: true
}))

app.use(express.json())
app.use(helmet())
app.use(cors())

app.use("/api/v1/users", router)

app.all("*", async () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }