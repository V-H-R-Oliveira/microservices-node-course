import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { ICurrentUser, ITicket } from "../../components/ICommonTypes"
import CreateTicket from "../../components/CreateTicket"

interface ICreateTicketPage extends ICurrentUser {
    ticket: ITicket
}

const CreateTicketPage: NextPage<ICreateTicketPage> = ({ ticket, currentUser }) => {
    if (currentUser) {
        return <CreateTicket ticket={ticket} />
    }

    return <div>Not authorized</div>
}

CreateTicketPage.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance, currentUser: ICurrentUser) => {
    const response = await client.get(`/api/v1/tickets/${ctx.query.ticketId}`)
    return { ticket: response.data, currentUser }
}

export default CreateTicketPage