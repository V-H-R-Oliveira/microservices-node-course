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

    fetchPostsCommentsByPostId(postId) {
        return this.db.has(postId) ? this.db.get(postId) : []
    }

    updatePostComment(comment) {
        const commentsByPostId = this.db.has(comment.postId) ? this.db.get(comment.postId) : []
        const updatedComment = commentsByPostId.find((postComment) => postComment.id == comment.id)

        if (updatedComment) {
            this.db.set(comment.postId, [...commentsByPostId.filter((postComment) => postComment.id != comment.id), updatedComment])
        }
    }
}
