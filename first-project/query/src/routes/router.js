import { Router } from "express"
import { eventListener } from "../eventHandler/eventHandler.js"
import RepositoryFactory from "../db/repositoryFactory.js"
import { MEMORY_DB, FETCH_EVENTS } from "../constants/constants.js"

const router = Router({ strict: true, caseSensitive: true })

const repository = RepositoryFactory.getRepository(MEMORY_DB)

eventListener.emit(FETCH_EVENTS, repository)

router.post("/events", (req, res) => {
    const event = req.body

    console.log("Received event:", event)

    eventListener.emit(event.type, repository, event.payload)
    res.sendStatus(200)
})

router.get("/posts", (req, res) => {
    const posts = repository.fetchAllPosts()
    res.json({ posts })
})

router.get("/post/:id/comments", (req, res) => {
    const comments = repository.fetchCommentsByPostId(req.params.id)
    res.json({ comments })
})

export { router }