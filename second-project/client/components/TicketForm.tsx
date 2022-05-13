import { ChangeEvent, ChangeEventHandler, FC, FocusEventHandler, FormEventHandler, useState } from 'react'
import useRequest, { IUseRequest } from "../hooks/useRequest"
import { ITicket } from './ICommonTypes'

interface ITicketFormState {
    title: string,
    price: string
}

interface ITicketForm {
    formTitle: string
    submitFormBtnLabel: string
    useRequestProps: IUseRequest,
    ticket?: ITicket
}

const TicketForm: FC<ITicketForm> = ({ formTitle, submitFormBtnLabel, useRequestProps, ticket }) => {
    const initialState: ITicketFormState = { title: ticket?.title ?? "", price: ticket?.price?.toString() ?? "" }
    const [formState, setFormState] = useState<ITicketFormState>(initialState)
    const { doRequest, errors } = useRequest({ ...useRequestProps, data: formState })

    const onChangeHandler: ChangeEventHandler = (event: ChangeEvent<HTMLFormElement>) => {
        setFormState({
            ...formState,
            [event.target.name]: event.target.value
        })
    }

    const onBlurHandler: FocusEventHandler<HTMLInputElement> = async () => {
        const price = parseFloat(formState.price)

        if (Number.isNaN(price)) {
            return
        }

        setFormState({
            ...formState,
            price: price.toFixed(2)
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
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title"
                        className='form-control' placeholder='Enter the ticket title'
                        value={formState.title} onChange={onChangeHandler} required />
                </div>
                <div className='form-group'>
                    <label htmlFor="price">Price:</label>
                    <input type="text" name="price" id="price"
                        className='form-control' placeholder='Enter the ticket price'
                        value={formState.price} onChange={onChangeHandler} onBlur={onBlurHandler} required />
                </div>
                {errors}
                <button className='btn btn-primary d-block my-0 mx-auto my-2'>{submitFormBtnLabel}</button>
            </form>
        </>
    )
}

export default TicketForm