import { v4 } from "uuid"

export default class MemoryRepository {
    constructor() {
        this.db = new Map()
    }

    savePostComment(comment) {
        const commentId = v4()

        Object.assign(comment, { id: commentId })
        this.db.set(commentId, comment)

        return commentId
    }

    fetchPostsComents(postId) {
        const comments = [...this.db.values()].filter((comment) => comment.postId == postId)
        return comments
    }
}
