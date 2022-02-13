interface IError {
    message: string
    field?: string
}

interface IErrorFormat {
    formatError(): IError[]
}

export { IError, IErrorFormat }