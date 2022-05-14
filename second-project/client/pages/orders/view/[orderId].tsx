import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { IOrder } from "../../../components/ICommonTypes"
import ViewOrder from "../../../components/ViewOrder"

interface IViewOrderPage {
    order: IOrder
}

const ViewOrderPage: NextPage<IViewOrderPage> = ({ order }) => {
  return <ViewOrder order={order} />
}

ViewOrderPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance) => {
    const orderId = ctx.query.orderId
    const res = await client.get(`/api/v1/orders/${orderId}`)
    return { order: res.data }
}

export default ViewOrderPage