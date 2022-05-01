import { FC } from "react"
import { IOrder } from "./ICommonTypes"
import OrderTableCell from "./OrderTableCell"

interface IOrdersTable {
    orders: IOrder[]
}

const OrdersTable: FC<IOrdersTable> = ({ orders }) => {
    return (
        <div className="container">
            <h1 className="text-center my-5">My Orders</h1>
            <div className="table-responsive-sm">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">Title</th>
                            <th scope="col" className="text-center">Price</th>
                            <th scope="col" className="text-center">Status</th>
                            <th scope="col" className="text-center">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => <OrderTableCell key={order.id} order={order} />)}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default OrdersTable