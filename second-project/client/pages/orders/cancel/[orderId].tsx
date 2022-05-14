import Router from "next/router"
import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"

const CancelOrderPage: NextPage = () => {
   Router.push("/orders")
   return <></>
}

CancelOrderPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance) => {
    await client.post(`/api/v1/orders/cancel/${ctx.query.orderId}`)
    return {}
}

export default CancelOrderPage