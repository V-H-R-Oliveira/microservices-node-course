import Link from "next/link"
import { FC } from "react"
import { IOrder } from "./ICommonTypes"

interface IOrderTableCell {
    order: IOrder
}

const OrderTableCell: FC<IOrderTableCell> = ({ order }) => {
    return (
        <tr>
            <td scope="row" className="text-center">{order.ticket.title}</td>
            <td scope="row" className="text-center">{order.ticket.price}</td>
            <td scope="row" className="text-center">{order.status}</td>
            <td scope="row" className="text-center">
                <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                    <a className="nav-link">View Order</a>
                </Link>
            </td>
        </tr>
    )
}

export default OrderTableCell