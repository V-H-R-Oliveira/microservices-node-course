import Router from "next/router"
import { FC } from "react"
import useRequest from "../hooks/useRequest"
import { IOrder, ITicket } from "./ICommonTypes"

interface ITicketComponent {
    ticket: ITicket
}

const CreateTicket: FC<ITicketComponent> = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/v1/orders",
        data: { ticketId: ticket.id },
        method: "POST",
        onSuccess: (order: IOrder) => Router.push("/orders/[orderId]", `/orders/${order.id}`)
    })

    const onPurchase = async () => {
        console.log("Purcharsing ticket", ticket.id)
        const order = await doRequest()
        console.log("Order created", order)
    }

    return (
        <div className="my-5">
            <h1 className="text-center">{ticket.title}</h1>
            <h3 className="text-center">{ticket.price}</h3>
            <button className="btn btn-primary d-block my-0 mx-auto my-5" onClick={onPurchase}>Purchase</button>
            {errors}
        </div>
    )
}

export default CreateTicket