import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/styles.css";
import Navigation from "../components/Navigation";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
