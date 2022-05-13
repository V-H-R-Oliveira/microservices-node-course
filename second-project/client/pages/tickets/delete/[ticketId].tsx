import Router from "next/router"
import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"

const DeleteTicketPage: NextPage = () => {
    Router.push("/")
    return <></>
}

DeleteTicketPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance) => {
    await client.delete(`/api/v1/tickets/${ctx.query.ticketId}`)
    return {}
}

export default DeleteTicketPage