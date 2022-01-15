import { Router } from "express"
import { MEMORY_DB } from "../constants/constants.js"
import RepositoryFactory from "../repository/repositoryFactory.js"

const router = Router({ strict: true, caseSensitive: true })
const repository = RepositoryFactory.getRepository(MEMORY_DB)

router.post("/posts/:id/comment", (req, res) => {
    const postId = req.params?.id
    const comment = req.body

    if (!comment || !comment?.title || !comment?.content) {
        return res.status(400).json({ error: "Missing body" })
    }

    const commentId = repository.savePostComment(postId, comment)
    res.status(201).json({ commentId })
})

router.get("/posts/:id/comments", (req, res) => {
    const postId = req.params?.id
    const comments = repository.fetchPostsCommentsByPostId(postId)
    res.json({ comments })
})

export { router }