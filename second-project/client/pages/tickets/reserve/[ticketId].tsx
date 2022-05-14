import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { ICurrentUser, ITicket } from "../../../components/ICommonTypes"
import ReserveTicket from "../../../components/ReserveTicket"

interface IReserveTicketPage extends ICurrentUser {
    ticket: ITicket
}

const ReserveTicketPage: NextPage<IReserveTicketPage> = ({ ticket, currentUser }) => {
    if (currentUser) {
        return <ReserveTicket ticket={ticket} />
    }

    return <div>Not authorized</div>
}

ReserveTicketPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance, currentUser: ICurrentUser) => {
    const response = await client.get(`/api/v1/tickets/${ctx.query.ticketId}`)
    return { ticket: response.data, currentUser }
}

export default ReserveTicketPage