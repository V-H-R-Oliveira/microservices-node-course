import EventEmitter from "events"
import { COMMENT_CREATED, POST_CREATED, COMMENT_UPDATED, FETCH_EVENTS } from "../constants/constants.js"
import { fetchAllEvents } from "../utils/utils.js"

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

eventListener.on(FETCH_EVENTS, async (repository) => {
    const data = await fetchAllEvents()
    const postsId = Object.keys(data)
    const availableListeners = eventListener.eventNames()

    for (const postId of postsId) {
        const events = data?.[postId]?.filter((event) => availableListeners.includes(event.type))

        for (const event of events) {
            eventListener.emit(event.type, repository, event.payload)
        }
    }
})