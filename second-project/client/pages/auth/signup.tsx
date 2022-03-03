import { NextPage } from 'next'
import Router from 'next/router'
import { ChangeEvent, ChangeEventHandler, FormEvent, FormEventHandler, useState } from 'react'
import useRequest from "../../hooks/useRequest"

interface ISignupState {
  email: string
  password: string
}

const Signup: NextPage = () => {
  const [formState, setFormState] = useState<ISignupState>({ email: "", password: "" })
  const { doRequest, errors } = useRequest({ url: "/api/v1/users/signup", method: "POST", data: formState, onSuccess: () => Router.push("/") })

  const onChangeHandler: ChangeEventHandler = (event: ChangeEvent<HTMLFormElement>) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value
    })
  }

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await doRequest()
  }

  return (
    <>
      <h1 className='text-center my-2'>Signup</h1>

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
        <button className='btn btn-primary d-block my-0 mx-auto my-2'>Sign up</button>
      </form>
    </>
  )
}

export default Signup