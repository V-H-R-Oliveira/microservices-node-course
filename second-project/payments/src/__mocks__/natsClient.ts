import { jest } from "@jest/globals"

export const stan = {
    client: {
        publish: jest.fn( (_subject: string, _data: string, callback: () => void) => callback())
    }
}