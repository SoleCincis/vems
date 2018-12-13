import React from "react";
import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import { Link } from "react-router-dom";

// THIS IS A COMPONENT AND IS ALWAYS WITH CAPITAL LETTER
export default function Welcome() {
    return (
        <div className="welcome-container">
            <h1 />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />

                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}

//ROUTE = if the url is / , then render registratio if the url id /login then
//render the login
