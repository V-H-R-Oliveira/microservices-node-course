import { httpClient } from "../httpClients/posts-service"

const fetchAllPosts = async () => {
    const response = await httpClient.get("/posts")
    return response.data.posts
}

export { fetchAllPosts }