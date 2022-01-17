import { postsHttpClient  } from "../httpClients/httpClients"

const fetchAllPosts = async () => {
    const response = await postsHttpClient.get("/posts")
    return response.data.posts
}

export { fetchAllPosts }