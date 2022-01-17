import React, { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { httpClient } from "../httpClients/posts-service"

const PostCreateForm = () => {
    const [state, setState] = useState({ title: "", content: "" })
    const { refreshPosts } = useContext(AppContext)

    const onChangeHandler = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const resetState = () => {
        setState({
            title: "",
            content: "",
        })
    }

    const sendPost = async () => {
        const newPost = { ...state }
        const response = await httpClient.post("/post", newPost)
        await refreshPosts()

        alert(`Created post ${response.data.postId}`)
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        await sendPost()
        resetState()
    }

    return (
        <div>
            <h1 className="text-center h3">Create Post</h1>
            <form onSubmit={onSubmitHandler}>
                <div className="form-group">
                    <label htmlFor="title" className="h4 my-2">Title</label>
                    <input id="title" name="title" className="form-control" type="text"
                        placeholder="Enter the post title" value={state.title} onChange={onChangeHandler} required />
                </div>

                <div className="form-group my-2">
                    <label htmlFor="content" className="h4 my-2">Content</label>
                    <textarea id="content" name="content" className="form-control"
                        cols="30" rows="10" placeholder="Enter the post content"
                        value={state.content} onChange={onChangeHandler} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary mt-2">Submit</button>
            </form>
        </div>
    )
}

export default PostCreateForm