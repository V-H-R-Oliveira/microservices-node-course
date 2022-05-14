import Router from "next/router"
import { FC } from "react"
import StripeCheckout, { Token } from "react-stripe-checkout"
import useRequest from "../hooks/useRequest"
import { ICurrentUser, IOrder } from "./ICommonTypes"

interface IStripeWrapper extends ICurrentUser {
    order: IOrder
}

const StripeWrapper: FC<IStripeWrapper> = ({ order, currentUser }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/v1/payments",
        data: { orderId: order.id },
        method: "POST",
        onSuccess: () => Router.push("/orders/view/[orderId]", `/orders/view/${order.id}`)
    })

    const onToken = async (token: Token) => {
        await doRequest({ token: token.id })
    }

    return (
        <>
            <StripeCheckout
                stripeKey="pk_test_51KrRq6GDSCqsBuxWIFgEcLWwmmk34tEIQy4KIe9YzzeBjBSCGYbwftzDI6QIY3hrnnwkJhe1vSOPEeX9I269ovxb00WX8scNXZ"
                token={onToken}
                email={currentUser!.email}
                currency="USD"
                amount={order.ticket.price * 100}
                key={order.id}
                panelLabel="Purchase"
                name={order.ticket.title}
                description={`Purchase ticket ${order.ticket.title} at price ${order.ticket.price}`}
            />
            {errors}
        </>
    )
}

export default StripeWrapper