import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { ICurrentUser, IOrder } from "../../components/ICommonTypes"
import CreateOrder from "../../components/CreateOrder"

interface IOrderPage extends ICurrentUser {
    order: IOrder
}

const OrderPage: NextPage<IOrderPage> = ({ order, currentUser }) => {
  return <CreateOrder order={order} currentUser={currentUser} />
}

OrderPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance, currentUser: ICurrentUser) => {
    const orderId = ctx.query.orderId
    const res = await client.get(`/api/v1/orders/${orderId}`)
    return { order: res.data, currentUser }
}

export default OrderPage