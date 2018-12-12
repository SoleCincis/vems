import React from "react";
import { connect } from "react-redux";
import { onlineUsers } from "./actions";

class OnlineUsers extends React.Component {
    render() {
        console.log("this props users: ", this.props.users);

        if (!this.props.users) {
            return null;
        }
        return (
            <div>
                <h1>your online friends</h1>
                {this.props.users.map(user => {
                    return (
                        <div key={user.id}>
                            {user.first}, {user.last}
                            <img width="70" src={user.imgUrl || "/lume.jpg"} />
                        </div>
                    );
                })}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        users: state.onlineUsers
    };
};

export default connect(mapStateToProps)(OnlineUsers);
