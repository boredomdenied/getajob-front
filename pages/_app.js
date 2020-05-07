import { AppProps } from 'next/app'
import '../styles/index.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, Slide } from 'react-toastify';


function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
