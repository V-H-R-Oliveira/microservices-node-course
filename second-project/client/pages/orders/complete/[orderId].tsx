import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { ICurrentUser, IOrder } from "../../../components/ICommonTypes"
import CompleteOrder from "../../../components/CompleteOrder"

interface ICompleteOrderPage extends ICurrentUser {
    order: IOrder
}

const CompleteOrderPage: NextPage<ICompleteOrderPage> = ({ order, currentUser }) => {
  return <CompleteOrder order={order} currentUser={currentUser} />
}

CompleteOrderPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance, currentUser: ICurrentUser) => {
    const orderId = ctx.query.orderId
    const res = await client.get(`/api/v1/orders/${orderId}`)
    return { order: res.data, currentUser }
}

export default CompleteOrderPage