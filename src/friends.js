import React from "react";
import { connect } from "react-redux";
import {
    getListOfFriendsAndWannabes,
    deleteFriend,
    acceptFriend
} from "./actions";

class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch(getListOfFriendsAndWannabes()); //
    }
    // In `render`, map `this.props.friends` and `this.props.wannabes` to elements
    render() {
        if (!this.props.friends) {
            return null;
        }
        console.log(this.props.friends);
        console.log(this.props.wannabes);
        return (
            <div>
                <h1>my friends</h1>
                {this.props.friends.map(friend => {
                    return (
                        <div key={friend.id}>
                            {friend.first} {friend.last}
                            <img
                                width="70"
                                src={friend.imgUrl || "/lume.jpg"}
                            />
                            <button
                                onClick={e =>
                                    this.props.dispatch(deleteFriend(friend.id))
                                }
                            >
                                unfriend
                            </button>
                        </div>
                    );
                })}
                <h1>my wannabes</h1>
                {this.props.wannabes.map(wannabe => {
                    return (
                        <div key={wannabe.id}>
                            {wannabe.first} {wannabe.last}
                            <img
                                width="70"
                                src={wannabe.imgUrl || "/lume.jpg"}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}

// runs everytime something changes in the state
const mapStateToProps = state => {
    // get the whole friends|wannabe list from database and map into two separate lists
    var list = state.friendsWannabes; //server
    return {
        friends: list && list.filter(user => user.accepted == true),
        wannabes: list && list.filter(user => !user.accepted)
    };
};

export default connect(mapStateToProps)(Friends);
