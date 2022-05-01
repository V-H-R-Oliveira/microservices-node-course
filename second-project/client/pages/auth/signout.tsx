/* eslint-disable react-hooks/exhaustive-deps */
import Router from 'next/router'
import { NextPage } from 'next/types'
import { useEffect } from "react"
import useRequest from "../../hooks/useRequest"

const Signout: NextPage = () => {
    const { doRequest } = useRequest({ url: "/api/v1/users/signout", method: "POST", data: null, onSuccess: () => Router.push("/") })

    useEffect(() => {
        (async () => {
            await doRequest()
        })()
    }, [])
    return <div>Signing you out...</div>
}

export default Signout