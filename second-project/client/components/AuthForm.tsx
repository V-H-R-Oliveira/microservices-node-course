import { ChangeEvent, ChangeEventHandler, FC, FormEventHandler, useState } from 'react'
import useRequest, { IUseRequest } from "../hooks/useRequest"

interface IAuthState {
    email: string
    password: string
}

interface IAuthForm {
    formTitle: string
    submitFormBtnLabel: string
    useRequestProps: IUseRequest
}

const AuthForm: FC<IAuthForm> = ({ formTitle, submitFormBtnLabel, useRequestProps }) => {
    const [formState, setFormState] = useState<IAuthState>({ email: "", password: "" })
    const { doRequest, errors } = useRequest({ ...useRequestProps, data: formState })

    const onChangeHandler: ChangeEventHandler = (event: ChangeEvent<HTMLFormElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        })
    }

    const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        await doRequest()
    }

    return (
        <>
            <h1 className='text-center my-2'>{formTitle}</h1>

            <form onSubmit={onSubmitHandler}>
                <div className='form-group'>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email"
                        className='form-control' placeholder='Enter your email'
                        value={formState.email} onChange={onChangeHandler} required />
                </div>
                <div className='form-group'>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password"
                        className='form-control' placeholder='Enter your password'
                        value={formState.password} onChange={onChangeHandler} required />
                </div>
                {errors}
                <button className='btn btn-primary d-block my-0 mx-auto my-2'>{submitFormBtnLabel}</button>
            </form>
        </>
    )
}

export default AuthForm