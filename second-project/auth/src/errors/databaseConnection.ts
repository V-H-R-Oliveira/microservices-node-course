import CustomError from "./customError"

export default class DatabaseConnectionError extends CustomError {
    constructor() {
        super("Failed to connect to the database", 500)
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    formatError() {
        return {
            statusCode: this._statusCode,
            errors: [ {
                message: "Failed to connect to the database"
            } ]
        }
    }
}