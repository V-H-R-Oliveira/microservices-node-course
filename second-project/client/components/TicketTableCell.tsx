import Link from "next/link"
import { FC } from "react"
import { ICurrentUser, ITicket } from "./ICommonTypes"

interface ITicketTableCell extends ICurrentUser {
    ticket: ITicket
}

const TicketTableCell: FC<ITicketTableCell> = ({ ticket, currentUser }) => {

    const CurrentUserTicketOperations: FC = () => {
        const userId = currentUser?.id
        const ticketUserId = ticket.userId

        if (userId == ticketUserId) {
            return (
                <>
                    <Link href="/tickets/edit/[ticketId]" as={`/tickets/edit/${ticket.id}`}>
                        <a className="nav-link px-1">Edit Ticket</a>
                    </Link>
                    <Link href="/tickets/delete/[ticketId]" as={`/tickets/delete/${ticket.id}`}>
                        <a className="nav-link px-1">Delete Ticket</a>
                    </Link>
                </>
            )
        }

        return <></>
    }

    return (
        <tr>
            <td scope="row" className="text-center align-middle">{ticket.title}</td>
            <td scope="row" className="text-center align-middle">{ticket.price}</td>
            <td scope="row align-middle">
                <div className="d-flex justify-content-center align-items-center">
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a className="nav-link px-1">View Ticket</a>
                    </Link>

                    <CurrentUserTicketOperations />
                </div>
            </td>
        </tr>
    )
}

export default TicketTableCell