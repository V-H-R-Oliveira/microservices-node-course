import { Router } from "express"
import axios from "axios"
import { MEMORY_DB, COMMENT_CREATED } from "../constants/constants.js"
import RepositoryFactory from "../repository/repositoryFactory.js"
import { eventListener } from "../eventListener/eventListener.js"

const router = Router({ strict: true, caseSensitive: true })
const repository = RepositoryFactory.getRepository(MEMORY_DB)

router.post("/posts/:id/comment", async (req, res) => {
    const postId = req.params?.id
    const comment = req.body

    if (!comment || !comment?.title || !comment?.content) {
        return res.status(400).json({ error: "Missing body" })
    }

    const commentId = repository.savePostComment(postId, comment)

    try {
        const event = { type: COMMENT_CREATED, payload: Object.assign({}, comment, { postId }) }
        await axios.post("http://localhost:7000/v1/events", event)
    } catch (err) {
        console.error(`Failed to emit event ${COMMENT_CREATED} due error:`, err)
    }

    res.status(201).json({ commentId })
})

router.get("/posts/:id/comments", (req, res) => {
    const postId = req.params?.id
    const comments = repository.fetchPostsCommentsByPostId(postId)
    res.json({ comments })
})

router.post("/events", (req, res) => {
    const event = req.body

    console.log("Received event", event)
    eventListener.emit(event.type, repository, event.payload)

    res.sendStatus(200)
})

export { router }