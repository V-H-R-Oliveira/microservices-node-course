import { NextPage } from 'next'
import Router from 'next/router'
import AuthForm from '../../components/AuthForm'
import { IUseRequest } from "../../hooks/useRequest"

const Signin: NextPage = () => {
    const useRequestProps: IUseRequest = { url: "/api/v1/users/signin", method: "POST", data: null, onSuccess: () => Router.push("/") }
    return <AuthForm formTitle='Signin' submitFormBtnLabel='Signin' useRequestProps={useRequestProps} />
}

export default Signin