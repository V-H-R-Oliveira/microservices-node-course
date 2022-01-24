import { REFRESH_COMMENTS, REFRESH_POSTS } from "../constants/constants"

const AppReducer = (state, action) => {
    switch (action.type) {
    case REFRESH_POSTS:
        return {
            ...state,
            posts: action.payload ?? [],
        }
    case REFRESH_COMMENTS: {
        const { postId, comments } = action.payload

        const currentPost = state.posts.find((post) => post.id == postId)
        currentPost.comments = comments

        return {
            ...state,
            posts: [...state.posts.filter((post) => post.id != postId), currentPost]
        }

    }
    default:
        return state
    }
}

export default AppReducer
