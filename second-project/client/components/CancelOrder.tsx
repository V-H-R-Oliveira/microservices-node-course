import Router from "next/router"
import { FC } from "react"
import useRequest from "../hooks/useRequest"

interface IOrderCancelComponent {
    orderId: string
}

const CancelOrderButton: FC<IOrderCancelComponent> = ({ orderId }) => {
    const { doRequest, errors } = useRequest({
        url: `/api/v1/orders/cancel/${orderId}`,
        data: {},
        method: "POST",
        onSuccess: () => Router.push("/orders")
    })


    const onClickHandler = async () => {
        await doRequest()
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-center my-2">You have 30 days to cancel the order</h1>
            <button className="btn btn-danger my-5" onClick={onClickHandler}>Cancel Order</button>
            {errors}
        </div>
    )
}

export default CancelOrderButton