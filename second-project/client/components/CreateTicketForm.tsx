import Router from 'next/router'
import { ChangeEvent, ChangeEventHandler, FC, FocusEventHandler, FormEvent, FormEventHandler, useState } from 'react'
import useRequest from '../hooks/useRequest'

interface ITicketFormState {
    title: string,
    price: string
}

const CreateTicketForm: FC = () => {
    const [formState, setFormState] = useState<ITicketFormState>({ title: "", price: "" })
    const { doRequest, errors } = useRequest({ url: "/api/v1/tickets", method: "POST", data: formState, onSuccess: () => Router.push("/") })

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

    return (
        <>
            <h1 className='text-center my-2'>Create a new ticket</h1>

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
                <button className='btn btn-primary d-block my-0 mx-auto my-2'>Create</button>
            </form>
        </>
    )
}

export default CreateTicketForm