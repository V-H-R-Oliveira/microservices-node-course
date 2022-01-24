import { Router } from "express"
import { MEMORY_DB } from "../constants/constants.js"
import RepositoryFactory from "../repository/repositoryFactory.js"
import { publisher } from "../services/services.js"

const router = Router({ strict: true, caseSensitive: true })
const repository = RepositoryFactory.getRepository(MEMORY_DB)

router.post("/events", async (req, res) => {
    const event = req.body

    try {
        repository.saveEvent(event)
        await publisher.notifyAll(event)
        res.sendStatus(200)
    } catch (err) {
        console.error(`Failed to propagate the event ${event} due error:`, err)
        res.sendStatus(500)
    }

})

router.get("/events", (req, res) => {
    const events = repository.getEvents()
    res.json({ events })
})

export { router }