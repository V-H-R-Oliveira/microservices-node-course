import { Router } from "express"
import axios from "axios"
import { MEMORY_DB, POST_CREATED } from "../constants/constants.js"
import RepositoryFactory from "../repository/repositoryFactory.js"

const router = Router({ strict: true, caseSensitive: true })

const repository = RepositoryFactory.getRepository(MEMORY_DB)

router.post("/post", async (req, res) => {
    const post = req.body

    if (!post || !post?.title || !post?.content) {
        return res.status(400).json({ error: "Missing body" })
    }

    const postId = repository.savePost(post)

    try {
        const event = { type: POST_CREATED, payload: post }
        await axios.post("http://localhost:7000/v1/events", event)
    } catch (err) {
        console.error(`Failed to emit event ${POST_CREATED} due error:`, err)
    }

    res.status(201).json({ postId })
})

router.get("/posts", (req, res) => {
    const posts = repository.fetchPosts()
    res.json({ posts })
})

router.post("/events", (req, res) => {
    const event = req.body
    console.log("Received event", event)
    res.sendStatus(200)
})

export { router }