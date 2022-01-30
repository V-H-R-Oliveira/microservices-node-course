import EventEmitter from "events"
import axios from "axios"
import { COMMENT_MODERATED, COMMENT_REJECTED, COMMENT_UPDATED, SEND_COMMENT_UPDATE } from "../constants/constants.js"

export const eventListener = new EventEmitter()

eventListener.on(COMMENT_MODERATED, async function (repository, comment) {
    comment.status = "approved"
    repository.updatePostComment(comment)
    await this.emit(SEND_COMMENT_UPDATE, comment)
})

eventListener.on(COMMENT_REJECTED, async function (repository, comment) {
    comment.status = "rejected"
    repository.updatePostComment(comment)
    await this.emit(SEND_COMMENT_UPDATE, comment)
})

eventListener.on(SEND_COMMENT_UPDATE, async (updatedComment) => {
    const event = {
        type: COMMENT_UPDATED,
        payload: updatedComment
    }

    await axios.post("http://event-bus:7000/v1/events", event)
})