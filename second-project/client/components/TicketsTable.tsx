import { FC } from "react"
import { ICurrentUser, ITicket } from "./ICommonTypes"
import TicketTableCell from "./TicketTableCell"

interface ITicketsTable extends ICurrentUser {
    tickets: ITicket[]
}

const TicketsTable: FC<ITicketsTable> = ({ tickets, currentUser }) => {
    return (
        <div className="container">
            <h1 className="text-center my-2">Available Tickets</h1>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col" className="text-center">Title</th>
                            <th scope="col" className="text-center">Price</th>
                            <th scope="col" className="text-center">Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => <TicketTableCell key={ticket.id} ticket={ticket} currentUser={currentUser} />)}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TicketsTable