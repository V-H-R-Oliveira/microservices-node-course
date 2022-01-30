import axios from "axios"

const fetchAllEvents = async () => {
    try {
        const response = await axios.get("http://event-bus:7000/v1/events")
        return response.data.events
    } catch (err) {
        console.error("Failed to fetch all events due error:", err)
        return []
    }
}

export {
    fetchAllEvents
}