import React from "react";
import axios from "./axios"; //protected axios
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();

        this.state = {};
        //definition of BIND
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //definition of STATE
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            //THIS IS HOW I CONS.LOG STATE () => console.log("this is my state:", this.state)
        );
    }
    handleSubmit(e) {
        e.preventDefault();
        //ERROR MESSAGE
        const { first, last, email, password } = this.state;
        if (!first || !last || !email || !password) {
            this.setState({ error: true });
            return;
        }

        //IM SUBMITTING TO THE SERVER
        axios.post("/registration", this.state).then(resp => {
            console.log("response from POST /registration ", resp);
            if (!resp.data.success) {
                this.setState({ error: true });
                return;
            }

            location.replace("/");
        });
    }

    render() {
        return (
            <div className="registration-container">
                {this.state.error && <div>error</div>}

                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="first"
                        typre="text"
                        placeholder="first name"
                    />
                    <input
                        onChange={this.handleChange}
                        name="last"
                        typre="text"
                        placeholder="last name"
                    />
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
                    <button>register</button>
                </form>

                <Link to="/login">
                    <img className="login" src="/login.png" />
                </Link>
            </div>
        );
    }
}
[];
