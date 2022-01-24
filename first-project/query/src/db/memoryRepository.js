export default class MemoryRepository {
    constructor() {
        this.db = new Map()
    }

    savePost(data) {
        data.comments = []
        this.db.set(data?.id, data)
    }

    saveComment(data) {
        if (this.db.has(data?.postId)) {
            const post = this.db.get(data.postId)
            const previousComments = post.comments

            this.db.set(data.postId, {
                ...post,
                comments: [...previousComments, data]
            })
        }
    }

    updateComment(data) {
        const post = this.db.has(data?.postId) ? this.db.get(data?.postId) : {}
        const previousComments = post.comments

        this.db.set(data?.postId, {
            ...post,
            comments: [...previousComments.filter((comment) => comment?.id != data?.id), data]
        })
    }

    fetchCommentsByPostId(postId) {
        const post = this.db.has(postId) ? this.db.get(postId) : {}
        return post?.comments
    }

    fetchAllPosts() {
        return [...this.db.values()]
    }

}