import process from "process"
import { app } from "./app.js"

const port = process.env?.PORT || 9000

app.listen(port, () => console.log("Listen at port:", port))