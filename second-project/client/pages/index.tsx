import { AxiosInstance } from 'axios'
import { NextPage, NextPageContext } from 'next'
import { ICurrentUser, ITicket } from '../components/ICommonTypes'
import TicketsTable from '../components/TicketsTable'

interface IHome extends ICurrentUser {
  tickets: ITicket[]
}

const Home: NextPage<IHome> = ({ tickets, currentUser }) => {
  if (currentUser) {
    return <TicketsTable tickets={tickets} currentUser={currentUser} />
  }

  return <div>You are not signin</div>
}

Home.getInitialProps = async (_ctx: NextPageContext, client: AxiosInstance, currentUser: ICurrentUser) => {
  const response = await client.get("/api/v1/tickets")
  return { tickets: response.data.tickets, currentUser }
}

export default Home
