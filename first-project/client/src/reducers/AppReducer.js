import { REFRESH_COMMENTS, REFRESH_POSTS } from "../constants/constants"

const AppReducer = (state, action) => {
    switch (action.type) {
    case REFRESH_POSTS:
        return {
            ...state,
            posts: action.payload ?? [],
        }
    case REFRESH_COMMENTS:
        state.comments.set(action.payload.postId, action.payload.comments ?? [])

        return {
            ...state,
            comments: state.comments
        }
    default:
        return state
    }
}

export default AppReducer
