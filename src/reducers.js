export default function reducer(state = {}, action) {
    // add complete list of friends/wannabes to state
    if (action.type == "LIST_OF_FRIENDS_WANNABES") {
        state = { ...state, friendsWannabes: action.friendsWannabes };
    }

    // turn new friend from wannabe to friend (copy state object, only change the new_friend element)
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(user => {
                if (user.id == action.yesFriends) {
                    return { ...user, accepted: true };
                } else {
                    return user;
                }
            })
        };
    }

    // delete friend from list of friends in global state
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(user => {
                return user.id != action.notfriends;
            })
        };
    }

    if (action.type == "LIST_ONLINE_USERS") {
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    return state;
}
