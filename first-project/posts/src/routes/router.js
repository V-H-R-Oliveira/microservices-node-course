import { Router } from "express"
import { MEMORY } from "../constants/constants.js"
import RepositoryFactory from "../repository/repositoryFactory.js"

const router = Router({ strict: true, caseSensitive: true })

const repository = RepositoryFactory.getRepository(MEMORY)

router.post("/post", (req, res) => {
    const post = req.body

    if (!post || !post?.title || !post?.content) {
        return res.status(400).json({ error: "Missing body" })
    }

    const postId = repository.savePost(post)
    res.status(201).json({ postId })
})

router.get("/posts", (req, res) => {
    const posts = repository.fetchPosts()
    res.json({ posts })
})

export { router }