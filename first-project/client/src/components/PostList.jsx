import React, { useEffect, useState } from "react"
import { httpClient } from "../httpClients/posts-service"
import Post from "./Post"

const PostList = () => {
    const [state, setState] = useState({posts: []}) // TODO: move this to a react store and emit an event to trigger this update every time a new post is created

    const fetchAllPosts = async () => {
        const response = await httpClient.get("/posts")
        return response.data.posts
    }

    useEffect(async () => {
        const posts = await fetchAllPosts()

        setState({
            ...state,
            posts
        })
    }, [])

    return (
        <div className="container">
            <h3 className="text-center my-2 h3">Posts</h3>

            <div className="d-flex flex-row flex-wrap justify-content-between">
                {state.posts.map((post) => <Post key={post.id} title={post.title} content={post.content} />)}
            </div>
        </div>
    )
}

export default PostList