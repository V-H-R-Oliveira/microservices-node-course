import { FC } from "react"
import { IOrder } from "./ICommonTypes"

interface IOrderComponent {
    order: IOrder
}

const ViewOrder: FC<IOrderComponent> = ({ order }) => {
    if (order.status == "complete") {
        return (
            <div className="text-center">
                <h1>{order.ticket.title}</h1>
                <h2>{order.ticket.price}</h2>
                <h3>Order Completed.</h3>
            </div>
        )
    }

    return (
        <div className="text-center">
            <h1>{order.ticket.title}</h1>
            <h2>{order.ticket.price}</h2>
            <h3>Order Cancelled.</h3>
        </div>
    )
}

export default ViewOrder