import { AppProps } from 'next/app'
import "bootstrap/dist/css/bootstrap.css"

// Default nextjs component - every route will pass over this component
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
