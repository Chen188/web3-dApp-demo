import '../styles/styles.scss'

import { useEffect } from "react";
import { AccountProvider } from "../context/account";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return(
    <AccountProvider>
       { getLayout(<Component {...pageProps} />) }
    </AccountProvider>
  );
}

export default MyApp;