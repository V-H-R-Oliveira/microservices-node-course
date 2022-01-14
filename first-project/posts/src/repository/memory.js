import { v4 } from "uuid"

export default class MemoryRepository {
    constructor() {
        this.db = new Map()
    }

    savePost(post) {
        const postId = v4()

        Object.assign(post, { id: postId })
        this.db.set(postId, post)

        return postId
    }

    fetchPosts() {
        return [...this.db.values()]
    }
}
