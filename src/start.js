import React from "react"; // importi ovunque
import ReactDOM from "react-dom"; //importi solo qui
import Welcome from "./welcome";
import App from "./app";

let component;
if (location.pathname === "/welcome") {
  component = <Welcome />;
} else {
  component = <App />;
}
//DOM manipulation YOU CAN CALL THIS JUST ONE TIME MIN RTHE ALL PROJECT
ReactDOM.render(component, document.querySelector("main"));
