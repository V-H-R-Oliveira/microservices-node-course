export default class MemoryRepository {
    constructor() {
        this.db = new Map()
    }

    saveEvent(event) {
        const postId = event?.payload?.postId ?? event?.payload?.id

        if (this.db.has(postId)) {
            const events = this.db.get(postId)
            events.push(event)
            this.db.set(postId, events)
            return
        }

        if (postId) {
            this.db.set(postId, [event])
            return
        }

        throw new Error("Invalid Event")
    }

    getEvents() {
        const entries = this.db.entries()
        const events = Object.fromEntries(entries)
        return events
    }
}