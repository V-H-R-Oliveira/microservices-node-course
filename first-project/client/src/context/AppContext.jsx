import React, { createContext, useReducer } from "react"
import PropTypes, { string } from "prop-types"
import AppReducer from "../reducers/AppReducer"
import { fetchAllCommentsByPostId, fetchAllPosts } from "../utils/utils"
import { REFRESH_POSTS, REFRESH_COMMENTS } from "../constants/constants"

const initialValues = { posts: [], refreshCommentsByPostId: async () => null, refreshPosts: async () => null }

export const AppContext = createContext(initialValues)

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialValues)

    const refreshPosts = async () => {
        const posts = await fetchAllPosts()
        dispatch({ type: REFRESH_POSTS, payload: posts })
    }

    const refreshCommentsByPostId = async (postId) => {
        const comments = await fetchAllCommentsByPostId(postId)
        dispatch({ type: REFRESH_COMMENTS, payload: comments })
    }

    return (
        <AppContext.Provider value={{ refreshPosts, refreshCommentsByPostId, posts: state.posts }}>
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({id: string, title: string, content: string})),
    refreshCommentsByPostId: PropTypes.func,
    refreshPosts: PropTypes.func,
    children: PropTypes.node
}