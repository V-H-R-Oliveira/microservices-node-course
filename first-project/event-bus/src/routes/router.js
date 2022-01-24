import { Router } from "express"
import { publisher } from "../services/services.js"

const router = Router({ strict: true, caseSensitive: true })

router.post("/events", async (req, res) => {
    const data = req.body
    await publisher.notifyAll(data)
    res.sendStatus(200)
})

export { router }