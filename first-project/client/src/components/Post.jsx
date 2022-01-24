import React from "react"
import PropTypes from "prop-types"
import CommentCreateForm from "./CommentCreateForm"
import CommentList from "./CommentList"

const Post = ({postId, title, content, comments}) => {
    return (
        <div className="w-100 card my-2 text-center">
            <div className="card-body">
                <p className="card-title">{title}</p>
                <article className="card-text">{content}</article>
                <CommentList comments={comments} />
            </div>
            <div className="card-footer border border-dark">
                <CommentCreateForm postId={postId}/>
            </div>
        </div>
    )
}

Post.propTypes = {
    postId: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    comments: PropTypes.array
}

export default Post