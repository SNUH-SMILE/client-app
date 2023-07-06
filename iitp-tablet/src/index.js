import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, HashRouter } from "react-router-dom";
import AlertStore from "./Providers/AlertContext";
import HcAlert from "./component/HCAlert";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <AlertStore>
        <App />
        <HcAlert />
      </AlertStore>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
