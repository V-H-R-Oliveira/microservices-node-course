import axios from "axios"

export const postsHttpClient = axios.create({
    baseURL: "http://posts.com/api/v1",
})

export const commentsHttpClient = axios.create({
    baseURL: "http://posts.com/api/v1/posts",
})

export const queryHttpClient = axios.create({
    baseURL: "http://posts.com/api/v1"
})