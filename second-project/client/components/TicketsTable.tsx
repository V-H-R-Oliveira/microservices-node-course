import { FC } from "react"
import { ITicket } from "./ICommonTypes"
import TicketTableCell from "./TicketTableCell"

interface ITicketsTable {
    tickets: ITicket[]
}

const TicketsTable: FC<ITicketsTable> = ({ tickets }) => {
    return (
        <div className="container">
            <h1 className="text-center my-2">Tickets</h1>
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
                        {tickets.map((ticket) => <TicketTableCell key={ticket.id} ticket={ticket} />)}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TicketsTable