export default class Publisher {
    constructor() {
        this.subscribers = new Set()
    }

    addNewSubscriber(subscriber) {
        this.subscribers.add(subscriber)
    }

    async notifyAll(data) {
        try {
            await Promise.all([...this.subscribers.values()].map((subscriber) => subscriber.update(data)))
        } catch (err) {
            console.error("Failed to notify due error:", err)
        }
    }

    async notify(url, data) {
        try {
            const subscriber = [...this.subscribers.values()].find((subscriber) => subscriber.url == url)
            await subscriber.notify(data)
        } catch (err) {
            console.error(` Failed to notify ${url} due error:`, err)
        }
    }
}