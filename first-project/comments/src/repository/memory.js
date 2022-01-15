import { v4 } from "uuid"

export default class MemoryRepository {
    constructor() {
        this.db = new Map()
    }

    savePostComment(postId, comment) {
        const commentId = v4()

        Object.assign(comment, { id: commentId })

        const previousComments = this.db.has(postId) ? this.db.get(postId) : []
        this.db.set(postId, [...previousComments, comment])

        return commentId
    }

    fetchPostsComents(postId) {
        return this.db.has(postId) ? this.db.get(postId) : []
    }
}
