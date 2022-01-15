import React from "react"
import PostCreate from "./components/PostCreate"
import PostList from "./components/PostList"

function App() {
    return (
        <div className="container">
            <PostCreate />
            <PostList />
        </div>
    )
}

export default App
