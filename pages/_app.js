import 'react-toastify/dist/ReactToastify.min.css'
import '../styles/index.css'
import { AppProps } from 'next/app'
import { ToastContainer, Slide } from 'react-toastify'

const MyApp = ({ Component, pageProps }) => {

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        className=""
        position="top-center"
        autoClose={3000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange
        draggable={false}
        pauseOnHover
        transition={Slide}
      />
    </>
  )
}

export default MyApp
