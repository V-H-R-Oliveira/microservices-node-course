import { NextPage, NextPageContext } from 'next'
import { ICurrentUser } from '../components/ICommonTypes'
import { buildHttpClient } from '../http/client'

const Home: NextPage<ICurrentUser> = ({ currentUser }) => {
  return currentUser ? <div>You are signin</div> : <div>You are not signin</div>
}

Home.getInitialProps = async (ctx: NextPageContext) => {
  const httpClient = buildHttpClient(ctx)
  const response = await httpClient.get("/api/v1/users/current-user")
  return { currentUser: response.data }
}

export default Home
