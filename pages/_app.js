import { AppProps } from "next/app";
import "../styles/index.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
