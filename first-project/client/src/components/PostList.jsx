import React, { useContext, useEffect } from "react"
import { AppContext } from "../context/AppContext"
import Post from "./Post"

const PostList = () => {
    const { posts, refreshPosts } = useContext(AppContext)

    useEffect(async() => {
        await refreshPosts()
    }, [])

    return (
        <div className="container">
            <h3 className="text-center my-2 h3">Posts</h3>

            <div className="d-flex flex-row flex-wrap justify-content-between">
                { posts.map((post) => <Post key={post.id} title={post.title} content={post.content} />)}
            </div>
        </div>
    )
}

export default PostList