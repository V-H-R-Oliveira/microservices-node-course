import { commentsHttpClient, postsHttpClient  } from "../httpClients/httpClients"

const fetchAllPosts = async () => {
    const response = await postsHttpClient.get("/posts")
    return response.data.posts
}

const fetchAllCommentsByPostId = async (postId) => {
    const response = await commentsHttpClient.get(`${postId}/comments`)
    return {
        postId,
        comments: response.data.comments
    }
}

export { fetchAllPosts, fetchAllCommentsByPostId }