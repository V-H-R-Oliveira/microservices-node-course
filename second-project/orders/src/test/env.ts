import process from "process"

process.env.JWT_KEY = "1234"
process.env.NODE_ENV = "test"
process.env.EXPIRATION_WINDOW_SECONDS = (15 * 60).toString()