const AppReducer = (state, action) => {
    switch (action.type) {
    case "REFRESH_POSTS":
        return {
            ...state,
            posts: action.payload,
        }
    default:
        return state
    }
}

export default AppReducer
