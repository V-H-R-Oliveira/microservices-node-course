import React, {useContext, useEffect} from "react"
import PropTypes from "prop-types"
import { AppContext } from "../context/AppContext"
import Comment from "./Comment"

const CommentList = ({postId}) => {
    const { comments, refreshCommentsByPostId  } = useContext(AppContext)

    useEffect(async() => {
        await refreshCommentsByPostId(postId)
    }, [])

    const postComments = comments.has(postId) ? comments.get(postId) : []

    return (
        <div className="container">
            <h3 className="text-center my-2 h3">Comments</h3>

            <div className="d-flex flex-row flex-wrap justify-content-between">
                { postComments.map((comment) => <Comment key={comment.id} title={comment.title} content={comment.content} />)}
            </div>
        </div>
    )
}

CommentList.propTypes = {
    postId: PropTypes.string
}

export default CommentList