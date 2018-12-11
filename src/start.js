import React from "react"; // importi ovunque
import ReactDOM from "react-dom"; //importi solo qui
import Welcome from "./welcome";
import App from "./app";
import { initSocket } from "./socket";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";
import { Provider } from "react-redux";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;

if (location.pathname === "/welcome") {
    component = <Welcome />;
} else {
    component = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}
//DOM manipulation YOU CAN CALL THIS JUST ONE TIME MIN RTHE ALL PROJECT
ReactDOM.render(component, document.querySelector("main"));
