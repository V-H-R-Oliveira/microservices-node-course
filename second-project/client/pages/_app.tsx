import { AppProps } from 'next/app'
import "bootstrap/dist/css/bootstrap.css"
import Header from '../components/Header'
import { ICurrentUser } from '../components/ICommonTypes'
import { AppContextType } from 'next/dist/shared/lib/utils'
import { buildHttpClient } from '../http/client'

interface IAppComponent extends AppProps, ICurrentUser { }

// Default nextjs component - every route will pass over this component
const AppComponent = ({ Component, pageProps, currentUser }: IAppComponent) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </>
  )
}

AppComponent.getInitialProps = async (appContext: AppContextType) => {
  const httpClient = buildHttpClient(appContext.ctx)
  const response = await httpClient.get("/api/v1/users/current-user")
  const pageProps = appContext.Component.getInitialProps && await appContext.Component.getInitialProps(appContext.ctx)
  return { pageProps, currentUser: response.data }
}

export default AppComponent
