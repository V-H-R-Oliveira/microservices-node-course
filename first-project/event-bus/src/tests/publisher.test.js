import { describe, test, expect } from "@jest/globals"
import Publisher from "../bus/publisher.js"
import Subscriber from "../bus/subscriber.js"

describe("Testing Publisher", () => {
    test("It should create a publisher", () => {
        const publisher = new Publisher()
        expect(publisher).toBeDefined()
        expect(publisher).not.toBeNull()
    })

    test("It should add a new subscriber", () => {
        const publisher = new Publisher()
        const subscriber = new Subscriber("")

        publisher.addNewSubscriber(subscriber)
        expect(publisher.subscribers.size).toBe(1)
    })

    test.todo("It should notify all subscribers") // TODO: need to mock subscriber update since i will use a mock url
    test.todo("It should notify one subscriber given a url")
})