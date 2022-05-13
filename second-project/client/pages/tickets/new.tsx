import Router from 'next/router'
import { NextPage } from "next/types"
import TicketForm from "../../components/TicketForm"
import { IUseRequest } from '../../hooks/useRequest'

const NewTicket: NextPage = () => {
    const createTicketRequestProps: IUseRequest = { url: "/api/v1/tickets", method: "POST", data: {}, onSuccess: () => Router.push("/") }
    return <TicketForm formTitle="Create a new ticket" submitFormBtnLabel="Create" useRequestProps={createTicketRequestProps} />
}

export default NewTicket