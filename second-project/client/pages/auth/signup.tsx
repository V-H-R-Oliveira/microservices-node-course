import Router from 'next/router'
import { NextPage } from 'next/types'
import AuthForm from '../../components/AuthForm'
import { IUseRequest } from "../../hooks/useRequest"

const Signup: NextPage = () => {
  const useRequestProps: IUseRequest = { url: "/api/v1/users/signup", method: "POST", data: null, onSuccess: () => Router.push("/") }
  return <AuthForm formTitle='Signup' submitFormBtnLabel='Signup' useRequestProps={useRequestProps} />
}

export default Signup