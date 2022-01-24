import EventEmitter from "events"
import { COMMENT_CREATED, POST_CREATED, COMMENT_UPDATED } from "../constants/constants.js"

export const eventListener = new EventEmitter()

eventListener.on(POST_CREATED, (repository, data) => {
    repository.savePost(data)
})

eventListener.on(COMMENT_CREATED, (repository, data) => {
    repository.saveComment(data)
})

eventListener.on(COMMENT_UPDATED, (repository, data) => {
    repository.updateComment(data)
})