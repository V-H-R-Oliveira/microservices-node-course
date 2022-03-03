import { FC } from "react"

interface IError {
    message: string
    field?: string
}

interface IFormErrorMessagesComponent {
    errors: IError[]
}

const FormErrorMessages: FC<IFormErrorMessagesComponent> = ({ errors }) => {
    return <div className="alert alert-danger">
        <h4>Ooops...</h4>
        <ul className="my-0 list-group list-group-flush">
            {errors?.map((err, key) => <li key={key} className='list-group-item list-group-item-danger'>{err.message}</li>)}
        </ul>
    </div>
}

export default FormErrorMessages