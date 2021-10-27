import React from "react";
import ReactDOM from "react-dom";
import store from "./app/store";
import { Provider } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

import * as serviceWorker from "./serviceWorker";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/functions";
import FirebaseProvider from "./firebase/FirebaseProvider";

const firebaseConfig = {
  apiKey: "AIzaSyC8lgfrx1-YWQoXRjY_6vZw2nJk3Ow1coM",
  authDomain: "dsc-web-app-18845.firebaseapp.com",
  databaseURL: "https://dsc-web-app-18845.firebaseio.com",
  projectId: "dsc-web-app-18845",
  storageBucket: "dsc-web-app-18845.appspot.com",
  messagingSenderId: "270253222192",
  appId: "1:270253222192:web:63642eb819e62c046240f5",
  measurementId: "G-9XF5CDHZ2V",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const render = (): void => {
  const App = require("./app/App").default;

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <FirebaseProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </FirebaseProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
};

render();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./app/App", render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
