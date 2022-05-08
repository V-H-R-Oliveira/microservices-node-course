import { FC, useEffect, useState } from "react"
import useRequest from "../hooks/useRequest"

interface IShowRefund {
    orderId: string
}

interface IRefundProps {
    amount: number,
    currency: string
}

const ShowRefund: FC<IShowRefund> = ({ orderId }) => {
    const { doRequest } = useRequest({
        url: `/api/v1/payments/refunds/${orderId}`,
        data: {},
        method: "GET",
    })

    const [refund, setRefund] = useState<IRefundProps>({ amount: 0, currency: "" })

    useEffect(() => {
        const getRefund = async () => {
            const refundData = await doRequest()

            if(refundData) {
                setRefund(refundData)

            }
        }

        getRefund()
    }, [])

    return (
        <div className="d-inline-flex justify-content-center">
            <small><strong>${refund.amount} {refund.currency}</strong></small>
        </div>
    )
}

export default ShowRefund