import axios from "axios"

export default class Subscriber {
    constructor(url) {
        this.url = url
    }

    async update(data) {
        try {
            await axios.post(this.url, data)
        } catch (err) {
            console.error(`Failed to send ${data} to url ${this.url} due error:`, err)
        }
    }
}