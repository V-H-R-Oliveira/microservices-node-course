import React from "react"
import { AppProvider } from "./context/AppContext"
import PostCreateForm from "./components/PostCreateForm"
import PostList from "./components/PostList"

const App = () => {
    return (
        <div className="container">
            <AppProvider>
                <PostCreateForm />
                <PostList />
            </AppProvider>
        </div>
    )
}

export default App
