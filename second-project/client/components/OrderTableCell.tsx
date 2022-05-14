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
            <td scope="row" className="text-center align-middle">{order.ticket.title}</td>
            <td scope="row" className="text-center align-middle">{order.ticket.price}</td>
            <td scope="row" className="text-center align-middle">{order.status}</td>
            <td scope="row" className="text-center align-middle"><ShowRefund orderId={order.id} /></td>
            <td scope="row" className="text-center align-middle">
                <div className="d-flex justify-content-center align-items-center">
                    <Link href="/orders/view/[orderId]" as={`/orders/view/${order.id}`}>
                        <a className="nav-link px-1">View Order</a>
                    </Link>
                    {!isOrderCancelled &&
                        <Link href="/orders/cancel/[orderId]" as={`/orders/cancel/${order.id}`}>
                            <a className="nav-link px-1">Cancel Order</a>
                        </Link>
                    }
                </div>
            </td>
        </tr>
    )
}

export default OrderTableCell