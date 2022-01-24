import { Router } from "express"
import { eventListener } from "../eventHandler/eventHandler.js"

const router = Router({ caseSensitive: true, strict: true })


router.post("/events", (req, res) => {
    const event = req.body
    console.log("Received event:", event)
    eventListener.emit(event.type, event.payload)
    res.sendStatus(200)
})

export { router }