import EventEmitter from "events"
import axios from "axios"
import { COMMENT_CREATED } from "../constants/constants.js"
import { getModerationStatus } from "../moderation/moderation.js"

export const eventListener = new EventEmitter()

eventListener.on(COMMENT_CREATED, async (comment) => {
    const newEventType = getModerationStatus(comment.content)

    const event = {
        type: newEventType,
        payload: comment
    }

    await axios.post("http://localhost:7000/v1/events", event)
})