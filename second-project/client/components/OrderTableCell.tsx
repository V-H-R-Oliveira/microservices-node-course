import Link from "next/link"
import { FC } from "react"
import { IOrder } from "./ICommonTypes"
import ShowRefund from "./ShowRefund"

interface IOrderTableCell {
    order: IOrder
}

const OrderTableCell: FC<IOrderTableCell> = ({ order }) => {
    const isOrderCancelled = order.status == "cancelled"

    return (
        <tr>
            <td scope="row" className="text-center">{order.ticket.title}</td>
            <td scope="row" className="text-center">{order.ticket.price}</td>
            <td scope="row" className="text-center">{order.status}</td>
            <td scope="row" className="text-center"><ShowRefund orderId={order.id} /></td>
            <td scope="row" className="text-center d-flex justify-content-center">
                <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                    <a className="nav-link">View Order</a>
                </Link>
                {!isOrderCancelled  &&
                    <Link href="/orders/cancel/[orderId]" as={`/orders/cancel/${order.id}`}>
                        <a className="nav-link">Cancel Order</a>
                    </Link>
                }

            </td>
        </tr>
    )
}

export default OrderTableCell