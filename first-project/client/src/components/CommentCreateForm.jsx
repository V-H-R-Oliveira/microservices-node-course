import React, { useContext, useState } from "react"
import PropTypes from "prop-types"
import { commentsHttpClient } from "../httpClients/httpClients"
import { AppContext } from "../context/AppContext"

const CommentCreateForm = ({postId}) => {
    const [state, setState] = useState({title: "", content: ""})
    const { refreshCommentsByPostId } = useContext(AppContext)

    const onChangeHandler = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

    const resetState = () => {
        setState({
            ...state,
            title: "",
            content: ""
        })
    }

    const sendComment = async () => {
        const newComment = {...state, status: "pending"}
        const response = await commentsHttpClient.post(`${postId}/comment`, newComment)
        return response.data.commentId
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        const commentId = await sendComment()
        await refreshCommentsByPostId(postId)

        alert(`Comment ${commentId} saved.`)

        resetState()
    }

    return (
        <div>
            <p className="h3">Add a comment to this post</p>
            <form onSubmit={onSubmitHandler}>
                <div className="form-group">
                    <label htmlFor="title" className="h4 my-2">Title</label>
                    <input id="title" name="title" className="form-control" type="text"
                        placeholder="Enter the comment title" value={state.title} onChange={onChangeHandler} required />
                </div>

                <div className="form-group my-2">
                    <label htmlFor="content" className="h4 my-2">Content</label>
                    <textarea id="content" name="content" className="form-control"
                        cols="30" rows="10" placeholder="Enter the comment content"
                        value={state.content} onChange={onChangeHandler} required></textarea>
                </div>

                <button type="submit" className="btn btn-primary mt-2">Submit</button>

            </form>
        </div>
    )

}

CommentCreateForm.propTypes = {
    postId: PropTypes.string
}

export default CommentCreateForm