import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        //ERROR MESSAGE
        const { first, last, email, password } = this.state;
        if (!email || !password) {
            this.setState({ error: true });
            return;
        }
        //IM SUBMITTING TO THE SERVER
        axios.post("/login", this.state).then(resp => {
            console.log("response from POST /Login ", resp);
            if (!resp.data.success) {
                this.setState({ error: true });
                return;
            }

            //redirect user to logo page that must be created
            location.replace("/");
        });
    }
    render() {
        return (
            <div className="login-container">
                <h1> yo u gotta login dooog!!!</h1>
                {this.state.error && <div>error</div>}
                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        typre="text"
                        placeholder="email adresse"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        typre="password"
                        placeholder="password"
                    />
                    <button>login</button>
                </form>
                <Link to="/">
                    <img className="vems" src="/registration2.png" />
                </Link>
            </div>
        );
    }
}
[];
