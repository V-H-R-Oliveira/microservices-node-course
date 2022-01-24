import React from "react"
import PropTypes from "prop-types"

const Comment = ({title, content, status}) => {
    const formattedComponent = () => {
        if (status == "rejected" || status == "pending") {
            return (
                <>
                    <p className="card-title">Comment moderation {status}</p>
                </>
            )

        }

        return (
            <>
                <p className="card-title">{title}</p>
                <article className="card-text">{status == "rejected" || status == "pending" ? status : content}</article>
            </>
        )
    }

    return (
        <div className="w-100 card my-2 text-center">
            <div className="card-body">
                {formattedComponent()}
            </div>
        </div>
    )
}

Comment.propTypes = {
    title: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.string
}

export default Comment