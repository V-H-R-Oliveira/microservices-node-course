import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { ICurrentUser, IOrder } from "../../components/ICommonTypes"
import OrdersTable from "../../components/OrdersTable"

interface IOrdersPage extends ICurrentUser {
    orders: IOrder[]
}

const OrdersPage: NextPage<IOrdersPage> = ({ orders }) => {
    return <OrdersTable orders={orders} />
}

OrdersPage.getInitialProps = async (_ctx: NextPageContext, client: AxiosInstance) => {
    const res = await client.get("/api/v1/orders")
    return { orders: res.data }
}

export default OrdersPage