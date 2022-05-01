import { ReactElement, useState } from "react"
import { Method } from "axios"
import FormErrorMessages from "../components/FormErrorMessages"
import { buildHttpClient } from "../http/client"

export interface IUseRequest {
    url: string,
    method: Method,
    data: object | null
    onSuccess?: (data?: any | null) => Promise<any>
}

const useRequest = ({ url, method, data, onSuccess }: IUseRequest) => {
    const [errors, setErrors] = useState<ReactElement | null>(null)
    const httpClient = buildHttpClient()

    const doRequest = async (props={}) => {
        try {
            const response = await httpClient.request({
                method,
                url,
                data: {
                    ...data,
                    ...props
                }
            })

            if (onSuccess) {
                await onSuccess(response.data)
            }

            setErrors(null)
            return response.data
        } catch (err: any) {
            return setErrors(<FormErrorMessages errors={err.response.data.errors} />)
        }
    }

    return { doRequest, errors }
}

export default useRequest