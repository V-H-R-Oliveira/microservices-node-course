import { createServer } from "http"
import process from "process"

const server = createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ data: "Hello world.", success: true }))
})

const port = process.env.PORT ?? 8080

console.log("Running at port:", port)
server.listen(port)