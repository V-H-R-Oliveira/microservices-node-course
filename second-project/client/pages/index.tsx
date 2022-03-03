import { NextPage, NextPageContext } from 'next'
import { buildHttpClient } from '../http/client'

interface ICurrentUser {
  currentUser: {
    id: string,
    email: string
  } | null
}

const Home: NextPage<ICurrentUser> = ({ currentUser }) => {
  return currentUser ? <div>You are signin</div> : <div>You are not signin</div>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const httpClient = buildHttpClient(ctx)
  const response = await httpClient.get("/api/v1/users/current-user")
  return { props: { currentUser: response.data } }
}

export default Home
