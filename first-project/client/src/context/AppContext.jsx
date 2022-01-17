import React, { createContext, useReducer } from "react"
import PropTypes, { string } from "prop-types"
import AppReducer from "../reducers/AppReducer"
import { fetchAllPosts } from "../utils/utils"
import { REFRESH_POSTS } from "../constants/constants"

const initialValues = { posts: [], refreshPosts: async () => null }

export const AppContext = createContext(initialValues)

export const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, initialValues)

    const refreshPosts = async () => {
        const posts = await fetchAllPosts()
        dispatch({ type: REFRESH_POSTS, payload: posts })
    }

    return (
        <AppContext.Provider value={{ refreshPosts, posts: state.posts }}>
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    posts: PropTypes.arrayOf(PropTypes.shape({id: string, title: string, content: string})),
    refreshPosts: PropTypes.func,
    children: PropTypes.node
}