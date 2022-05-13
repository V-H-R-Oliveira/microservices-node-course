import Link from "next/link"
import { FC } from "react"
import { ITicket } from "./ICommonTypes"

interface ITicketTableCell {
    ticket: ITicket
}

const TicketTableCell: FC<ITicketTableCell> = ({ ticket }) => {
    return (
        <tr>
            <td scope="row" className="text-center">{ticket.title}</td>
            <td scope="row" className="text-center">{ticket.price}</td>
            <td scope="row">
                <div className="d-flex justify-content-center align-items-center">
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a className="nav-link">View Ticket</a>
                    </Link>
                    <Link href="/tickets/edit/[ticketId]" as={`/tickets/edit/${ticket.id}`}>
                        <a className="nav-link">Edit Ticket</a>
                    </Link>
                    <Link href="/tickets/delete/[ticketId]" as={`/tickets/delete/${ticket.id}`}>
                        <a className="nav-link">Delete Ticket</a>
                    </Link>
                </div>
            </td>
        </tr>
    )
}

export default TicketTableCell