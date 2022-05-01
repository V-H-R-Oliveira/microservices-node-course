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
            <td scope="row" className="text-center">
                <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                    <a className="nav-link">View Ticket</a>
                </Link>
            </td>
        </tr>
    )
}

export default TicketTableCell