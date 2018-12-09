import React from "react";
import axios from "./axios";
//class quando uso state e methods
export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/friends/status/" + this.props.pageOwnerId)
            .then(({ data }) => {
                this.setState(data.results);
            });
    }
    getButtonText() {
        if (!this.state.id) {
            return "Make a friend request";
        } else if (this.state.accepted) {
            return "Unfriend";
        } else if (this.props.pageOwnerId == this.state.receiver_id) {
            return "Cancel Request";
        } else {
            return "Accept Request";
        }
    }
    handleClick() {
        let url;
        if (!this.state.id) {
            url = "/send/friendRequest";
        } else if (this.state.accepted) {
            url = "/delete/friendRequest";
        } else if (this.props.pageOwnerId == this.state.receiver_id) {
            url = "/delete/friendRequest";
        } else {
            url = "/accept/friendRequest";
        }
        axios
            .post(url, {
                id: this.props.pageOwnerId
            })
            .then(({ data }) => {
                this.setState(data.results);
            });
    }

    render() {
        return (
            <button onClick={e => this.handleClick()}>
                {this.getButtonText()}
            </button>
        );
    }
}
