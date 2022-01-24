import Subscriber from "../bus/subscriber.js"
import Publisher from "../bus/publisher.js"

export const publisher = new Publisher()

const subscribersList = [
    "http://localhost:8000/api/v1/events", // posts service
    "http://localhost:9000/api/v1/events", // comments service
    "http://localhost:4090/api/v1/events", // query service
    "http://localhost:9091/api/v1/events" // moderation service
]

subscribersList.forEach((serviceUrl) => {
    const subscriber = new Subscriber(serviceUrl)
    publisher.addNewSubscriber(subscriber)
})