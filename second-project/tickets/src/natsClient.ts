import { Stan, connect } from "node-nats-streaming"

export default class NatsClient {
    private _client?: Stan

    get client() {
        if (!this._client) {
            throw new Error("Cannot access NATS client before accessing")
        }

        return this._client
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = connect(clusterId, clientId, { url })

        return new Promise<void>((resolve, reject) => {
            this._client?.on("connect", () => {
                console.info("Connected to NATS streaming server")
                resolve()
            })

            this._client?.on("reconnecting", () => {
                console.info("Reconnecting to NATS streaming server")
            })

            this._client?.on("reconnect", () => {
                console.info("Reconnected to NATS streaming server")
            })

            this._client?.on("unsubscribe", () => {
                console.info("Unsubscribed from NATS")
            })

            this._client?.on("error", (err) => reject(err))
        })
    }
}

export const stan = new NatsClient()