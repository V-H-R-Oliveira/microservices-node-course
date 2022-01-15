import axios from "axios"

export const httpClient = axios.create({
    baseURL: "http://localhost:9000/api/v1/posts",
})
