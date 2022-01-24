import axios from "axios"

export const postsHttpClient = axios.create({
    baseURL: "http://localhost:8000/api/v1",
})

export const commentsHttpClient = axios.create({
    baseURL: "http://localhost:9000/api/v1/posts",
})

export const queryHttpClient = axios.create({
    baseURL: "http://localhost:4090/api/v1"
})