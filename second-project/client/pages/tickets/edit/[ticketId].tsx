import Router from "next/router"
import { AxiosInstance } from "axios"
import { NextPage, NextPageContext } from "next/types"
import { ICurrentUser, ITicket } from "../../../components/ICommonTypes"
import TicketForm from "../../../components/TicketForm"
import { IUseRequest } from "../../../hooks/useRequest"

interface IEditTicketForm extends ICurrentUser {
    ticket: ITicket
}

const EditTicket: NextPage<IEditTicketForm> = ({ ticket, currentUser }) => {
    if (currentUser) {
        const editTicketRequestProps: IUseRequest = { url: `/api/v1/tickets/${ticket.id}`, method: "PUT", data: {}, onSuccess: () => Router.push("/") }
        return <TicketForm formTitle="Edit Ticket" submitFormBtnLabel="Edit" ticket={ticket} useRequestProps={editTicketRequestProps} />
    }

    return <div>Not authorized</div>
}

EditTicket.getInitialProps = async (ctx: NextPageContext, client: AxiosInstance, currentUser: ICurrentUser) => {
    const response = await client.get(`/api/v1/tickets/${ctx.query.ticketId}`)
    return { ticket: response.data, currentUser }
}

export default EditTicket