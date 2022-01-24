import React from "react"
import PropTypes from "prop-types"
import Comment from "./Comment"

const CommentList = ({ comments }) => {

    return (
        <div className="container">
            <h3 className="text-center my-2 h3">Comments</h3>

            <div className="d-flex flex-row flex-wrap justify-content-between">
                { comments.map((comment) => <Comment key={comment.id} title={comment.title} content={comment.content} status={comment.status} />)}
            </div>
        </div>
    )
}

CommentList.propTypes = {
    comments: PropTypes.array
}

export default CommentList