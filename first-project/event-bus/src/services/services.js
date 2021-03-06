import Subscriber from "../bus/subscriber.js"
import Publisher from "../bus/publisher.js"

export const publisher = new Publisher()

const subscribersList = [
    "http://posts-clusterip-srv:8000/api/v1/events", // posts service
    "http://comments-srv:9000/api/v1/events", // comments service
    "http://query-srv:4090/api/v1/events", // query service
    "http://moderation-srv:9091/api/v1/events" // moderation service
]

subscribersList.forEach((serviceUrl) => {
    const subscriber = new Subscriber(serviceUrl)
    publisher.addNewSubscriber(subscriber)
})