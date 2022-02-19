interface IError {
    message: string
    field?: string
}

interface IErrorFormat {
    errors: IError[]
    statusCode: number
}


export { IError, IErrorFormat }