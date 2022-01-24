import { queryHttpClient  } from "../httpClients/httpClients"

const fetchAllPosts = async () => {
    const response = await queryHttpClient.get("/posts")
    return response.data.posts
}

const fetchAllCommentsByPostId = async (postId) => {
    const response = await queryHttpClient.get(`/post/${postId}/comments`)
    return {
        postId,
        comments: response.data.comments
    }
}

export { fetchAllPosts, fetchAllCommentsByPostId }