import React from "react"
import PropTypes from "prop-types"

const Post = ({title, content}) => {
    return (
        <div className="w-100 card my-2 text-center">
            <div className="card-body">
                <p className="card-title">{title}</p>
                <article className="card-text">{content}</article>
            </div>
        </div>
    )
}

Post.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string
}

export default Post