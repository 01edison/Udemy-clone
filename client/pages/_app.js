import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "../styles/styles.css";
import Navigation from "../components/nav/Navigation";
import { Provider } from "react-redux";
import store from "../store";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";


let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/csrf-token");
      const csrfToken = res.data.csrfToken;
      axios.defaults.headers["X-CSRF-TOKEN"] = csrfToken; // to simply attach a csrf token with every request
    })();

    
  }, []);
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <ToastContainer />
          <Navigation />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
